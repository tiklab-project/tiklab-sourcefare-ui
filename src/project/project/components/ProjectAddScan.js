/**
 * @name: projectAddScan
 * @author: limingliang
 * @date: 2025-5-21 10:30
 * @description：添加扫描配置
 * @update: 2025-5-21 10:30
 */

import React, {useState, useEffect,useRef} from "react";
import {Form, Input, Col, Steps, Select, Spin, Button, Divider} from 'antd';
import serverGitPukStore from "../../scanCode/store/ServerGitPukStore";
import scanSchemeStore from "../../scanCode/store/ScanSchemeStore";
import RepositoryServerStore from "../../../setting/ integration/store/RepositoryServerStore";
import {observer} from "mobx-react";
import scanEnvStore from "../../../setting/ integration/store/ScanEnvStore";
import "./projectAddScan.scss"
import Btn from "../../../common/btn/Btn";
import AddServerPop from "./AddServerPop";
const scanWayList=[{value:"server",desc:"服务端扫描(Git)"},{value:"serverUpload",desc:"服务端扫描(包上传)"},{value:"client",desc:"客户端扫描"}]
const scanLanguageList=[{value:"java",desc:"Java"},{value:"javascript",desc:"JavaScript"},{value:"c++",desc:"C、C++"},
        {value:"go",desc:"Go"},{value:"c#",desc:"C#"},{value:"python",desc:"Python"}]
const projectAddScan = (props) => {
    const {step,form,scanWay,setScanWay,setRepository,repository,setComplexity,setBuildPath,setBranch}=props

    const {findAllRepositoryServer}=RepositoryServerStore
    const {findRepositoryList,findRepositoryBranchList}=serverGitPukStore
    const {findScanSchemeByLanguage} = scanSchemeStore
    const {findAllDeployEnv}=scanEnvStore

    //仓库服务list
    const [repServerList,setRepServerList]=useState([])
    const [repServer,setRepServer]=useState(null);

    //仓库list
    const [repositoryList,setRepositoryList]=useState([]);
    const [repoSpin,setRepoSpin]=useState(false)

    //分支
    const [branchList,setBranchList]=useState([])
    const [branchSpin,setBranchSpin]=useState(false)

    //环境
    const [allEnvList,setAllEnvList]=useState([])
    const [envList,setEnvList]=useState([])
    const [env,setEnv]=useState(null)

    const [jdkEnvList,setJdkEnvList]=useState([])
    const [pythonList,setPythonList]=useState([])


    //覆盖率测试
    const [cover,setCover]=useState(0)

    const [envText,setEnvVersionText]=useState(null)

    //语言
    const [language,setLanguage]=useState()
    const [scanSchemeList,setScanSchemeList]=useState([])

    const [scanType,setScanType]=useState("static")

    const [envType,setEnvType]=useState(null);

    //添加服务状态
    const [serverVisible,setServerVisible]=useState(false)

    const [branchName]=useState("master")

    useEffect(()=>{
        if (step===1){
            findAllDeployEnv().then(res=>{
                if (res.code===0&&res.data){
                    setAllEnvList(res.data)

                    const jdkData=res.data.filter(a=>a.envType==='jdk');
                    setJdkEnvList(jdkData)

                    const pythonData=res.data.filter(a=>a.envType==='python');
                    setPythonList(pythonData)
                }
            })
        }
    },[step])


    //初始化仓库服务
    const onFocusRepoServer = () => {
        findAllRepositoryServer().then(res=>{
            if (res.code===0){
                setRepServerList(res.data)
            }
        })
    }
    //添加服务的状态
    const addServerState = (value) => {
        if (value){

        }
    }


    //选择扫描方式
    const choiceSanWay = (value) => {
        setScanWay(value)
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

    //选择仓库服务
    const choiceRepServer = (value) => {
        const serverList=repServerList.filter(a=>a.id===value)
        setRepServer(serverList[0])
        setRepositoryList([])
        setBranchList([])
        form.setFieldsValue({
            repository:null,
            scanSchemeId:null,
            scanType:null,
            excEnv:null,
            python:null,
            cover:null,
            jdkEnv:null,
        })
    }


    //初始化查询仓库
    const onFocusRepository = () => {
        if (repServer){
            setRepoSpin(true)
            findRepositoryList(repServer).then(res=>{
                setRepoSpin(false)
                if (res.code===0){
                    setRepositoryList(res.data)
                }
            })
        }
    }

    //条件查询仓库
    const onSearchRepository = (value) => {
        if (repServer){
            //setRepoSpin(true)
            findRepositoryList({...repServer,repName:value}).then(res=>{
               // setRepoSpin(false)
                if (res.code===0){
                    setRepositoryList(res.data)
                }
            })}}

    //选择仓库
    const choiceRepository = (value) => {
        const param=repositoryList.filter(a=>a.id===value);
        setRepository(param[0])
        setBranchList([])
    }

    //切换语言
    const choiceLanguage = (value) => {
        setLanguage(value)
        form.setFieldsValue({
            scanSchemeId:null,
            scanType:null,
            excEnv:null,
            python:null,
            cover:null,
            jdkEnv:null,

        })
        optScanScheme(value)
    }

    //切换扫描方式
    const choiceScanType = (value) => {
        setScanType(value)
        form.setFieldsValue({
            scanSchemeId:null,
        })
    }



    //初始化查询仓库分支
    const onFocusBranch = () => {
        if (repository&&repServer){
            let repo;
            let owner;
            if (repServer.serverType==='gitee'){
                repo=repository.name
                owner=repository.nameWithSpace
            }else {
                repo=repository.id
            }
            setBranchSpin(true)
            findRepositoryBranchList({
                repServerId:repServer.id,
                repo:repo,
                owner:owner
            }).then(res=>{
                setBranchSpin(false)
                if (res.code===0){
                    setBranchList(res.data)
                }else {
                    message.error(res.msg)
                }
            })}
    }


    //查询扫描方案
    const onFocusScheme = () => {
        findScanSchemeByLanguage({language:language,scanType:scanType}).then(res=>{
            if (res.code===0){
                setScanSchemeList(res.data)
            }
        })
    }


    //添加扫描方案
    const optScanScheme = (value) => {
        setComplexity(0)

        let type;
        switch (value){
            case "java":
                setEnvVersionText("Maven版本")
                setComplexity(1)
                type="maven"
                break
            case "jdk":
                setEnvVersionText("Jdk版本")
                type="jdk"
                break
            case "javascript":
                setEnvVersionText("Node版本")
                type="node"
                break
            case "python":
                setEnvVersionText("Python版本")
                type="python"
                break
            case "go":
                setEnvVersionText("Go版本")
                setComplexity(1)
                type="go"
                break
            case "c#":
                setEnvVersionText(".Net版本")
                type="net"
                break
        }
        setEnvType(type)
        const param=allEnvList.filter(a=>a?.envType.toLowerCase()===type)
        setEnvList(param)
    }

    //是否添加覆盖率测试
    const optEnv = (value) => {
        setEnv(value)
    }

    //是否添加覆盖率测试
    const optCover = (value) => {
      setCover(value)
    }



    //跳转配置
    const goSetting = (type) => {
        switch (type){
            case "server":
                setServerVisible(true)
              /*  props.history.push(`setting/server/code`)*/
                break
            case "env":
                props.history.push(`setting/tool/${envType}`)
                break
            case "jdk":
                props.history.push(`setting/tool/jdk`)
        }
    }

    //输入 c#的项目文件路径
    const inputNetPath = (value) => {
        setBuildPath(value.target.value)
    }

    //输入 分支名字
    const inputBranch = (value) => {
        setBranch(value.target.value)
    }

    //选择仓库
    const choiceBranch = (value) => {
        setBranch(value)
    }

    return(
        <div>
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


                {
                    scanWay==="server"&&
                    <>
                        <Form.Item
                            label={'仓库服务'}
                            name={'repositoryPath'}
                            rules={[{required:true,message:'仓库服务'}]}

                        >
                            <Select allowClear
                                    onChange={choiceRepServer}
                                    placeholder={"请选择仓库服务"}
                                    onFocus={onFocusRepoServer}
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <Divider style={{margin:"4px 0"}} />
                                            <div className='project-add-scan-add' onClick={()=>goSetting("server")}>添加</div>
                                        </>

                                    )}
                            >
                                {
                                    (repServerList&&repServerList.length)&&repServerList.map(item=>{
                                            return(
                                                <Select.Option key={item.id} value={item.id}>
                                                    {item.name}

                                                    <span className='add-scan-server-desc'>
                                                         {`(${item.address})`}
                                                    </span>
                                                </Select.Option>
                                            )
                                        }
                                    )
                                }
                            </Select>
                        </Form.Item>

                        {
                            repServer?.serverType==="url"?
                                <Form.Item
                                    label={'分支'}
                                    name={'branch'}
                                    rules={[{required:true,message:'分支名称'}]}
                                >
                                    <Input placeholder={"分支"}  onChange={inputBranch}/>
                                </Form.Item>:
                                <>
                                    <Form.Item
                                        label={'仓库'}
                                        name={'repository'}
                                        rules={[{required:true,message:'仓库'}]}
                                    >
                                        <Select
                                               /* showSearch*/
                                            showSearch
                                                placeholder={"请选择仓库"}
                                                filterOption={false}
                                                onChange={choiceRepository}
                                                onSearch={onSearchRepository}
                                                onFocus={onFocusRepository}
                                                notFoundContent={repoSpin ? <Spin size="small" /> :
                                                    <div className='scanPlay-pop'>{"暂无数据"}</div>}
                                        >
                                            {
                                                repositoryList.map(item=>{
                                                        return(
                                                            <Select.Option key={item.id} value={item.id}>{item.pathWithSpace}</Select.Option>
                                                        )
                                                    }
                                                )
                                            }
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        label={'分支'}
                                        name={'branch'}
                                        rules={[{required:true,message:'分支名称'}]}
                                        onChange={choiceBranch}
                                    >
                                        <Select allowClear  placeholder={"请选择分支"}
                                                onFocus={onFocusBranch}
                                                notFoundContent={branchSpin ? <Spin size="small" /> : null}
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
                    </>
                }
                <Form.Item
                    label={'扫描语言'}
                    name={'scanLanguage'}
                    rules={[{required:true,message:'扫描语言'}]}
                >
                    <Select   placeholder={"扫描语言"}
                              onChange={choiceLanguage}
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
                    language==="java"&&
                    <Form.Item
                        label={'扫描类型'}
                        name={'scanType'}
                        rules={[{required:true,message:'扫描类型'}]}
                    >
                        <Select  allowClear  style={{minWidth:140}} placeholder='扫描类型'  onChange={choiceScanType}>
                            <Select.Option value={"static"}>{"静态扫描"}</Select.Option>
                            <Select.Option value={"compile"}>{"编译扫描"}</Select.Option>
                           {/* <Select.Option value={"collect"}>{"静态+编译扫描"}</Select.Option>*/}
                        </Select>
                    </Form.Item>
                }

                {
                    language&&
                    <Form.Item
                        label={'扫描方案'}
                        name={'scanSchemeId'}
                        rules={[{required:true,message:'扫描方案'}]}
                    >
                        <Select     allowClear
                                    placeholder={"请选择扫描方案"}
                                    onFocus={onFocusScheme}
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
                }

                {
                    (scanWay==="server"||scanWay==="serverUpload")&&
                    <>

                        {  ( language&&language==="c#")&&

                            <div className='add-scan-add-nav'>
                                <div className='add-scan-add-title'>
                                    <div className='add-scan-add-title-text'>{"构建路径"}</div>
                                    <div className='add-scan-add-title-desc'>{"(项目sln文件地址、或者csproj文件地址, 为空则默认从根目录获取)"}</div>
                                </div>
                                <Input placeholder={"请输入构建路径 ,以项目根目录开始"} onChange={inputNetPath}/>
                            </div>
                        }
                        {
                            (language==='java'&&scanType!=='static')&&
                            <Form.Item
                                label={'Jdk版本'}
                                name={'jdkEnv'}
                                rules={[{required:true,message:'jdk版本'}]}
                            >
                                <Select     allowClear

                                            placeholder={"请选择"}
                                            onChange={optEnv}
                                            dropdownRender={(menu) => (
                                                <>
                                                    {menu}
                                                    <Divider style={{margin:"4px 0"}} />
                                                    <div className='project-add-scan-add' onClick={()=>goSetting("jdk")}>添加</div>
                                                </>

                                            )}
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
                        {
                            ( language&&(language!=="c++"&&(scanType!=='static'||language!=='java')))&&
                            <Form.Item
                                label={envText}
                                name={'excEnv'}
                                rules={[{required:true,message:envText}]}
                            >
                                <Select     allowClear
                                            placeholder={"请选择"}
                                            onChange={optEnv}
                                            value={env}
                                            dropdownRender={(menu) => (
                                                <>
                                                    {menu}
                                                    <Divider style={{margin:"4px 0"}} />
                                                    <div className='project-add-scan-add' onClick={()=>goSetting("env")}>添加</div>
                                                </>

                                            )}
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
                            language&&language!=='javascript'&&language!=='python'&&language!=='c++'&&language!=='c#'&&language!=='java'&&
                            <Form.Item
                                label={'是否开启覆盖测试'}
                                name={'cover'}
                            >
                                <Select
                                    onChange={optCover}
                                    defaultValue={cover}
                                    options={[
                                        { value: 0, label: '否' },
                                        { value: 1, label: '是' },
                                    ]
                                    }
                                />
                            </Form.Item>
                        }

                    </>
                }
            </Form>
            <AddServerPop {...props}
                visible={serverVisible}
                setVisible={setServerVisible}
                addState={addServerState}
            />
        </div>

    )
}
export default observer(projectAddScan)
