/**
 * @name: RepositoryInfo
 * @author: Deploy
 * @date: 2023-02-17 10:30
 * @description：制品库信息
 * @update: 2023-02-17 10:30
 */
import React, {useState, useEffect} from "react";
import "./ProjectBasicInfo.scss"
import BreadcrumbContent from "../../../common/breadcrumb/Breadcrumb";
import {
    DeleteOutlined,
    DownOutlined,
    EditOutlined,
    RightOutlined
} from "@ant-design/icons";
import {Dropdown, Form, Input, message, Col, Switch, Table, Select} from "antd";
import {inject, observer} from "mobx-react";
import Btn from "../../../common/btn/Btn";
import {PrivilegeProjectButton} from 'tiklab-privilege-ui';
const { TextArea } = Input;
import ProjectDeletePop from "../../../common/project/ProjectDeletePop";
import ProjectPower from "../../../common/project/ProjectPower";
import RepositoryServerStore from "../../../setting/ integration/store/RepositoryServerStore";
import serverGitPukStore from "../../scanCode/store/ServerGitPukStore";
import scanSchemeStore from "../../scanCode/store/ScanSchemeStore";
const scanWayList=[{value:"server",desc:"服务端扫描"},{value:"client",desc:"客户端扫描"}]
const ProjectBasicInfo = (props) => {
    const {match:{params},projectStore} = props;

    const {findProject,projectData,updateProject,deleteProject,findProjectRepByProjectId,updateProjectRep} = projectStore
    const {findAllRepositoryServer}=RepositoryServerStore
    const {findRepositoryList,findRepositoryBranchList}=serverGitPukStore
    const {findAllScanScheme,scanSchemeList} = scanSchemeStore

    const [form] = Form.useForm()
    const [expandedTree,setExpandedTree] = useState([])  // 树的展开与闭合
    const [powerType,setPowerType] = useState("")  //  项目权限类型

    const [name,setName]=useState('')   //项目名称

    const [updateState,setUpdateState]=useState(false)
    const [deleteVisible,setDeleteVisible]=useState(false)  //删除弹窗状态

    //扫描方式
    const [scanWay,setScanWay]=useState()
    //仓库服务list
    const [repServerList,setRepServerList]=useState([])
    const [repServer,setRepServer]=useState(null);

    //仓库list
    const [repositoryList,setRepositoryList]=useState([]);
    const [repository,setRepository]=useState(null);

    //分支
    const [branchList,setBranchList]=useState([])
    //扫描方案
    const [schemeData,setSchemeData]=useState(null)

    //项目仓库信息
    const [projectRep,setProjectRep]=useState(null)

    useEffect(async () => {
        findProject(params.id).then(res=>{
            if (res.code===0){
                setPowerType(res?.data.rules)
                setName(res?.data.name)
                setScanWay(res?.data.scanWay)
                setSchemeData(res?.data.scanScheme)

                form.setFieldsValue({
                    scanWay:res?.data.scanWay,
                    scanSchemeId:res.data.scanScheme.id
                })

            }
        })

        findAllScanScheme()
        findProjectRepByProjectId(params.id).then(res=>{
            if (res.code===0){
                setProjectRep(res.data)
                form.setFieldsValue({
                    repository:res.data?.repositoryName,
                    branch:res.data?.branch,
                    repositoryServer:res.data?.repositoryServer.id
                })
                setRepServer(res.data?.repositoryServer)
            }
        })

        findAllRepositoryServer().then(res=>{
            if (res.code===0){
                setRepServerList(res.data)
            }
        })

        onFocusBranch()
    }, [params.id]);


    //初始化查询仓库分支
    const onFocusBranch = () => {
        if (repository&&repServer){
            findRepositoryBranchList(repository.id,repServer.id).then(res=>{
                if (res.code===0){
                    setBranchList(res.data)
                }
            })
        }
    }


    //提交修改
    const onOk = async (values) => {
        updateProject({...projectData,
            name:name,
            rules:powerType
        })
    }

    const onOkScan = (values) => {
        updateProject({...projectData,
            scanScheme:{
                id:values.scanSchemeId
            },
            scanWay:values.scanWay
        })
        if (values.scanWay==='client'){
            updateProjectRep({...projectRep,
                repositoryServer:{id:values.repositoryServer},
                repositoryName:repository?.name,
                branch:values.branch,
                repositoryAddress:repository?.houseWebUrl
            })
        }
    }

    /**
     * 是否存在key
     * @param key
     * @returns {boolean}
     */
    const isExpandedTree = key => {
        return expandedTree.some(item => item ===key)
    }


    /**
     * 展开和闭合
     * @param key
     */
    const setOpenOrClose = key => {
        if (isExpandedTree(key)) {
            // false--闭合
            setExpandedTree(expandedTree.filter(item => item !== key))
        } else {
            // ture--展开
            setExpandedTree(expandedTree.concat(key))
        }
    }

    //修改项目名称
    const inputProjectName =async (e) => {
        const value = e.target.value;
        setName(value)
    }



    //选择扫描方式
    const choiceSanWay = (value) => {
        setScanWay(value)
    }
    //选择仓库服务
    const choiceRepServer = (value) => {
        const serverList=repServerList.filter(a=>a.id===value)
        setRepServer(serverList[0])
    }
    //选择仓库
    const choiceRepository = (value) => {
        const param=repositoryList.filter(a=>a.id===value);
        setRepository(param[0])
    }

    //初始化查询仓库
    const onFocusRepository = () => {
        if (repServer){
            findRepositoryList(repServer).then(res=>{
                if (res.code===0){
                    setRepositoryList(res.data)
                }
            })
        }
    }
    //条件查询仓库
    const onSearchRepository = (value) => {
        if (repServer){
            findRepositoryList(repServer).then(res=>{
                if (res.code===0){
                    setRepositoryList(res.data)
                }
            })}}

    //选择方案
    const choiceScheme = (value) => {
        setSchemeData(scanSchemeList.filter(a=>a.id===value)[0])
    }

    const list=[
        {
            key:1,
            title:'项目信息',
            desc: '更新项目信息',
            icon: <EditOutlined />,
            enCode:'house_update',
            content: <div className='bottom-rename'>
                <Form
                    form={form}
                    autoComplete='off'
                    layout='vertical'
                    name='name'
                    initialValues={{name:projectData?.name,projectDesc:projectData?.projectDesc}}
                >
                    <Form.Item
                        label="项目名称"
                        name="name"
                        rules={[{required: true, message: '项目名称必填'}]}
                    >
                        <Input  onChange={inputProjectName}/>
                    </Form.Item>
                    <div style={{width: '80%'}}>
                        <ProjectPower
                            powerType={powerType}
                            setPowerType={setPowerType}
                            powerTitle={'项目'}
                        />
                    </div>

                    <Form.Item
                        label="描述"
                        name="projectDesc"
                    >
                        <TextArea rows={4} style={{width: '80%'}} />
                    </Form.Item>
                </Form>

                <div className='bottom-rename-btn'>
                    <Btn
                        title={'取消'}
                        isMar={true}
                        onClick={()=>setOpenOrClose(1)}
                    />

                    {
                        updateState?
                                <Btn  title={'加载中'} type={'primary'}/>:
                            <PrivilegeProjectButton code={"project_update"} domainId={projectData && projectData.id}>
                                <Btn
                                    type={'primary'}
                                    title={'确定'}
                                    onClick={() => {
                                        form.validateFields()
                                            .then((values) => {
                                                onOk(values)
                                            })
                                    }}
                                />
                            </PrivilegeProjectButton>

                    }

                </div>
            </div>
        },
        {
            key:3,
            title:'项目删除',
            desc: '删除项目',
            icon: <DeleteOutlined />,
            enCode:'house_delete',
            content: <div className='bottom-delete'>
                <div style={{color:'#ff0000',paddingBottom:5,fontSize:13}}>
                    此操作无法恢复！请慎重操作！
                </div>
                <Btn title={'取消'} isMar={true} onClick={()=>setOpenOrClose(3)}/>
                <PrivilegeProjectButton code={"project_delete"} domainId={projectData && projectData.id}>
                    <Btn onClick={()=>setDeleteVisible(true)} type={'dangerous'} title={'删除'}/>
                </PrivilegeProjectButton>


            </div>
        }
    ]

    const lisItem = (item,index) =>{
        return(
           <div key={item.key} className={`${index>0?' border-top':''}`}>
                    <div className={`basicInfo-li-top ${isExpandedTree(item.key) ?'basicInfo-li-select':''}`}
                         onClick={()=>setOpenOrClose(item.key)}>
                        <div className='basicInfo-li-icon'>{item.icon}</div>
                        <div className='basicInfo-li-center'>
                            <div className='basicInfo-li-title'>{item.title}</div>
                            {
                                !isExpandedTree(item.key) &&
                                <div className='basicInfo-li-desc'>{item.desc}</div>
                            }
                        </div>
                        <div className='basicInfo-li-down'>
                            {isExpandedTree(item.key)? <DownOutlined />:<RightOutlined />}
                        </div>
                    </div>
                    <div className={`${isExpandedTree(item.key)? 'basicInfo-li-bottom':'basicInfo-li-none'}`}>
                        {
                            isExpandedTree(item.key) && item.content
                        }
                    </div>
                </div>
        )
    }

    return(
        <div className='basicInfo sourcefare'>
            <Col
                sm={{ span: "24" }}
                md={{ span: "24" }}
                lg={{ span: "24" }}
                xl={{ span: "19", offset: "2" }}
                xxl={{ span: "17", offset: "3" }}
            >
                <div className='basicInfo-up'>
                    <BreadcrumbContent firstItem={'项目信息'}/>
                </div>
                <div className='basicInfo-li'>
                    {
                        list.map((item,index)=> lisItem(item,index) )
                    }
                </div>
                <ProjectDeletePop {...props}
                                  deleteVisible={deleteVisible}
                                  project={projectData}
                                  setDeleteVisible={setDeleteVisible}
                                  deleteProject={deleteProject}/>
            </Col>
        </div>
    )
}
export default inject('projectStore')(observer(ProjectBasicInfo))
