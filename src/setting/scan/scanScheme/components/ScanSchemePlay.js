
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
const ScanSchemePlay = (props) => {
    const {scanSchemeId}=props


    const [scanPlayList,setScanPlayList]=useState([])
    const [currentPage,setCurrentPage]=useState(1)
    const [totalPage,setTotalPage]=useState()
    const [pageSize]=useState(15)

    const [load,setLoad]=useState(false)

    useEffect(()=>{
       // getScanPlayPage(currentPage);
    },[scanSchemeId])

    const columns = [
        {
            title: '计划名称',
            dataIndex: 'playName',
            key: 'schemeName',
            width:'30%',
            ellipsis:true,
            render:(text,record)=><div className='text-color' onClick={()=>gotScanPlay(record)}>{text}</div>
        },
        {
            title: '关联操作人',
            dataIndex: 'userName',
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
    const gotScanPlay = (value) => {

        props.history.push(`/repository/${value.repository.address}/scanRecord/${value.id}`)
    }
    //分页查询关联的扫描计划
    const getScanPlayPage= (currentPage) => {
        setLoad(true)
        findScanPlayPage({scanSchemeId:scanSchemeId,pageParam:{currentPage:currentPage, pageSize:pageSize}}).then(res=>{
            setLoad(false)
            if (res.code===0){
                setScanPlayList(res.data.dataList)
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
                dataSource={scanPlayList}
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
