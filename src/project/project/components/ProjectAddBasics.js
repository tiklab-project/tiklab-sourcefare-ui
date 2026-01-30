import {Form, Input} from "antd";
import React, {useState, useEffect,useRef} from "react";
import {Validation} from "../../../common/client/Client";
import ProjectPower from "../../../common/project/ProjectPower";
import TextArea from "antd/es/input/TextArea";
import {observer} from "mobx-react";

const ProjectAddBasics = (props) => {
    const {form,projectList,powerType,setPowerType}=props

    return(
        <Form
            form={form}
            layout="vertical"
        >
            <Form.Item
                label='项目名称'
                name='name'
                rules={[
                    {required:true,message:'项目名称不能为空'},
                    {max:30,message:'请输入1~31位以内的名称'},
                    Validation('名称','appoint'),
                    ({getFieldValue}) => ({
                        validator(rule,value) {
                            let nameArray = []
                            if(projectList&&projectList.length>0){
                                nameArray = projectList && projectList.map(item=>item.name)
                            }
                            if (nameArray.includes(value)) {
                                return Promise.reject('名称已经存在')
                            }
                            return Promise.resolve()
                        }
                    }),
                ]}
            >
                <Input style={{background:'#fff'}} placeholder={"输入项目名称"}/>
            </Form.Item>


            <ProjectPower
                powerType={powerType}
                setPowerType={setPowerType}
                powerTitle={'项目'}
            />

            <Form.Item
                label="描述"
                name="projectDesc"
            >
                <TextArea rows={4} />
            </Form.Item>
        </Form>
    )
}

export default observer(ProjectAddBasics)
