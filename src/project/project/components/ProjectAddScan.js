/**
 * @name: projectAddScan
 * @author: limingliang
 * @date: 2025-5-21 10:30
 * @description：添加扫描配置
 * @update: 2025-5-21 10:30
 */

import React, {useState, useEffect,useRef} from "react";
import {Form, Input, Col, Steps, Select} from 'antd';
import serverGitPukStore from "../../scanCode/store/ServerGitPukStore";
import scanSchemeStore from "../../scanCode/store/ScanSchemeStore";
import RepositoryServerStore from "../../../setting/ integration/store/RepositoryServerStore";
import {observer} from "mobx-react";
import scanEnvStore from "../../../setting/ integration/store/ScanEnvStore";
const scanWayList=[{value:"server",desc:"服务端扫描(Git)"},{value:"serverUpload",desc:"服务端扫描(包上传)"},{value:"client",desc:"客户端扫描"}]
const scanLanguageList=[{value:"java",desc:"Java"},{value:"javascript",desc:"JavaScript"},{value:"c++",desc:"C、C++"},
        {value:"go",desc:"Go"},{value:"c#",desc:"C#"},{value:"python",desc:"Python"}]
const projectAddScan = (props) => {
    const {step,form,scanWay,setScanWay,setRepository,repository,complexity,setComplexity}=props

    const {findAllRepositoryServer}=RepositoryServerStore
    const {findRepositoryList,findRepositoryBranchList}=serverGitPukStore
    const {findScanSchemeByLanguage} = scanSchemeStore
    const {findAllDeployEnv}=scanEnvStore

    //仓库服务list
    const [repServerList,setRepServerList]=useState([])
    const [repServer,setRepServer]=useState(null);

    //仓库list
    const [repositoryList,setRepositoryList]=useState([]);

    //分支
    const [branchList,setBranchList]=useState([])

    //环境
    const [allEnvList,setAllEnvList]=useState([])
    const [envList,setEnvList]=useState([])
    const [env,setEnv]=useState(null)

    const [jdkEnvList,setJdkEnvList]=useState([])
    const [pythonList,setPythonList]=useState([])

    //选择的扫描方案
    const [scanScheme,setScanScheme]=useState(null)

    //覆盖率测试
    const [cover,setCover]=useState(0)


    const [envText,setEnvVersionText]=useState(null)

    //语言
    const [language,setLanguage]=useState()
    const [scanSchemeList,setScanSchemeList]=useState([])

    const [scanType,setScanType]=useState()

    useEffect(()=>{
        if (step===1){
            findAllRepositoryServer().then(res=>{
                if (res.code===0){
                    setRepServerList(res.data)
                }
            })


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


    //选择扫描方式
    const choiceSanWay = (value) => {
        setScanWay(value)
    }

    //选择仓库服务
    const choiceRepServer = (value) => {
        const serverList=repServerList.filter(a=>a.id===value)
        setRepServer(serverList[0])
    }

    //条件查询仓库
    const onSearchRepository = (value) => {
        if (repServer){
            findRepositoryList({...repServer,repName:value}).then(res=>{
                if (res.code===0){
                    setRepositoryList(res.data)
                }
            })}}

    //选择仓库
    const choiceRepository = (value) => {
        const param=repositoryList.filter(a=>a.id===value);
        setRepository(param[0])
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

    //初始化查询仓库分支
    const onFocusBranch = () => {
        if (repository&&repServer){
            findRepositoryBranchList(repository.id,repServer.id).then(res=>{
                if (res.code===0){
                    setBranchList(res.data)
                }
            })}}

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
                setEnvVersionText("maven版本")
                setComplexity(1)
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
                setComplexity(1)
                type="go"
                break
           /* case "c++":
                setEnvVersionText("python版本")
                type="python"
                break*/
        }
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

    //是否开启复杂度
    const optComplexity = (value) => {
      setComplexity(value)
    }

    return(
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
                        <Select allowClear onChange={choiceRepServer}
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
                        <Select allowClear
                                showSearch
                                placeholder={"请选择仓库"}
                                onChange={choiceRepository}
                                onSearch={onSearchRepository}
                                onFocus={onFocusRepository}
                        >
                            {
                                (repositoryList&&repositoryList.length)&&repositoryList.map(item=>{
                                        return(
                                            <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
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
                        <Select allowClear  placeholder={"请选择分支"}
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
                ((scanWay==="server"||scanWay==="serverUpload")&& language==="java")&&
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
                    {
                        ( language&&language!=="c++"&&language!=="c#")&&
                        <Form.Item
                            label={envText}
                            name={'excEnv'}
                            rules={[{required:true,message:envText}]}
                        >
                            <Select     allowClear
                                        placeholder={"请选择"}
                                        onChange={optEnv}
                                        value={env}
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
                        (complexity===1&&language==='javascript')&&
                        <Form.Item
                            label={'python版本'}
                            name={'python'}
                            rules={[{required:true,message:'python版本'}]}
                        >
                            <Select     allowClear
                                        placeholder={"请选择"}

                                        onChange={optEnv}

                            >
                                {
                                    pythonList.length&&pythonList.map(item=>{
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
                        language!=='javascript'&&language!=='python'&&language!=='c++'&&language!=='c#'&&language!=='java'&&
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
                    {
                        language==='java'&&cover===1&&
                        <Form.Item
                            label={'jdk版本'}
                            name={'jdkEnv'}
                            rules={[{required:true,message:'jdk版本'}]}
                        >
                            <Select     allowClear

                                        placeholder={"请选择"}
                                        onChange={optEnv}

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
    )
}
export default observer(projectAddScan)
