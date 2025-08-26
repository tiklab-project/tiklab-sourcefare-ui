/**
 * @name: ScanConfig
 * @author: limingliang
 * @date: 2025-06-18 14:30
 * @description：扫描配置
 * @update: 2025-06-18 14:30
 */

import React, {useState, useEffect} from "react";
import {Form, Select} from 'antd';
import Modals from "../../../../common/modal/Modals";
import Btn from "../../../../common/btn/Btn";
import serverGitPukStore from "../../../scanCode/store/ServerGitPukStore";
import scanSchemeStore from "../../../scanCode/store/ScanSchemeStore";
import RepositoryServerStore from "../../../../setting/server/store/RepositoryServerStore";
import scanEnvStore from "../../../../setting/scan/scanEnv/store/ScanEnvStore";

const scanWayList=[{value:"server",desc:"服务端扫描"},{value:"client",desc:"客户端扫描"}]
const ScanConfigEditPop = (props) => {
    const {visible,setVisible,scanConfigData,projectData,updateProjectRep,updateProject,updateProjectEnv,execEnv,jdkEnv}=props
    const [form] = Form.useForm();

    const {findRepositoryList,findRepositoryBranchList}=serverGitPukStore
    const {findAllScanScheme,scanSchemeList} = scanSchemeStore
    const {findAllRepositoryServer}=RepositoryServerStore
    const {findAllDeployEnv}=scanEnvStore

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

    //环境
    const [envList,setEnvList]=useState([])
    const [envId,setEnvId]=useState(null)
    const [jdkId,setJdkId]=useState(null)


    const [jdkEnvList,setJdkEnvList]=useState([])

    //覆盖率测试
    const [cover,setCover]=useState(null)

    useEffect(async () => {
        if (projectData){
            form.setFieldsValue({
                scanWay:projectData?.scanWay,
                scanSchemeId:projectData.scanScheme.id,
                cover:projectData?.cover,
                execEnv:execEnv?.deployEnv.id,
                jdkEnv:jdkEnv?.deployEnv.id
            })

            //查询所有仓库服务
            findAllRepositoryServer().then(res=>{
                if (res.code===0){
                    setRepServerList(res.data)
                }
            })

            //项目扫描方案
            setSchemeData(projectData.scanScheme)

            //覆盖率
            setCover(projectData?.cover)

            setJdkId(jdkEnv?.deployEnv.id)
            setEnvId(execEnv?.deployEnv.id)
        }

        if (scanConfigData){
            form.setFieldsValue({
                repository:scanConfigData?.repositoryName,
                branch:scanConfigData?.branch,
                repositoryServer:scanConfigData?.repositoryServer.id
            })
            setRepServer(scanConfigData.repositoryServer)
            setRepository({
                id:scanConfigData.repositoryCode,
                houseWebUrl:scanConfigData.repositoryAddress,
                name:scanConfigData.repositoryName
            })
        }

        //查询扫描方案
        findAllScanScheme()
        setScanWay(projectData?.scanWay)


        //查询所有扫描环境
        findAllDeployEnv().then(res=>{
            if (res.code===0&&res.data){
                const data=res.data.filter(a=>a.envType!=='jdk');
                setEnvList(data)

                const jdkData=res.data.filter(a=>a.envType==='jdk');
                setJdkEnvList(jdkData)
            }
        })

    }, [scanConfigData,visible]);


    //取消编辑弹窗
    const  cancel= () => {
        form.resetFields()
        setVisible(false)
    }

    const onclick = () => {
        form.validateFields().then((values) => {
            //扫描方案不相等 修改
            if (values.scanSchemeId!==projectData.scanScheme.id||values.cover!==cover){
                updateProject({...projectData,
                    scanScheme:{id:values.scanSchemeId},
                    cover:cover
                })
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

            //扫描环境不同修改项目扫描环境
            if (execEnv.deployEnv.id!==envId){
                updateProjectEnv({...execEnv,deployEnv:{id:envId}})
            }
            if (values.cover===1&&jdkEnv.deployEnv.id!==jdkId){

                updateProjectEnv({...jdkEnv,deployEnv:{id:jdkId}})
            }

            cancel()
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
                scanSchemeId:projectData.scanScheme.id
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
                scanSchemeId:projectData.scanScheme.id
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
        setSchemeData(scanSchemeList.filter(a=>a.id===value)[0])
    }


    //初始化查询仓库分支
    const onFocusBranch = () => {
        if (repository&&repServer){
            findRepositoryBranchList(repository.id,repServer.id).then(res=>{
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

    //是否添加覆盖率测试
    const optCover = (value) => {
        setCover(value)
    }

    const modalFooter = (
        <>
            <Btn onClick={cancel} title={'取消'} isMar={true}/>
            <Btn  title={'确定'} type={'primary'} onClick={onclick} />
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
            title={"更新扫描配置"}
        >
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
                <Form.Item
                    label={'扫描方案'}
                    name={'scanSchemeId'}
                    rules={[{required:true,message:'扫描方案'}]}
                    value={schemeData?.id}
                >
                    <Select  defaultValue={schemeData?.id}   onChange={choiceScheme}  placeholder={"请选择"}>
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
                    scanWay==="server"&&
                    <>
                        <Form.Item
                            label={'扫描环境'}
                            name={'execEnv'}
                            value={envId}
                        >
                            <Select     allowClear
                                        placeholder={"请选择"}
                                        onChange={optEnv}
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

                        {
                            schemeData?.language==='Java'&&
                            <Form.Item
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
                            schemeData?.language==='Java'&&cover===1&&
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
        </Modals>
    )
}
export default ScanConfigEditPop
