
/**
 * @name: integrationToolPop
 * @author: limingliang
 * @date: 2025-5-22 10:30
 * @description：编辑信息弹窗
 * @update: 2025-5-22 10:30
 */
import React,{useState,useEffect,Fragment} from 'react';
import {Form, Input, message, Select} from 'antd';
import "./IntegrationDetails.scss";
import Modal from "../../../common/modal/Modals";
import Btn from "../../../common/btn/Btn";
import scanEnvStore from "../store/ScanEnvStore";
import "./integrationToolPop.scss"
import {observer} from "mobx-react";
const integrationToolPop = (props) => {
    const {visible,setVisible,type,serverData,setServerData} = props
    const [form] = Form.useForm()

    const {createDeployEnv,updateDeployEnv,detectionEnv} = scanEnvStore

    const [text,setText]=useState(null)
    const [installWay,setInstallWay]=useState(0)

    const [envPath,setEnvPath]=useState(null)
    const [checkState,setCheckState]=useState(false)
    const [errorMsg,setErrorMsg]=useState(null)

    const [placePath,setPlacePath]=useState(null)

    useEffect(()=>{
        setInstallWay(0)
        if (visible){
            if (serverData){
                form.setFieldsValue({
                    envName:serverData.envName,
                    envAddress:serverData.envAddress,
                    installWay:serverData.installWay
                })
                setEnvPath(serverData.envAddress)
                setPlacePath(serverData.envAddress)
                setInstallWay(serverData.installWay?serverData.installWay:0)
            }
            if (type==='maven'){
                setText(`请输入${type}路径,如：/maven/bin`)
            }
            if (type==='jdk'){
                setText(`请输入${type}路径,如：/jdk/bin`)
            }
            if (type==='go'){
                setText(`请输入${type}路径,如：/usr/local/go/bin`)
            }
            if (type==='node'){
                setText(`请输入${type}路径,如：/node/bin 地址`)
            }
            if (type==='python'){
                setText(`请输入${type}路径,如：/usr/python/bin 地址`)
            }
        }
    },[type,visible,serverData])




    //切换类
    const optInstallWay = (value) => {
        setErrorMsg(null)
        form.resetFields()
        setInstallWay(value)
        setPlacePath(null)
    }

    //检测
    const onclickCheck = () => {
        setCheckState(true)
        setErrorMsg(null)
        detectionEnv(type).then(res=>{
            if (res.code===0){
                message.success("检测成功")
                form.setFieldsValue({
                    envAddress:res.data,
                })
                setEnvPath(res.data)
                setPlacePath(res.data)
            }else {
                message.error(res.msg,1)
            }
        })
    }


    const onOk = () => {
        form.validateFields().then((values) => {
            if (serverData){
                updateDeployEnv({
                    ...serverData,
                    envName:values.envName,
                    envAddress:envPath,
                    installWay:installWay
                }).then(res=>{
                    if (res.code!==0){
                        message.error(res.msg,1)
                    }else {
                        cancel()
                    }
                })
            }else {
                if (!checkState&&installWay===0){
                    setErrorMsg("未检测安装路径")
                   return
                }
                if (!envPath&&installWay===1){
                    setErrorMsg("路径必填")
                    return
                }
                createDeployEnv({
                    ...values,
                    envType:type,
                    installWay:installWay,
                    envAddress:envPath,
                }).then(res=>{
                    if (res.code!==0){
                        message.error(res.msg,1)
                    }else {
                        cancel()
                    }
                })
            }
        })
    }

    //仓库地址
    const inputRpyName = e => {
        setErrorMsg(null)
        setEnvPath(e.target.value)
    }

    //取消
    const  cancel= () => {
        setCheckState(false)
        setVisible(false)
        setServerData(null)
        setErrorMsg(null)
        setEnvPath(null)
        setPlacePath(null)
        form.resetFields()
    }


    const modalFooter = (
        <>
            <Btn onClick={cancel} title={'取消'} isMar={true}/>
            <Btn onClick={onOk} title={'确定'} type={'primary'}/>
        </>
    )
    return(
        <Modal
            visible={visible}
            onCancel={cancel}
            closable={false}
            footer={modalFooter}
            destroyOnClose={true}
            title={"添加"}
        >
            <div className='host-info-add-modal'>
                <Form form={form} layout='vertical' autoComplete='off'
                      initialValues={{envType:'maven'}}
                >
                    <Form.Item
                        label={'名称'}
                        name={'envName'}
                        rules={[
                            {required:true,message:'名称不能为空'},
                        ]}
                    ><Input  placeholder={"名称"}/>
                    </Form.Item>
                    <Form.Item
                        label={'安装方式'}
                        name={'installWay'}
                    > {/*<Select
                        onChange={optInstallWay}
                        defaultValue={0}
                        options={[
                            { value: 0, label: '全局安装' },
                            { value: 1, label: '本地安装' },
                        ]}
                    />*/}
                        <div className="integration-tool-pop">
                            <div className={`tool-pop-border ${installWay===0&&"tool-pop-border-opt"}`} onClick={()=>optInstallWay(0)}>
                                <div>全局安装</div>
                                <div className='tool-pop-border-desc'>系统已安装全局</div>
                            </div>
                            <div className={`tool-pop-border ${installWay===1&&"tool-pop-border-opt"}`} onClick={()=>optInstallWay(1)}>
                                <div>指定路径安装</div>
                                <div className='tool-pop-border-desc'>系统存在SVN，但没有配置全局命令</div>
                            </div>
                        </div>
                    </Form.Item>
                    {
                        installWay===1&&
                        <div className='tool-pop-detection'>
                            <div className='tool-pop-detection-title'>路径</div>
                            <Input placeholder={text} onChange={inputRpyName}/>
                            {
                                errorMsg&&
                                <div className='tool-pop-detection-error'>{errorMsg}</div>
                            }
                        </div>
                        ||
                        installWay===0&&
                        <div className='tool-pop-detection'>
                           <div className='tool-pop-detection-title'>检测安装路径</div>
                            <Btn onClick={onclickCheck} title={'检测'} isMar={true}/>
                            {
                                errorMsg&&
                                <div className='tool-pop-detection-error'>{errorMsg}</div>
                            }
                        </div>
                    }
                    {
                        (installWay===0&&placePath)&&
                        <Form.Item
                            label={'路径'}
                            name={'envAddress'}
                        >
                            <Input  disabled value={placePath}/>
                        </Form.Item>

                    }

                </Form>
            </div>
        </Modal>
    )
}

export default observer(integrationToolPop)
