
/**
 * @name: ScanSchemeTask
 * @author: limingliang
 * @date: 2023-11-08 14:30
 * @description：扫描方案关联计划
 * @update: 2023-11-08 14:30
 */
import React,{useState,useEffect,Fragment} from 'react';
import { Table} from "antd";
import Page from "../../../../common/page/Page";
import EmptyText from "../../../../common/emptyText/EmptyText";
import {SpinLoading} from "../../../../common/loading/Loading";
import "./SchemeDetails"
import {getUser} from "tiklab-core-ui";
const ScanSchemePlay = (props) => {
    const {scanSchemeId,findProjectPage}=props

    const [scanProjectList,setProjectList]=useState([])
    const [currentPage,setCurrentPage]=useState(1)
    const [totalPage,setTotalPage]=useState()
    const [pageSize]=useState(15)

    const [load,setLoad]=useState(false)

    useEffect(()=>{
        getScanPlayPage(currentPage);
    },[scanSchemeId])

    const columns = [
        {
            title: '项目名称',
            dataIndex: 'name',
            key: 'name',
            width:'30%',
            ellipsis:true,
            render:(text,record)=><div className='text-color' onClick={()=>gotScanProject(record)}>{text}</div>
        },
        {
            title: '扫描方式',
            dataIndex: 'scanWay',
            key: 'scanWay',
            width:'20%',
            ellipsis:true,
            render:(text,record)=>{
                return(
                    <div>
                        {
                            record?.scanWay==='client'&& <div>{"客户端"}</div>||
                            record?.scanWay==='server'&& <div>{"服务端(Git)"}</div>||
                            record?.scanWay==='serverUpload'&& <div>{"服务端(包上传)"}</div>
                        }

                    </div>
                )
            }
        },
        {
            title: '关联操作人',
            dataIndex: ['user','name'],
            key: 'userName',
            width:'20%',
            ellipsis:true,

        },
        {
            title: '关联时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width:'20%',
            ellipsis:true,

        }
    ]
    //跳转扫描计划
    const gotScanProject = (value) => {
        props.history.push(`/project/${value.id}/report`)

    }
    //分页查询关联的扫描计划
    const getScanPlayPage= (currentPage) => {
        setLoad(true)
        findProjectPage({scanSchemeId:scanSchemeId,
            findType: "relevancyRepo",
            userId:getUser().userId,
            pageParam:{currentPage:currentPage, pageSize:pageSize}}
        ).then(res=>{
            setLoad(false)
            if (res.code===0){
                setProjectList(res.data.dataList)
                setTotalPage(res.data.totalPage)
            }
        })
    }
    //分页
    const changPage = (value) => {
        setCurrentPage(value)
        getScanPlayPage(value)
    }

    return(
        <Fragment sping={load}>
            <Table
                className="sourcefare"
                bordered={false}
                columns={columns}
                dataSource={scanProjectList}
                rowKey={record=>record.id}
                pagination={false}
                locale={{emptyText: load ?
                        <SpinLoading type="table"/>: <EmptyText title={"暂无关联任务"}/>}}

            />
            <Page pageCurrent={currentPage} changPage={changPage} totalPage={totalPage}/>
        </Fragment>
    )
}
export default ScanSchemePlay
