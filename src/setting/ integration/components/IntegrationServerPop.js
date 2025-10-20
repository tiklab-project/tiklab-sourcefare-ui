/**
 * @name: IntegrationServerPop
 * @author: limingliang
 * @date: 2025-5-22 10:30
 * @description：编辑主机信息弹窗
 * @update: 2025-5-22 10:30
 */
import React,{useState,useEffect,Fragment} from 'react';
import {Form, Input, Select} from 'antd';
import "./IntegrationDetails.scss";
import Modal from "../../../common/modal/Modals";
import Btn from "../../../common/btn/Btn";
import {getUser} from "tiklab-core-ui";
import repositoryServerStore from "../store/RepositoryServerStore";

const typeList=[{key:"GitPuk",value:"GitPuk"}]
const IntegrationServerPop = (props) => {
    const [form] = Form.useForm()
    const {visible,setVisible,serverData,setServerData} = props

    const {createRepositoryServer,updateRepositoryServer} = repositoryServerStore

    const [serverType,setServerType]=useState("GitPuk")

    useEffect(()=>{
        if (serverData){
            form.setFieldsValue({
                name:serverData.name,
                address:serverData.address,
                account:serverData.account,
                passWord:serverData.passWord
            })
            setServerType(serverData.serverType)
        }
    },[serverData])

    /**
     * 添加
     */
    const onOk = () => {
        form.validateFields().then((values) => {
            if (serverData){
                updateRepositoryServer({...values,
                    id:serverData.id,
                    serverType:serverType,
                })
            }else {
                createRepositoryServer({...values,
                    serverType:serverType,
                    user:{
                        id:getUser().userId
                    }})
            }
            cancel()
        })
    }
    //取消
    const  cancel= () => {
        setVisible(false)
        setServerData(null)
        form.resetFields()
    }

    //选择类型
    const choiceType = (value) => {
        setServerType(value)
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
            title={"添加仓库服务"}
        >
            <div className='host-info-add-modal'>
                <Form form={form} layout='vertical' autoComplete='off'
                      initialValues={{envType:'maven'}}
                >
                    <Form.Item
                        label={'服务类型'}
                        name={'serverType'}
                    >
                        <Select defaultValue={serverType}  allowClear onChange={choiceType} placeholder={"请选择规则类型"}>
                            {
                                typeList.map(item=>{
                                        return(
                                            <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>
                                        )
                                    }
                                )
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={'名称'}
                        name={'name'}
                        rules={[{required:true,message:'名称不能为空'}]}
                    >
                        <Input  placeholder={"名称"}/>
                    </Form.Item>
                    <Form.Item
                        label={'服务地址'}
                        name={'address'}
                        rules={[
                            {required:true,message:'服务地址不能为空'},
                        ]}
                    >
                        <Input  placeholder={"服务地址"}/>
                    </Form.Item>
                    <Form.Item
                        label={'账号'}
                        name={'account'}
                        rules={[{required:true,message:'账号不能为空'},]}
                    >
                        <Input placeholder={"账号"}/>
                    </Form.Item>
                    <Form.Item
                        label={'密码'}
                        name={'passWord'}
                        rules={[{required:true,message:'密码不能为空'},]}
                    >
                        <Input placeholder={"密码"}/>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    )

}
export default IntegrationServerPop
