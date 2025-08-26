/**
 * @name: ProjectDeletePop
 * @author: Deploy
 * @date: 2024-03-06 10:30
 * @description：租户删除
 * @update: 2024-03-06 10:30
 */
import React, {useState, useEffect} from "react";
import { Form, Input,message} from 'antd';
import Modals from "../modal/Modals";
import Btn from "../btn/Btn";
import "./ProjectDeletePop.scss"
const ProjectDeletePop = (props) => {
    const [form] = Form.useForm();
    const {deleteVisible, setDeleteVisible, project, deleteProject} = props;
    const [deleteState,setDeleteState]=useState(false)  //删除的状态

    const onOk = () => {
        form.validateFields().then(async values => {
            setDeleteState(true)
            deleteProject(project.id).then(item=>{
                setDeleteState(false)
                if (item.code===0){
                    form.resetFields()
                    setDeleteVisible(false)
                    props.history.push(`/project`)
                }else {
                    message.error(item.msg)
                }
            })
        })
    }

    //取消
    const cancel = () => {
        form.resetFields()
        setDeleteVisible(false)
    }

    const modalFooter = (
        <>
            <Btn onClick={cancel} title={'取消'} isMar={true}/>
            {
                deleteState?
                <Btn  title={'删除中'} type={'dangerous'}/>:
                 <Btn onClick={onOk} title={'确定'} type={'dangerous'}/>
            }
        </>
    )
    return(
        <Modals
            visible={deleteVisible}
            onCancel={cancel}
            closable={false}
            footer={modalFooter}
            destroyOnClose={true}
            width={500}
            title={"删除制品库"}
        >
             <div className='repository-delete'>
                 <div className='desc-border'>
                     <div>
                         您正在删除项目
                         <span className='desc-text'>{project?.name}</span>
                     </div>
                     删除该项目后 里面所有扫描计划都将被移除
                 </div>

                 <div className='data-table'>
                     <Form form={form}
                           layout='vertical'
                           autoComplete='off'>
                         <Form.Item
                             label={'项目名称'}
                             name={'name'}
                             rules={
                                 [{required: true, message: '请输入项目名称'},
                                     ({ getFieldValue }) => ({
                                         validator(rule, value,callback) {

                                             if(value) {
                                                 const vaild = value === project.name
                                                 if (vaild) {
                                                     return Promise.resolve();
                                                 }

                                                 return Promise.reject(`请输入${project.name}`);
                                             }
                                             callback()
                                         },
                                     }),
                                 ]
                             }
                         >
                             <Input  placeholder={"项目名称"}/>
                         </Form.Item>

                     </Form>
                 </div>
             </div>
        </Modals>
    )
}
export default ProjectDeletePop
