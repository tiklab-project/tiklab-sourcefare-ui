/**
 * @name: SchemeUpdate
 * @author: limingliang
 * @date: 2023-11-1 10:13
 * @description：更新扫描方案弹窗
 * @update: 2023-11-1 10:13
 */
import React,{useState,useEffect,Fragment} from 'react';
import {Form, Input, Select,Checkbox} from "antd";

import "./SchemeEditPop.scss"
import DeployStore from "../../store/DeployStore";
import {observer} from "mobx-react";
import scanRuleSetStore from "../../scanRule/store/ScanRuleSetStore";
import Modal from "../../../../common/modal/Modals";
import Btn from "../../../../common/btn/Btn";
const languageList=[{key:"Java",value:"Java"},{key:"JavaScript",value:"JavaScript"},{key:"Go",value:"Go"}
    ,{key:"Python",value:"Python"}]
const sanWay=[{key:"sonar",value:"sonar扫描"},{key:"rule",value:"规则包扫描"}]
const SchemeUpdate = (props) => {
    const [form] = Form.useForm()
    const {editVisible,setEditVisible,createScanScheme,createScanSchemeRuleSet,createScanSchemeSonar
        ,schemeDate,setSchemeDate,updateScanScheme,scanSchemeList}=props

    const {findDeployEnvList,deployEnvList,findDeployServerList,deployServerList}=DeployStore
    const {findScanRuleSetList}=scanRuleSetStore

    const [language,setLanguage]=useState()
    const [scanWay,setScanWay]=useState('')  //扫描方式
    const [ruleSetList,setRuleSetList]=useState([])

    const [dev,setDev]=useState('')     //选择环境
    const [server,setServer]=useState('')     //选择应用

    const [choiceRuleSetList,setChoiceRuleSetList]=useState([])
    const [verifyScanSchemeList,setVerifyScanSchemeList]=useState([])

    useEffect(()=>{

        if (schemeDate){
            form.setFieldsValue({
                schemeName:schemeDate.schemeName,
            })
            if (scanSchemeList){
                const list=scanSchemeList.filter(item=>item.id!==schemeDate.id)
                setVerifyScanSchemeList(list)
            }
        }
        if (scanSchemeList){
            setVerifyScanSchemeList(scanSchemeList)
        }

    },[schemeDate,editVisible])

    //添加
    const onOk = () => {
        form.validateFields().then(async values => {
            if (schemeDate){
                updateScanScheme({...schemeDate,schemeName:values.schemeName}).then(res=>{
                    cancel()
                })
            }else {
                createScanScheme({schemeName:values.schemeName,scanWay:scanWay,language:language,deployEnvId:values.deployEnv,describe:values.describe}).then(res=>{
                    if (res.code===0){
                        if (scanWay==="rule"){
                            choiceRuleSetList.map(item=>{
                                createScanSchemeRuleSet({scanSchemeId:res.data,scanRuleSet:{id:item}})
                            })
                        }
                        if (scanWay==='sonar'){
                            createScanSchemeSonar({scanSchemeId:res.data,deployEnv:{id:dev},deployServer:{id:server}})
                        }
                        cancel()
                    }
                })
            }
        })
    }

    //取消编辑弹窗
    const  cancel= () => {
        form.resetFields()
        setScanWay('')
        setDev("")
        setServer("")
        setEditVisible(false)
        setLanguage(null)
        setSchemeDate(null)
    }



    //选择语言
    const languageType = (value) => {
        setLanguage(value)
        if (value==='Java'){
            findDeployEnvList("maven")
        }
    };

    //选择 规则集
    const choiceRuleSet = (value) => {
        if (choiceRuleSetList&&choiceRuleSetList.length>0){
            setChoiceRuleSetList(choiceRuleSetList.concat(value))
        }else {
            setChoiceRuleSetList([value])
        }
    }


    //选择扫描方式
    const choiceSanWay = (value) => {
        setScanWay(value)
        if (value==='sonar'){

            findDeployServerList("sonar")
        }
    }

    //选择环境
    const choiceDev = (value) => {
        setDev(value)
    }
    //选择环境
    const choiceServer = (value) => {
        setServer(value)
    }

    //获取扫描规则list
    const getScanRuleSetList = () => {
        findScanRuleSetList({language:language}).then(res=>{
            if (res.code===0){
                setRuleSetList(res.data)
            }
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
            visible={editVisible}
            onCancel={cancel}
            closable={false}
            footer={modalFooter}
            destroyOnClose={true}
            width={500}
            title={"修改方案"}
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
                {
                    !schemeDate&&
                    <Fragment>
                        <Form.Item
                            label={'扫描方式'}
                            name={'sanWay'}
                            rules={[{required:true,message:'扫描方式不能为空'}]}
                        >
                            <Select   allowClear onChange={choiceSanWay} placeholder={"请选择扫描方式"}>
                                {
                                    sanWay.map(item=>{
                                            return(
                                                <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>
                                            )
                                        }
                                    )
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={'检测语言'}
                            name={'language'}
                            rules={[{required:true,message:'扫描语言不能为空'}]}
                        >
                            <Select   allowClear onChange={languageType} placeholder={"请选择扫描语言"}>
                                {
                                    languageList.map(item=>{
                                            return(
                                                <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>
                                            )
                                        }
                                    )
                                }
                            </Select>
                        </Form.Item>
                        {
                            language==='Java'&&
                            <Form.Item
                                label={'执行环境'}
                                name={'deployEnv'}
                                rules={[{required:true,message:'执行环境'}]}
                            >
                                <Select  allowClear onChange={choiceDev} placeholder={"请选择"}>
                                    {
                                        deployEnvList?.map(item=>{
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
                            scanWay==='sonar'&&
                            <Form.Item
                                label={'sonar地址'}
                                name={'sonar'}
                                rules={[{required:true,message:'sonar地址'}]}
                            >
                                <Select  allowClear onChange={choiceServer}  placeholder={"请选择"}>
                                    {
                                        deployServerList?.map(item=>{
                                                return(
                                                    <Select.Option key={item.id} value={item.id}>{item.taskName}</Select.Option>
                                                )
                                            }
                                        )
                                    }
                                </Select>
                            </Form.Item>||
                            (scanWay==='rule'&&language)&&
                            <Form.Item
                                label={'规则集'}
                                name={'ruleSet'}
                                rules={[{required:true,message:'规则集不能为空'}]}
                            >
                                <Select   allowClear onChange={choiceRuleSet} onClick={()=>getScanRuleSetList()}  placeholder={"请选择扫描方式"} >
                                    {
                                        ruleSetList.map(item=>{
                                                return(
                                                    <Select.Option key={item.id} value={item.id}>{item.ruleSetName}</Select.Option>
                                                )
                                            }
                                        )
                                    }
                                </Select>
                            </Form.Item>
                        }
                    </Fragment>
                }
            </Form>
        </Modal>
    )
}
export default observer(SchemeUpdate)
