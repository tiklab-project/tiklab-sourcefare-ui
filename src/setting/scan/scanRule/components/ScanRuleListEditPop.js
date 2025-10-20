/**
 * @name: ScanPlayEditPop
 * @author: limingliang
 * @date: 2023-11-1 10:13
 * @description：编辑扫描规则弹窗
 * @update: 2023-11-1 10:13
 */
import React,{useState} from 'react';

import {Form, Input, Select} from "antd";
import Modal from "../../../../common/modal/Modals";
import Btn from "../../../../common/btn/Btn";
const { TextArea } = Input;

const levelList=[{key:0,value:"全部"},{key:1,value:"严重"},{key:2,value:"错误"},{key:3,value:"警告"},{key:4,value:"提示"}]
const ruleSetTypeList=[{key:"function",value:"功能"},{key:"norm",value:"规范"},{key:"secure",value:"安全"}]
const ScanRuleListEditPop = (props) => {
    const [form] = Form.useForm()
    const {editVisible,setEditVisible,createScanRule,scanRuleSetId}=props

    const [level,setLevel]=useState("")  //问题等级
    const [ruleType,setRuleType]=useState("")  //规则类型

    //创建
    const onOk = () => {
        form.validateFields().then(async values => {
            createScanRule({ruleSetId:scanRuleSetId,ruleName:values.ruleName,
                scanTool:values.scanTool,
                problemLevel:level,
                ruleOverview:values.ruleOverview,
                ruleType:ruleType,
                description:values.describe,}).then(res=>{

                    cancel()
            })
        })
    }

    //取消编辑弹窗
    const  cancel= () => {
        form.resetFields()
        setEditVisible(false)
    }

    //选择问题等级
    const choiceLevel = (value) => {
        setLevel(value)
    }

    //选择规则集类型
    const choiceRuleType = (value) => {
        setRuleType(value)
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
            title={"添加规则"}
        >
            <Form form={form}
                  layout='vertical'
                  autoComplete='off'>
                <Form.Item
                    label={'规则名称'}
                    name={'ruleName'}
                    rules={[{required:true,message:'规则名称不能为空'}]}
                >
                    <Input  placeholder={"规则名称"}/>
                </Form.Item>
                <Form.Item
                    label={'规则类型'}
                    name={'ruleType'}
                    rules={[{required:true,message:'规则类型不能为空'}]}
                >
                    <Select   allowClear onChange={choiceRuleType} placeholder={"请选择规则类型"}>
                        {
                            ruleSetTypeList.map(item=>{
                                    return(
                                        <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>
                                    )
                                }
                            )
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    label={'问题等级'}
                    name={'problemLevel'}
                    rules={[{required:true,message:'问题等级不能为空'}]}
                >
                    <Select   allowClear onChange={choiceLevel} placeholder={"问题等级"}>
                        {
                            levelList.map(item=>{
                                    return(
                                        <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>
                                    )
                                }
                            )
                        }
                    </Select>
                </Form.Item>
             {/*   <Form.Item
                    label={'所属工具'}
                    name={'scanTool'}
                >
                    <Input  placeholder={"所属工具"}/>
                </Form.Item>*/}
                <Form.Item
                    label={'方案概述'}
                    name={'ruleOverview'}
                >
                    <TextArea showCount maxLength={100}  placeholder="方案概述" />
                </Form.Item>
                <Form.Item
                    label={'方案描述'}
                    name={'describe'}
                >
                    <TextArea showCount maxLength={900}  placeholder="方案描述" />
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default ScanRuleListEditPop
