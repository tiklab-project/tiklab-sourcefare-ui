/**
 * @name: ScanReqPop
 * @author: limingliang
 * @date: 2025-06-18 14:30
 * @description：扫描问题的动态
 * @update: 2025-06-18 14:30
 */
import React,{useState,useEffect,useRef} from 'react';
import {observer} from "mobx-react";
import Modals from "../../../common/modal/Modals";
import Btn from "../../../common/btn/Btn";
import {Form, Radio,message} from "antd";
import TextArea from "antd/es/input/TextArea";
import {getUser} from "tiklab-core-ui";

const ScanReqPop = (props) => {
    const {visible,setVisible,reqDetails,createRecordInstanceCond,updateScanRecordInstance,findRecordInstance}=props
    const [form] = Form.useForm()

    const [value, setValue] = useState(1);
    const [data, setData] = useState(null);

    // 确认添加
    const onOk = () => {
        form.validateFields().then(async values => {
            updateScanRecordInstance({...reqDetails,state:1}).then(res=>{
                if (res.code===0){
                    createRecordInstanceCond({
                        scanRecordId:reqDetails.scanRecordId,
                        projectId:reqDetails.projectId,
                        recordInstanceId:reqDetails.id,
                        data:(value===3&&!data)?"其他":data,
                        user:{
                            id:getUser().userId
                        }
                    }).then(res=>{
                        setVisible(false)
                        findRecordInstance()
                        message.success("添加成功")
                    })
                }
            })



        })
    }


    //切换原因
    const onChange = (e) => {
        const value=e.target.value
        setValue(value)
        switch (value) {
            case 1:
                setData("无需修复")
                break
            case 2:
                setData("误报")
                break
            case 3:
                setData(null)
                break
        }
    }

    //添加内容
    const onChangeText = (e) => {
        setData(e.target.value)
    }

    const modalFooter = (
        <>
            <Btn onClick={()=>setVisible(false)} title={'取消'} isMar={true}/>
            <Btn onClick={onOk} title={"确认"} type={'primary'}/>
        </>
    )

    return(
        <Modals
            visible={visible}
            onCancel={()=>setVisible(false)}
            closable={false}
            footer={modalFooter}
            destroyOnClose={true}
            width={500}
            title={"忽略问题"}
        >
            <div>
                <Form form={form}
                      layout='vertical'
                      autoComplete='off'>
                    <Form.Item
                        label={'忽略原因'}
                        name={'playName'}
                        rules={[{required:true,message:'忽略原因不能为空'}]}
                    >
                        <Radio.Group onChange={onChange}  value={value}>
                            <Radio value={1}>无需修复</Radio>
                            <Radio value={2}>误报</Radio>
                            <Radio value={3}>其他</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {
                        value===3&&
                        <div>
                            <TextArea rows={3}  placeholder="请输出忽略原因" onChange={onChangeText}/>
                        </div>
                    }
                </Form>
            </div>

        </Modals>
    )
}
export default  observer(ScanReqPop)
