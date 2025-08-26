/**
 * @name: ProjectUpdatePop
 * @author: limingliang
 * @date: 2025-5-21 10:30
 * @description：更新项目
 * @update: 2025-5-21 10:30
 */
import React, {useState, useEffect,useRef} from "react";
import Modals from "../../../common/modal/Modals";
import Btn from "../../../common/btn/Btn";
import {Form, Input} from "antd";
import ProjectPower from "../../../common/project/ProjectPower";
import TextArea from "antd/es/input/TextArea";
const ProjectUpdatePop = (props) => {
    const {visible,setVisible,project,updateProject}=props
    const [form] = Form.useForm();

    const [updateState,setUpdateState]=useState(false)
    const [powerType,setPowerType] = useState("")  //  项目权限类型

    const [name,setName]=useState('')   //项目名称

    useEffect(async () => {
       if (visible){
           setPowerType(project?.rules)
           setName(project?.name)
           form.setFieldsValue({
               name:project?.name,
               projectDesc:project?.projectDesc
           })
       }
    }, [visible]);

    //修改项目名称
    const inputProjectName =async (e) => {
        const value = e.target.value;
        setName(value)
    }

    //取消编辑弹窗
    const  cancel= () => {
        form.resetFields()
        setVisible(false)
    }

    //提交
    const onFinish = () => {
        updateProject({...project,
            name:name,
            rules:powerType
        }).then(res=>{
            res.code===0&&cancel()
        })
    }

    const modalFooter = (
        <>
            <Btn onClick={cancel} title={'取消'} isMar={true}/>
            {updateState?
                <Btn  title={'加载中'} type={'primary'}/>:
                <Btn onClick={onFinish} title={'确定'} type={'primary'}/>
            }
        </>
    )

    return(
        <Modals
            visible={visible}
            onCancel={cancel}
            closable={false}
            footer={modalFooter}
            destroyOnClose={true}
            width={700}
            title={"更新项目"}
        >
            <Form
                form={form}
                autoComplete='off'
                layout='vertical'
                name='name'

            >
                <Form.Item
                    label="项目名称"
                    name="name"
                    rules={[{required: true, message: '项目名称必填'}]}
                >
                    <Input  onChange={inputProjectName}/>
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
                    <TextArea rows={4}  />
                </Form.Item>
            </Form>
        </Modals>
    )

}
export default ProjectUpdatePop
