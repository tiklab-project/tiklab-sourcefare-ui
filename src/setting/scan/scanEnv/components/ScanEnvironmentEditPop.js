/**
 * @name: ScanEnvironmentEditPop
 * @author: limingliang
 * @date: 2023-05-22 14:30
 * @description：创建更新扫描环境
 * @update: 2023-05-22 14:30
 */
import React,{useState,useEffect,Fragment} from 'react';
import {Form, Input, Select} from 'antd';
import "./EnvExec.scss";
import TextArea from "antd/es/input/TextArea";
import scanEnvStore from "../store/ScanEnvStore";
import Btn from "../../../../common/btn/Btn";
import Modal from "../../../../common/modal/Modals";
const ScanEnvironmentEditPop = (props) => {
    const {visible,setVisible,envData,setEnvData} = props

    const {createDeployEnv,updateDeployEnv} = scanEnvStore


    const [form] = Form.useForm()

    const [envType,setEnvType]=useState('maven')  //认证信息
    const [authType,setAuthType]=useState('account')  //认证信息
    useEffect(()=>{
        if (envData){
            form.setFieldsValue({
                envType:envData.envType,
                envName:envData.envName,
                envAddress:envData.envAddress
            })
        }
    },[envData])

    /**
     * 添加
     */
    const onOk = () => {
        form.validateFields().then((values) => {
            if (envData){
                updateDeployEnv({...values,id:envData.id})
            }else {
                createDeployEnv(values)
            }
            cancel()
        })
    }
    //取消
    const  cancel= () => {
        setEnvType('')
        setAuthType('')
        setVisible(false)
        setEnvData(null)
        form.resetFields()
    }

    const modalFooter = (
        <>
            <Btn onClick={cancel} title={'取消'} isMar={true}/>
            <Btn onClick={onOk} title={'确定'} type={'primary'}/>
        </>
    )

    //切换环境信息
    const changeEnvType = (value) => {

        setEnvType(value)
    }
    //切换认证信息
    const changeAuthType = (value) => {
        setAuthType(value)
    }

    return(
        <Modal
            visible={visible}
            onCancel={cancel}
            closable={false}
            footer={modalFooter}
            destroyOnClose={true}
            title={"添加环境配置"}
        >
            <div className='dev-deploy-add-modal'>
                <Form form={form} layout='vertical' autoComplete='off'
                      initialValues={{envType:'maven'}}
                >
                    <Form.Item
                        label={'环境配置类型'}
                        name={'envType'}
                        rules={[
                            {required:true,message:'环境配置类型不能为空'},
                        ]}
                    >
                        <Select
                            defaultValue="maven"
                            options={[
                                { value: 'maven', label: 'maven' },
                                { value: 'jdk', label: 'jdk' },
                                { value: 'node', label: 'node.js' },
                            ]
                            } onChange={changeEnvType}
                        />
                    </Form.Item>
                    <Form.Item
                        label={'名称'}
                        name={'envName'}
                        rules={[
                            {required:true,message:'名称不能为空'},
                        ]}
                    ><Input  placeholder={"任务名称"}/>
                    </Form.Item>
                    <Form.Item
                        label={'地址'}
                        name={'envAddress'}
                        rules={[{required:true,message:'地址不能为空'},]}
                    >
                        <Input placeholder={envType==="maven"&&"示例：maven/bin 地址"||
                            envType==="node"&&"示例：node/bin 地址"||
                            envType==="jdk"&&"示例：jdk/bin 地址"
                        }/>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    )

}
export default ScanEnvironmentEditPop
