/**
 * @name: ProjectList
 * @author: limingliang
 * @date: 2025-5-21 10:30
 * @description：添加项目
 * @update: 2025-5-21 10:30
 */

import React, {useState, useEffect,useRef} from "react";
import {
    Form,
    Input,
    Col
} from 'antd';
import './ProjectAdd.scss'
import {withRouter} from "react-router";
import {inject, observer} from "mobx-react";
import {Validation} from "../../../common/client/Client";
import BreadcrumbContent from "../../../common/breadcrumb/Breadcrumb";
import Btn from "../../../common/btn/Btn";
import EmptyText from "../../../common/emptyText/EmptyText";
import ProjectPower from "../../../common/project/ProjectPower";
import {getUser} from "tiklab-core-ui";
const { TextArea } = Input;
const layout = {labelCol: {span: 6}};

const ProjectAdd = (props) => {
    const [form] = Form.useForm();
    const {projectStore}=props
    const {findAllProject,createProject}=projectStore

    //所有项目列表
    const [projectList,setProjectList]=useState([])
    //创建的状态
    const [createState,setCreateState]=useState(false)
    const [powerType,setPowerType] = useState("public")


    //错误信息
    const [errorMessage,setErrorMessage]=useState({})



    useEffect(async () => {
        findAllProject().then(res=>{
            if (res.code===0){
                setProjectList(res.data)
            }
        })

    }, []);

    //提交创建
    const onFinish =async () => {
        form.validateFields().then((values) => {
            createProject({...values,
                rules:powerType,
                user:{
                    id:getUser().userId
                }

            }).then(res=>{
                if (res.code===0){
                    props.history.push(`/project`)
                }
            })
        })
    }



    /**
     * 跳转到上一级路由
     */
    const goBack = () => {
        props.history.go(-1)
    }

    return(
        <div className='project-add'>
            <Col
                sm={{span: "18",offset: "1"  }}
                md={{ span: "18"  }}
                lg={{ span: "14", offset: "3" }}
                xl={{ span: "12", offset: "5" }}
                xxl={{ span: "10", offset: "7" }}
            >
                <BreadcrumbContent className='add-title' firstItem={`添加项目`} goBack={goBack}/>
                <div className='add-top'>
                    <Form
                        {...layout}
                        form={form}
                        layout="vertical"
                    >
                        <Form.Item
                            label='项目名称'
                            name='projectName'
                            rules={[
                                {required:true,message:'项目名称不能为空'},
                                {max:30,message:'请输入1~31位以内的名称'},
                                Validation('名称','appoint'),
                                ({getFieldValue}) => ({
                                    validator(rule,value) {
                                        let nameArray = []
                                        if(projectList&&projectList.length>0){
                                            nameArray = projectList && projectList.map(item=>item.name)
                                        }
                                        if (nameArray.includes(value)) {
                                            return Promise.reject('名称已经存在')
                                        }
                                        return Promise.resolve()
                                    }
                                }),
                            ]}
                        >
                            <Input style={{background:'#fff',width:500}} placeholder={"输入仓库组名称"}/>
                        </Form.Item>


                        <ProjectPower
                            powerType={powerType}
                            setPowerType={setPowerType}
                            powerTitle={'项目'}
                        />

                        <Form.Item
                            label="描述"
                            name="projectDesc"
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        <Btn onClick={goBack} title={'取消'} isMar={true}/>
                        {createState?
                            <Btn  title={'加载中'} type={'primary'}/>:
                            <Btn onClick={onFinish} title={'确定'} type={'primary'}/>
                        }
                    </Form>
                </div>
            </Col>
        </div>
    )
}
export default withRouter(inject('projectStore')(observer(ProjectAdd)))
