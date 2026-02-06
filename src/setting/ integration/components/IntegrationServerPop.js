/**
 * @name: IntegrationServerPop
 * @author: limingliang
 * @date: 2025-5-22 10:30
 * @description：编辑主机信息弹窗
 * @update: 2025-5-22 10:30
 */
import React,{useState,useEffect,Fragment} from 'react';
import {Form, Input, Select,message} from 'antd';
import "./IntegrationDetails.scss";
import Modal from "../../../common/modal/Modals";
import Btn from "../../../common/btn/Btn";
import {getUser} from "tiklab-core-ui";
import repositoryServerStore from "../store/RepositoryServerStore";
import {Validation} from "../../../common/client/Client";
const { TextArea } = Input;
const typeList=[{desc:"GitPuk",value:"gitPuk"},{desc:"Gitee",value:"gitee"},{desc:"自建GitLab",value:"priGitlab"}]
const IntegrationServerPop = (props) => {
    const [form] = Form.useForm()
    const {visible,setVisible,serverData,setServerData,serverType} = props

    const {createRepositoryServer,updateRepositoryServer} = repositoryServerStore

    const [authType,setAuthType]=useState("password")
    const [editState,setEditState]=useState(false)
    useEffect(()=>{
        if (serverData){
            form.setFieldsValue({
                name:serverData.name,
                address:serverData.address,
                account:serverData.account,
                passWord:serverData.passWord,
                authType:serverData.authType?serverData.authType:"password",
                secretKey:serverData.secretKey
            })
            setAuthType(serverData.authType?serverData.authType:"password")
        }
        if(visible){
            (serverType==='gitpuk'||serverType==='url')?setAuthType("password"):setAuthType("key")
        }
    },[serverData,visible])

    /**
     * 添加
     */
    const onOk = () => {
        form.validateFields().then((values) => {
           /* if (!values.address.startWith("http")||!values.address.startWith("https")){

            }*/

            setEditState(true)
            if (serverData){
                updateRepositoryServer({...values,
                    id:serverData.id,
                    serverType:serverType,
                }).then(res=>{
                    if (res.code===0){
                        cancel()
                    }else {
                        message.error(res.msg)
                    }
                    setEditState(false)
                })
            }else {
                createRepositoryServer({...values,
                    serverType:serverType,
                    authType:authType,
                    user:{
                        id:getUser().userId
                    }}).then(res=>{
                     setEditState(false)
                        if (res.code===0){
                            cancel()
                        }else {
                            message.error(res.msg)
                        }
                })
            }

        })
    }
    //取消
    const  cancel= () => {
        setVisible(false)
        setServerData(null)
        setAuthType("password")
        form.resetFields()
       /* form.setFieldsValue({
            name:null,
            account:null,
            secretKey:null,
            passWord:null
        })*/
    }

    //选择类型
    const choiceType = (value) => {
        if (value!=="gitpuk"){
            setAuthType("key")
        }
    }

    //切换类型
    const changeAuthType = (value) => {
      setAuthType(value)
        if (!serverData){
            form.setFieldsValue({
                account:null,
                secretKey:null,
                passWord:null
            })
        }
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
                >
                    <Form.Item
                        label={'名称'}
                        name={'name'}
                        rules={[{required:true,message:'名称不能为空'}]}
                    >
                        <Input  placeholder={"名称"}/>
                    </Form.Item>
                    {
                        serverType!=="gitee"&&
                        <Form.Item
                            label={'服务地址'}
                            name={'address'}
                            rules={[
                                {required:true,message:'服务地址不能为空'},
                                Validation('名称','http'),
                            ]}
                        >
                            <Input  placeholder={serverType==="url"?
                                "示例：https://gitee.com/tiklab-project/tiklab-kanass.git":
                                "示例：http://192.168.10.6:8090"}/>
                        </Form.Item>
                    }
                    {
                        serverType==="url"&& <Form.Item
                            label={'认证类型'}
                            name={'authType'}
                        >
                            <Select
                                defaultValue="password"
                                options={[
                                    {value: 'password', label: '账号密码'},
                                    {value: "key", label: 'Access Token'}
                                ]}
                                onChange={changeAuthType}
                            />
                        </Form.Item>
                    }

                    {
                        authType==='password'?
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
            </div>
        </Modal>
    )

}
export default IntegrationServerPop
