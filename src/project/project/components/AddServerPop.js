/**
 * @name: AddServerPop
 * @author: limingliang
 * @date: 2025-5-21 10:30
 * @description：添加服务的弹窗
 * @update: 2025-5-21 10:30
 */
import React, {useState, useEffect,useRef} from "react";
import Btn from "../../../common/btn/Btn";
import Modals from "../../../common/modal/Modals";
import {Form, Input, message, Select} from "antd";
import {getUser} from "tiklab-core-ui";
import repositoryServerStore from "../../../setting/ integration/store/RepositoryServerStore";
const typeList=[{desc:"GitPuk",value:"gitpuk"},{desc:"Gitee",value:"gitee"},{desc:"自建GitLab",value:"pri-gitlab"}]
const AddServerPop = (props) => {
    const [form] = Form.useForm()
    const {visible,setVisible,addState}=props
    const [editState,setEditState]=useState(false)
    const [serverType,setServerType]=useState("gitpuk")
    const {createRepositoryServer}=repositoryServerStore
    const [authType,setAuthType]=useState("password")

    //确认
    const onOk = () => {
        form.validateFields().then((values) => {
            createRepositoryServer({...values,
                serverType:serverType,
                authType:authType,
                user:{
                    id:getUser().userId
                }}).then(res=>{
                setEditState(false)
                if (res.code===0){
                    cancel()
                    addState(true)
                }else {
                    message.error(res.msg)
                }
            })
        })

    }

    //取消
    const cancel = () => {
        form.resetFields()
        setVisible(false)
    }

    //修改类型
    const choiceType = (value) => {
        value==='gitpuk'?setAuthType("password"):setAuthType("key")
        setServerType(value)
    }

    const modalFooter = (
        <>
            <Btn onClick={cancel} title={'取消'} isMar={true}/>
            {
                editState?
                    <Btn  title={'加载中'} type={'primary'}/>:
                    <Btn onClick={onOk} title={'确定'} type={'primary'}/>

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
            title={"添加仓库服务"}
        >
            <Form form={form} layout='vertical' autoComplete='off'
                  initialValues={{serverType:'gitpuk'}}
            >
                <Form.Item
                    label={'名称'}
                    name={'name'}
                    rules={[{required:true,message:'名称不能为空'}]}
                >
                    <Input  placeholder={"名称"}/>
                </Form.Item>
                <Form.Item
                    label={'服务类型'}
                    name={'serverType'}
                >
                    <Select value={serverType}  allowClear onChange={choiceType} placeholder={"请选择规则类型"}>
                        {
                            typeList.map(item=>{
                                    return(
                                        <Select.Option key={item.value} value={item.value}>{item.desc}</Select.Option>
                                    )
                                }
                            )
                        }
                    </Select>
                </Form.Item>
                {
                    serverType!=="gitee"&&
                    <Form.Item
                        label={'服务地址'}
                        name={'address'}
                        rules={[
                            {required:true,message:'服务地址不能为空'},
                        ]}
                    >
                        <Input  placeholder={"服务地址:示例http://192.168.10.6:8090"}/>
                    </Form.Item>
                }

                {
                    serverType==="gitpuk"?
                        <>
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
                                <Input placeholder={'密码'}/>
                            </Form.Item>
                        </> :
                        <Form.Item
                            label={'Access Token'}
                            name={'secretKey'}
                            rules={[{required:true,message:'Access Token不能为空'},]}
                        >
                            <Input placeholder={'Access Token'}/>
                        </Form.Item>
                }
            </Form>
        </Modals>
    )
}
export default AddServerPop
