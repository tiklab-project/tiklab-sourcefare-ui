/**
 * @name: SchemeUpdate
 * @author: limingliang
 * @date: 2023-11-1 10:13
 * @description：更新扫描方案弹窗
 * @update: 2023-11-1 10:13
 */
import React,{useState,useEffect,Fragment} from 'react';
import {Form, Input, Select,Checkbox} from "antd";
import Modal from "../../../../../common/modal/Modals";
import Btn from "../../../../../common/btn/Btn";
import DeployStore from "../../../store/DeployStore";
import {observer} from "mobx-react";
const SchemeUpdatePop = (props) => {
    const [form] = Form.useForm()
    const {visible,setVisible,schemeDate,setSchemeDate,scanSchemeList,updateScanScheme}=props
    const {findDeployEnvList,deployEnvList}=DeployStore

    const [verifyScanSchemeList,setVerifyScanSchemeList]=useState([])

    useEffect(()=>{
        if (scanSchemeList){
            setVerifyScanSchemeList(scanSchemeList)
        }

        if (schemeDate){
            form.setFieldsValue({
                schemeName:schemeDate.schemeName,
                deployEnv:schemeDate.deployEnvId
            })

            if (schemeDate.language ==='Java'){
                findDeployEnvList("maven")
            }
            if (schemeDate.language ==='JavaScript'){
                findDeployEnvList("node")
            }
        }

    },[visible])



    //取消编辑弹窗
    const  cancel= () => {
        form.resetFields()
        setSchemeDate(null)
        setVisible(false)
    }

    const onOk = () => {
        form.validateFields().then(async values => {
            updateScanScheme({...schemeDate,
                schemeName:values.schemeName
            }).then(res=>{
                cancel()
            })
        })

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
            width={500}
            title={"修改扫描方案"}
        >
            <Form form={form}
                  layout='vertical'
                  autoComplete='off'>
                <Form.Item
                    label={'方案名称'}
                    name={'schemeName'}
                    rules={[{required:true,message:'方案名称不能为空'},
                        ({getFieldValue}) => ({
                            validator(rule,value) {
                                let nameArray = []

                                if(verifyScanSchemeList){
                                    nameArray =  verifyScanSchemeList.map(item=>item.schemeName)
                                }
                                if (nameArray.includes(value)) {
                                    return Promise.reject('扫描方案名字已经存在')
                                }
                                return Promise.resolve()
                            }
                        }),
                    ]}
                >
                    <Input  placeholder={"方案名称"}/>
                </Form.Item>
            </Form>

        </Modal>
    )
}
export default observer(SchemeUpdatePop)
