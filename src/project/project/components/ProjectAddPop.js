/**
 * @name: ProjectAddPop
 * @author: limingliang
 * @date: 2025-5-21 10:30
 * @description：添加项目
 * @update: 2025-5-21 10:30
 */
import ProjectAddScan from "./ProjectAddScan";
import "./ProjectAddPop.scss"
const scanWayList=[{value:"server",desc:"服务端扫描"},{value:"client",desc:"客户端扫描"}]
import React, {useState, useEffect,useRef} from "react";
import {Form, Input, Col, Steps, Select} from 'antd';
import {withRouter} from "react-router";
import {inject, observer} from "mobx-react";
import {Validation} from "../../../common/client/Client";
import Btn from "../../../common/btn/Btn";
import ProjectPower from "../../../common/project/ProjectPower";
import {getUser} from "tiklab-core-ui";
import Modals from "../../../common/modal/Modals";
import ProjectAddBasics from "./ProjectAddBasics";
const { TextArea } = Input;
const { Step } = Steps;
const ProjectAddPop = (props) => {

    const {visible,setVisible,editType}=props
    const [form] = Form.useForm();
    const {projectStore}=props
    const {findAllProject,createProject}=projectStore

    //所有项目列表
    const [projectList,setProjectList]=useState([])
    //创建的状态
    const [createState,setCreateState]=useState(false)
    const [powerType,setPowerType] = useState("public")

    //步骤
    const [step,setStep]=useState(0)

    //添加的项目的内容
    const [addProjectData,setAddProjectData]=useState(null)

    //复杂度测试
    const [complexity,setComplexity]=useState(0)

    //扫描方式
    const [scanWay,setScanWay]=useState('server')
    const [repository,setRepository]=useState(null);

    //c#构建命令
    const [buildPath,setBuildPath]=useState()

    //分支
    const [branch,setBranch]=useState("branch")



    useEffect(async () => {
        if (visible){
            findAllProject().then(res=>{
                if (res.code===0){
                    setProjectList(res.data)
                }
            })
        }

    }, [visible]);

    //添加项目数据
    const addProject = () => {
        form.validateFields().then((values) => {
            setStep(1)
            setAddProjectData({...values,
                rules:powerType,
                user:{
                    id:getUser().userId
                }
            })
        })
    }


    //取消编辑弹窗
    const  cancel= () => {
        form.resetFields()
        setStep(0)
        setVisible(false)
        form.setFieldsValue({
            repositoryPath:null,
            repository:null,
            scanSchemeId:null,
            scanType:null,
            excEnv:null,
            python:null,
            cover:null,
            jdkEnv:null,
        })
    }

    const onclickCreate = () => {
        form.validateFields().then((values) => {
            const data=values.branch?values.branch:branch
            setCreateState(true)
            createProject({
                ...addProjectData,
                scanWay:scanWay,
                scanScheme:{
                    id:values.scanSchemeId
                },
                repositoryServerId:values.repositoryPath,
                repositoryName:repository?.name,
                branch:data,
                repositoryAddress:repository?.houseWebUrl,
                repositoryCode:repository?.id,
                cover:values.cover,
                excEnv:values.excEnv,
                jdkEnv:values.jdkEnv,
                complexity:values.complexity,
                python:values.python,
                scanType:values.scanType,
                scanLanguage:values.scanLanguage,
                buildPath:buildPath,
            }).then(res=>{
                setCreateState(false)
                if (res.code===0){
                    props.history.push(`/project/${res.data}/report`)
                }
            })
        })
    }



    //跳转步骤
    const jumpSteps = (value) => {
        setStep(value)
        form.setFieldsValue({
            repositoryPath:null,
            repository:null,
            branch:null,
            scanLanguage:null,
            scanSchemeId:null,
            scanType:null,
            excEnv:null,
            python:null,
            cover:null,
            jdkEnv:null,
        })
    }


    const modalFooter = (
        <>
            <Btn onClick={cancel} title={'取消'} isMar={true}/>
            {
                step===0?
                    <Btn  title={'下一步'} type={'primary'} onClick={addProject}/>
                :
                <>
                    <Btn  title={'上一步'}  onClick={()=>jumpSteps(0)} isMar={true}/>
                    {createState? <Btn  title={'加载中'} type={'primary'}/>:
                        <Btn  title={'确定'} type={'primary'} onClick={onclickCreate} />
                    }
                </>
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
            title={"添加项目"}
        >

            <div>
                <div style={{marginBottom:15}}>
                    <Steps size="small" current={step}>
                        <Step title="项目信息" />
                        <Step title="配置扫描" />
                    </Steps>
                </div>

                {
                    step===0?
                        <ProjectAddBasics {...props}
                                          form={form}
                                          projectList={projectList}
                                          powerType={powerType}
                                          setPowerType={setPowerType}/>
                        :

                        <ProjectAddScan {...props}
                                        setScanWay={setScanWay}
                                        scanWay={scanWay}
                                        setRepository={setRepository}
                                        repository={repository}
                                        step={step}
                                        form={form}
                                        complexity={complexity}
                                        setComplexity={setComplexity}
                                        setBuildPath={setBuildPath}
                                        onclickCreate={onclickCreate}
                                        setBranch={setBranch}
                        />
                }
            </div>

        </Modals>

    )
}
export default withRouter(inject('projectStore')(observer(ProjectAddPop)))
