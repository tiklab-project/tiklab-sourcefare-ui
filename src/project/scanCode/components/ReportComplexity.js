/**
 * @name: ReportComplexity
 * @author: limingliang
 * @date: 2025-07-31 14:30
 * @description：复杂度数据
 * @update: 2025-07-31 14:30
 */
import React,{useState,useEffect,Fragment} from 'react';
import {Col, Layout, Table, Tooltip} from 'antd';
import "./ReportComplexity.scss"
import {observer} from "mobx-react";
import RenderBread from "../common/RenderBread";
import EmptyText from "../../../common/emptyText/EmptyText";
import {FileTextOutlined, FolderOutlined} from "@ant-design/icons";
import CodeStore from "../store/CodeStore";
const ReportComplexity = (props) => {
    const {scanRecord,projectData}=props

    const {findCode,findCodeData}=CodeStore
    const [complexityList,setComplexityList]=useState([])
    const [breadList,setBreadList]=useState([])


    useEffect(async () => {
        if (projectData){
            getCodeComplexity(projectData.id)
        }
    }, []);



    const columns =[
        {
            title: '名称',
            dataIndex: 'name',
            key:"name",
            width:'30%',
            ellipsis:true,
            render:(text,record)=>  <div className='cover-nav opt-cover-nav' onClick={()=>openDetails(record)}>
                <div>{fileIcon(record?.type)}</div>
                {text}
            </div>
        },
        {
            title: '复杂度',
            dataIndex: 'complexityNum',
            key:"complexityNum",
            width:'13%',
        },
        {
            title: '代码行数(非空代码行)',
            dataIndex: 'codeLineNon',
            key:"codeLineNon",
            width:'13%',
        },
    ]


    //查询代码扫描的复杂度
    const getCodeComplexity = (path) => {
        findCode({
            projectId:projectData.id,
            path:path,
            recordId:scanRecord.id,
            type:"complexity"
        }).then(res=>{
            if (res.code===0){
                setComplexityList(res.data)
            }
        })
    }

    //打开下一级
    const openDetails = (value) => {
        splitFilePath(value)
        getCodeComplexity(value.path)
    }

    //添加path
    const splitFilePath = (value) => {
        setBreadList([...breadList,value])
    }

    //跳转
    const breadJump = (index,type) => {
        if (type){
            setBreadList([])
            getCodeComplexity(projectData.id)
        }else {
            //移除后面的数据
            const a=breadList.slice(0,index+1)
            setBreadList(a)

            //添加当前选中的数据
            const data=breadList[index];
            getCodeComplexity(data.path)
        }
    }

    const fileIcon = (type) => {
        switch (type){
            case "folder":
                return   <FolderOutlined />
            case "file":
                return <FileTextOutlined />
        }
    }
    return(
        <div className='complexity'>
            <div className='complexity-bread'>
                <RenderBread dataList={breadList}
                             breadJump={breadJump}
                             title={projectData.name}
                />
            </div>
            <Table
                columns={columns}
                dataSource={complexityList}
                rowKey={record=>record.id}
                pagination={false}
                className='scan-tab-top'
                locale={{emptyText: <EmptyText title={"暂无数据"}/>}}
            />
        </div>
    )
}
export default observer(ReportComplexity)
