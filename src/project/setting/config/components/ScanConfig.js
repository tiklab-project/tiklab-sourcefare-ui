/**
 * @name: ScanConfig
 * @author: limingliang
 * @date: 2025-06-18 14:30
 * @description：扫描配置
 * @update: 2025-06-18 14:30
 */

import React, {useState, useEffect} from "react";
import {Col, Form, Input, Select} from 'antd';
import "./ScanConfig.scss"
import serverGitPukStore from "../../../scanCode/store/ServerGitPukStore";
import scanSchemeStore from "../../../scanCode/store/ScanSchemeStore";
import RepositoryServerStore from "../../../../setting/ integration/store/RepositoryServerStore";
import scanEnvStore from "../../../../setting/ integration/store/ScanEnvStore";
import {withRouter} from "react-router";
import {inject, observer} from "mobx-react";
import Breadcrumb from "../../../../common/breadcrumb/Breadcrumb";
import Btn from "../../../../common/btn/Btn";
import {PrivilegeProjectButton} from 'tiklab-privilege-ui';
const scanWayList=[{value:"server",desc:"服务端扫描(Git)"},{value:"serverUpload",desc:"服务端扫描(包上传)"},{value:"client",desc:"客户端扫描"}]
const scanLanguageList=[{value:"java",desc:"Java"},{value:"javascript",desc:"JavaScript"},{value:"c++",desc:"C、C++"},
    {value:"go",desc:"Go"},{value:"c#",desc:"C#"},{value:"python",desc:"Python"}]

const ScanConfig = (props) => {

    const {match:{params},projectStore}=props

    const {findProject,findProjectRepByProjectId,updateProjectRep,updateProject
        ,findProjectEnvList,updateProjectEnv,createProjectEnv,refresh}=projectStore

    const [form] = Form.useForm();

    const {findRepositoryList,findRepositoryBranchList}=serverGitPukStore
    const {findAllScanScheme,findScanSchemeByLanguage} = scanSchemeStore
    const {findAllRepositoryServer}=RepositoryServerStore
    const {findAllDeployEnv}=scanEnvStore

    const [scanSchemeList,setScanSchemeList]=useState([])
    const [projectData,setProjectData]=useState(null)
    const [scanConfigData,setScanConfigData]=useState(null)

    //扫描方式
    const [scanWay,setScanWay]=useState()
    //仓库服务list
    const [repServerList,setRepServerList]=useState([])
    //当前选择的仓库服务
    const [repServer,setRepServer]=useState(null);

    //仓库list
    const [repositoryList,setRepositoryList]=useState([]);
    const [repository,setRepository]=useState(null);

    //分支
    const [branchList,setBranchList]=useState([])
    //扫描方案
    const [schemeData,setSchemeData]=useState(null)
    const [language,setLanguage]=useState(null)
    //环境
    const [envList,setEnvList]=useState([])
    const [execEnv,setExecEnv]=useState(null)

    const [jdkEnvList,setJdkEnvList]=useState([])
    const [jdkEnv,setJdkEnv]=useState(null)

    const [jdkPythonList,setPythonList]=useState([])
    const [pythonEnv,setPythonEnv]=useState(null)

    const [envId,setEnvId]=useState(null)
    const [jdkId,setJdkId]=useState(null)
    const [pythonId,setPythonId]=useState(null)


    const [envText,setEnvVersionText]=useState(null)

    //覆盖率测试
    const [cover,setCover]=useState(null)

    const [updateState,setUpdateState]=useState(false)
    const [scanType,setScanType]=useState()

    //构建地址
    const [buildPath,setBuildPath]=useState(null)


    useEffect(async () => {
        findProject(params.id).then(res=>{
            setProjectData(res.data)
            form.setFieldsValue({
                scanWay:res.data?.scanWay,
                scanSchemeId:res.data.scanScheme?.id,
                cover:res.data?.cover,
                scanType:res.data.scanType,
                scanLanguage:res.data?.scanLanguage
            })
            setLanguage(res.data?.scanLanguage)

            setScanType(res.data.scanType)
            setBuildPath(res.data.buildPath)
            //查询所有仓库服务
            findAllRepositoryServer().then(res=>{
                if (res.code===0){
                    setRepServerList(res.data)
                }
            })
            //项目扫描方案
            setSchemeData(res.data.scanScheme)

            //覆盖率
            setCover(res.data?.cover)

            //扫描方式
            setScanWay(res.data?.scanWay)
            //通过语言查询扫描方案
            findScanSchemeByLanguage({language:res.data.scanLanguage,scanType:scanType}).then(res=>{
                if (res.code===0){
                    setScanSchemeList(res.data)
                }
            })

            let type;
            const language=res.data.scanScheme?.language.toLowerCase();
            switch (language){
                case "java":
                    setEnvVersionText("maven版本")
                    type="maven"
                    break
                case "jdk":
                    setEnvVersionText("jdk版本")
                    type="jdk"
                    break
                case "javascript":
                    setEnvVersionText("node版本")
                    type="node"
                    break
                case "python":
                    setEnvVersionText("python版本")
                    type="python"
                    break
                case "go":
                    setEnvVersionText("go版本")
                    type="go"
                    break
                case "c#":
                    setEnvVersionText(".net版本")
                    type="net"
                    break
            }

            //查询所有扫描环境
            findAllDeployEnv().then(res=>{
                if (res.code===0&&res.data){
                    const execs= res.data.filter(b=>b.envType===type)
                    setEnvList(execs)

                    const jdkData=res.data.filter(a=>a.envType==='jdk');
                    setJdkEnvList(jdkData)

                    const pythonData=res.data.filter(a=>a.envType==='python');
                    setPythonList(pythonData)

                }
            })
        })



        //查询扫描环境
        findProjectEnvList({projectId:params.id}).then(res=>{
            if (res.code===0&&res.data){
                const env=res.data.filter(a=>"exec"===a.type)
                if (env.length){
                    setExecEnv(env[0])
                    form.setFieldsValue({
                        execEnv:env[0].deployEnv.id,
                    })
                }

                //初始jdk版本
                const jdk=res.data.filter(a=>"jdk"===a.type)
                if (jdk.length){
                    setJdkEnv(jdk[0])
                    form.setFieldsValue({
                        jdkEnv:jdk[0]?.deployEnv.id
                    })
                }

                //初始python版本
                const python=res.data.filter(a=>"python"===a.type)
                if (python.length){
                    setPythonEnv(python[0])
                    form.setFieldsValue({
                        python:python[0]?.deployEnv.id
                    })
                }

            }
        })

        //项目仓库信息
        findProjectRepByProjectId(params.id).then(res=>{
            if (res.code===0){
                setScanConfigData(res.data)
                form.setFieldsValue({
                    repository:res.data?.repositoryName,
                    branch:res.data?.branch,
                    repositoryServer:res.data?.repositoryServer.id
                })
                setRepServer(res.data?.repositoryServer)
                setRepository({
                    id:res.data?.repositoryCode,
                    houseWebUrl:res.data?.repositoryAddress,
                    name:res.data?.repositoryName
                })
            }
        })



    }, [refresh]);




    const onclick = () => {
        form.validateFields().then((values) => {
            //扫描方案不相等 修改
            if (values.scanSchemeId!==projectData.scanScheme?.id||
                projectData.cover!==cover||projectData.buildPath!==buildPath||
                projectData.scanType!==scanType
            ){
                updateProject({...projectData,
                    scanScheme:{id:values.scanSchemeId},
                    scanType:scanType,
                    buildPath:buildPath
                })
              /*  if (!projectData.scanType&&projectData.scanType!==values.scanType){

                }*/
            }
            if (values?.branch!==scanConfigData?.branch||
                repository?.id!==scanConfigData?.repositoryCode||
                values?.repositoryServer!==scanConfigData?.repositoryServer.id) {

                updateProjectRep({
                    ...scanConfigData,
                    repositoryServer:{id:values.repositoryServer},
                    repositoryName:repository?.name,
                    branch:values.branch,
                    repositoryAddress:repository?.houseWebUrl,
                    repositoryCode:repository?.id
                }).then(res=>{
                    if (res.code!==0){
                        message.error("更新失败")
                    }
                })
            }

            //扫描环境
            if (execEnv){
                //扫描环境不同修改项目扫描环境
                if (execEnv.deployEnv?.id!==envId){
                    updateProjectEnv({...execEnv,deployEnv:{id:envId}})
                }
            }else {
                //不存在扫描环境就创建
                createProjectEnv({projectId:params.id,type:"exec",deployEnv:{id:envId}})
            }


            //添加覆盖率
            if (values.cover===1){
                if (!jdkEnv){
                    createProjectEnv({
                        projectId:params.id,
                        type:"jdk",
                        deployEnv:{id:jdkId}
                    })
                }
                if (jdkEnv?.deployEnv.id!==jdkId){
                    updateProjectEnv({...jdkEnv,deployEnv:{id:jdkId}})
                }
            }

        })
    }

    //选择扫描方式
    const choiceSanWay = (value) => {
        setScanWay(value)
    }
    //选择仓库服务
    const choiceRepServer = (value) => {
        if (value!==scanConfigData.repositoryServer.id){
            form.setFieldsValue({
                repository:null,
                branch:null,
                scanSchemeId:null
            })
        }else {
            form.setFieldsValue({
                repository:scanConfigData?.repositoryName,
                branch:scanConfigData?.branch,
                scanSchemeId:projectData.scanScheme?.id
            })
        }
        const serverList=repServerList.filter(a=>a.id===value)
        setRepServer(serverList[0])
    }

    //选择仓库
    const choiceRepository = (value) => {
        if (value!==scanConfigData.repositoryCode){
            form.setFieldsValue({
                branch:null,
                scanSchemeId:null
            })
        }else {
            form.setFieldsValue({
                branch:scanConfigData?.branch,
                scanSchemeId:projectData.scanScheme?.id
            })
        }

        const param=repositoryList.filter(a=>a.id===value);
        setRepository(param[0])
    }
    //条件查询仓库
    const onSearchRepository = (value) => {
        if (repServer){
            findRepositoryList(repServer).then(res=>{
                if (res.code===0){
                    setRepositoryList(res.data)
                }
            })}}

    //初始化查询仓库
    const onFocusRepository = () => {
        if (repServer){
            findRepositoryList(repServer).then(res=>{
                if (res.code===0){
                    setRepositoryList(res.data)
                }
            })}
    }




    //选择方案
    const choiceScheme = (value) => {
        const scheme=scanSchemeList.filter(a=>a.id===value)[0]
        setSchemeData(scheme)
    }


    //初始化查询仓库分支
    const onFocusBranch = () => {
        let repo;
        if (repServer.serverType==='gitee'){
            repo=repository.name
        }else {
            repo=repository.id
        }
        if (repository&&repServer){
            findRepositoryBranchList({
                repServerId:repServer.id,
                repo:repo,
                owner:repository.nameWithSpace
            }).then(res=>{
                if (res.code===0){
                    setBranchList(res.data)
                }
            })}
    }


    //修改扫描环境
    const optEnv = (value) => {
        setEnvId(value)
    }

    //修改jdk环境
    const optJdkEnv = (value) => {
        setJdkId(value)
    }
    //修改python环境
    const optPythonEnv = (value) => {
        setPythonId(value)
    }

    //是否添加覆盖率测试
    const optCover = (value) => {
        setCover(value)
    }


    const setOpenOrClose = () => {

    }

    //切换扫描方式
    const choiceScanType = (value) => {
        setScanType(value)
        form.setFieldsValue({
            scanSchemeId:null,
        })
    }
    //查询扫描方案
    const onFocusScheme = () => {
        findScanSchemeByLanguage({language:language,scanType:scanType}).then(res=>{
            if (res.code===0){
                setScanSchemeList(res.data)
            }
        })
    }

    //初始化扫描环境
    const onFocusExecEnv = () => {

    }

    //输入 c#的项目文件路径
    const inputNetPath = (value) => {
        setBuildPath(value.target.value)
    }


    return(
        <div className='sourcefare scan-config config-page-width'>
            <Col sm={{ span: "22" }}
                 md={{ span: "22" }}
                 lg={{ span: "21" , offset: "1" }}
                 xl={{ span: "17", offset: "3" }}
                 xxl={{ span: "14", offset: "5" }}
            >
                <div className='scan-config-top'>
                    <Breadcrumb firstItem={`扫描配置`}/>
                </div>
                <div className='config-body-deploy'>
                    <Form
                        form={form}
                        layout="vertical"
                    >
                        <Form.Item
                            label={'扫描方式'}
                            name={'scanWay'}
                        >
                            <Select  onChange={choiceSanWay}
                                     placeholder={"请选择扫描方式"}
                                     defaultValue={scanWay}
                                     value={scanWay}
                                     disabled={true}
                            >
                                {
                                    scanWayList.map(item=>{
                                            return(
                                                <Select.Option key={item.value} value={item.value}>{item.desc}</Select.Option>
                                            )
                                        }
                                    )
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={'扫描语言'}
                            name={'scanLanguage'}
                            rules={[{required:true,message:'扫描语言'}]}
                        >
                            <Select   placeholder={"扫描语言"}
                                      disabled={true}
                            >
                                {
                                    scanLanguageList.map(item=>{
                                            return(
                                                <Select.Option key={item.value} value={item.value}>{item.desc}</Select.Option>
                                            )
                                        }
                                    )
                                }
                            </Select>
                        </Form.Item>

                        {
                            scanWay==="server"&&
                            <>
                                <Form.Item
                                    label={'仓库服务'}
                                    name={'repositoryServer'}
                                    rules={[{required:true,message:'仓库服务'}]}
                                >
                                    <Select onChange={choiceRepServer}
                                            placeholder={"请选择仓库服务"}
                                    >
                                        {
                                            (repServerList&&repServerList.length)&&repServerList.map(item=>{
                                                    return(
                                                        <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                                    )
                                                }
                                            )
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label={'仓库'}
                                    name={'repository'}
                                    rules={[{required:true,message:'仓库'}]}
                                >
                                    <Select
                                        showSearch
                                        placeholder={"请选择仓库"}
                                        onChange={choiceRepository}
                                        onSearch={onSearchRepository}
                                        onFocus={onFocusRepository}
                                        value={repository?.id}
                                    >
                                        {
                                            (repositoryList&&repositoryList.length)&&repositoryList.map(item=>{
                                                    return(
                                                        <Select.Option key={item.id} value={item.id}>{item.pathWithSpace}</Select.Option>
                                                    )
                                                }
                                            )
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label={'分支名称'}
                                    name={'branch'}
                                    rules={[{required:true,message:'分支名称'}]}
                                >
                                    <Select   placeholder={"请选择分支"}
                                              onFocus={onFocusBranch}
                                    >
                                        {
                                            (branchList&&branchList.length)&&branchList.map(item=>{
                                                    return(
                                                        <Select.Option key={item.name} value={item.name}>{item.name}</Select.Option>
                                                    )
                                                }
                                            )
                                        }
                                    </Select>
                                </Form.Item>
                            </>
                        }


                        {
                           schemeData?.language==='Java'&&
                            <Form.Item
                                label={'扫描类型'}
                                name={'scanType'}
                                rules={[{required:true,message:'扫描类型'}]}
                            >
                                <Select  allowClear  style={{minWidth:140}} placeholder='扫描类型'  onChange={choiceScanType}>
                                    <Select.Option value={"static"}>{"静态扫描"}</Select.Option>
                                    <Select.Option value={"compile"}>{"编译扫描"}</Select.Option>
                                    <Select.Option value={"collect"}>{"静态+编译扫描"}</Select.Option>
                                </Select>
                            </Form.Item>
                        }

                        <Form.Item
                            label={'扫描方案'}
                            name={'scanSchemeId'}
                            rules={[{required:true,message:'扫描方案'}]}
                            value={schemeData?.id}
                        >
                            <Select  defaultValue={schemeData?.id}
                                     onChange={choiceScheme}
                                     onFocus={onFocusScheme}
                                     placeholder={"请选择"}
                            >
                                {
                                    scanSchemeList.length&&scanSchemeList.map(item=>{
                                            return(
                                                <Select.Option key={item.schemeName} value={item.id}>{item.schemeName}</Select.Option>
                                            )
                                        }
                                    )
                                }
                            </Select>
                        </Form.Item>
                        {
                            ( scanWay==="server"||scanWay==="serverUpload")&&
                            <>

                                {(language==="c#")&&

                                    <div className='scan-config-nav'>
                                        <div className='scan-config-title'>
                                            <div className='scan-config-title-text'>{"构建路径"}</div>
                                            <div className='scan-config-title-desc'>{"(项目sln文件地址、或者csproj文件地址, 为空则默认从根目录获取)"}</div>
                                        </div>
                                        <Input placeholder={"请输入构建路径"} onChange={inputNetPath} value={buildPath}/>
                                    </div>
                                }

                                {
                                    (language!=="c++")&&
                                    <Form.Item
                                        label={envText}
                                        name={'execEnv'}
                                        value={envId}
                                    >
                                        <Select     allowClear
                                                    placeholder={"请选择"}
                                                    onChange={optEnv}
                                                    onFocus={onFocusExecEnv}
                                        >
                                            {
                                                envList.length&&envList.map(item=>{
                                                        return(
                                                            <Select.Option key={item.id} value={item.id}>{item.envName}</Select.Option>
                                                        )
                                                    }
                                                )
                                            }
                                        </Select>
                                    </Form.Item>
                                }
                                {
                                    language==='java'&&cover===1&&                                    <Form.Item
                                        label={'是否开启覆盖测试'}
                                        name={'cover'}
                                        value={cover}
                                    >
                                        <Select
                                            onChange={optCover}
                                            options={[
                                                { value: 0, label: '否' },
                                                { value: 1, label: '是' },
                                            ]
                                            }
                                        />
                                    </Form.Item>
                                }
                                {
                                    language&&language!=='javascript'&&language!=='python'&&language!=='c++'&&language!=='c#'&&language!=='java'&&
                                    <Form.Item
                                        label={'jdk环境'}
                                        name={'jdkEnv'}

                                    >
                                        <Select     allowClear
                                                    placeholder={"请选择"}
                                                    onChange={optJdkEnv}

                                        >
                                            {
                                                jdkEnvList.length&&jdkEnvList.map(item=>{
                                                        return(
                                                            <Select.Option key={item.id} value={item.id}>{item.envName}</Select.Option>
                                                        )
                                                    }
                                                )
                                            }
                                        </Select>
                                    </Form.Item>
                                }

                            </>
                        }
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
                                <PrivilegeProjectButton code={"project_scan_config_update"} domainId={params.id}>
                                    <Btn
                                        type={'primary'}
                                        title={'确定'}
                                        onClick={onclick}
                                    />
                                </PrivilegeProjectButton>

                        }

                    </div>
                </div>
            </Col>
        </div>

    )
}
export default withRouter(inject('projectStore')(observer(ScanConfig)))
