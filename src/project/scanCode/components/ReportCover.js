/**
 * @name: ReportCover
 * @author: limingliang
 * @date: 2025-07-10 14:30
 * @description：覆盖率
 * @update: 2025-07-10 14:30
 */

import React,{useState,useEffect,Fragment} from 'react';
import {observer} from "mobx-react";
import "./ReportCover.scss"
import EmptyText from "../../../common/emptyText/EmptyText";
import {Table, Tooltip} from "antd";
import CoverStore from "../store/CoverStore";
import Page from "../../../common/page/Page";
import {FileTextOutlined, FolderOutlined} from "@ant-design/icons";
import RenderBread from "../common/RenderBread";
const ReportCover = (props) => {
    const {recordId}=props
    const {findProjectCoverList,findProjectCoverPage}=CoverStore

    const [projectCoverList,setProjectCoverList]=useState([])
    const [currentPage,setCurrentPage]=useState(1)
    const [totalRecord,setTotalRecord]=useState()
    const [totalPage,setTotalPage]=useState()
    const [pageSize]=useState(15)

    const [optCover,setOptCover]=useState(null);
    const [coverList,setCoverList]=useState([])


    useEffect(async () => {
        getProjectCover(currentPage)
    }, []);


    const coverColumns =[
        {
            title: '名称',
            dataIndex: 'name',
            key:"name",
            width:'30%',
            ellipsis:true,
            render:(text,record)=>   <Tooltip placement="top" title={text} >
                {
                    optCover?.type==="class"?
                        <div className='cover-nav'>
                            <div>{fileIcon(record?.type)}</div>
                            {text}
                        </div>:
                        <div className='cover-nav opt-cover-nav' onClick={()=>openDetails(record)}>
                            <div>{fileIcon(record?.type)}</div>
                            {text}
                        </div>
                }
            </Tooltip>
        },
        {
            title: '指令覆盖率',
            dataIndex: 'instructionsPercent',
            key:"instructionsPercent",
            width:'11%',
            render:(text,record)=>   <div >
                {
                    text?
                        <div>{text}</div>:
                        <div>
                            {"n/a"}
                        </div>
                }
            </div>
        },
        {
            title: '分支覆盖率',
            dataIndex: 'branchPercent',
            key:"branchPercent",
            width:'11%',
            render:(text,record)=>   <div >
                {
                    text?
                        <div>{text}</div>:
                        <div>
                            {"n/a"}
                        </div>
                }
            </div>
        },
        {
            title: '复杂度',
            dataIndex: 'complexityMissed',
            key:"complexityMissed",
            width:'12%',
            render:(text,record)=>   <div className='cover-nav'>
                <span>{record.complexity-record.complexityMissed}</span>
                <span>/</span>
                <span>{record.complexityMissed}</span>

            </div>
        },
        {
            title: '覆盖行',
            dataIndex: 'lineMissed',
            key:"lineMissed",
            width:'12%',
            render:(text,record)=>   <div className='cover-nav'>
                <span>{record.line-record.lineMissed}</span>
                <span>/</span>
                <span>{record.lineMissed}</span>

            </div>
        },
        {
            title: '覆盖方法',
            dataIndex: 'methodsMissed',
            key:"methodsMissed",
            width:'12%',
            render:(text,record)=>   <div className='cover-nav'>
                <span>{record.methods-record.methodsMissed}</span>
                <span>/</span>
                <span>{record.methodsMissed}</span>

            </div>
        },
        {
            title: '覆盖类',
            dataIndex: 'classesMissed',
            key:"classesMissed",
            width:'12%',
            render:(text,record)=>   <div className='cover-nav'>
                <span>{record.classes-record.classesMissed}</span>
                <span>/</span>
                <span>{record.classesMissed}</span>
            </div>
        },
    ]


    //查询项目覆盖率
    const getProjectCover = (currentPage,parentPath) => {
        findProjectCoverPage({
            pageParam:{currentPage:currentPage, pageSize:pageSize},
            scanRecordId:recordId,
            parentPath:parentPath,
        }).then(res=>{
            if (res.code===0){
                setProjectCoverList(res.data.dataList)
                setTotalPage(res.data.totalPage)
                setCurrentPage(res.data.currentPage)
                setTotalRecord(res.data.totalRecord)
            }
        })
    }

    //添加path
    const splitFilePath = (value) => {
        setCoverList([...coverList,value])
    }

    //打开下一级
    const openDetails = (value) => {
        splitFilePath(value)

        setOptCover(value)
        setCurrentPage(1)
        getProjectCover(1,value.path)
    }

    //分页
    const handleChange = (value) => {
        setCurrentPage(value)
        getProjectCover(value,optCover.path)
    }


    //跳转
    const breadJump = (index,type) => {
        if (type){
            setCoverList([])
            setOptCover(null)
            getProjectCover(1)
        }else {
            //移除后面的数据
            const a=coverList.slice(0,index+1)
            setCoverList(a)

            //添加当前选中的数据
            const data=coverList[index];
            setOptCover(data)

            getProjectCover(1,data.path)
        }
    }

    const fileIcon = (type) => {
        switch (type){
            case "package":
                return   <FolderOutlined />
            case "class":
                return <FileTextOutlined />
        }
    }


    return(
        <div className='cover'>
            <div className='cover-bread'>
                <RenderBread dataList={coverList}
                             breadJump={breadJump}
                             title={"覆盖率报告"}
                />
            </div>
            <Table
                columns={coverColumns}
                dataSource={projectCoverList}
                rowKey={record=>record.id}
                pagination={false}
                className='scan-tab-top'
                locale={{emptyText: <EmptyText title={"暂无数据"}/>}}
            />

            <Page totalPage={totalPage}
                  pageCurrent={currentPage}
                  totalRecord={totalRecord}
                  changPage={handleChange}
            />
        </div>
    )
}
export default observer(ReportCover)
