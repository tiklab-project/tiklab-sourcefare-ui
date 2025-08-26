/**
 * @name: RepositoryServerList
 * @author: limingliang
 * @date: 2025-5-22 10:30
 * @description：主机信息
 * @update: 2025-5-22 10:30
 */
import React, {useState,useEffect} from "react";
import "./RepositoryServer.scss"
import {EditOutlined, StopOutlined} from "@ant-design/icons";

import {observer} from "mobx-react";
import {Col, Select, Table} from "antd";

import {Breadcrumb} from "../../../ui";
import Btn from "../../../common/btn/Btn";
import EmptyText from "../../../common/emptyText/EmptyText";
import RepositoryServerEditPop from "./RepositoryServerEditPop";
import Page from "../../../common/page/Page";
import UserIcon from "../../../common/project/UserIcon";
import DeleteExec from "../../../common/delete/DeleteExec";
import repositoryServerStore from "../store/RepositoryServerStore";

const RepositoryServerList = (props) => {
    const {findRepositoryServerPage,deleteRepositoryServer,fresh} = repositoryServerStore


    //主机信息list
    const [hostList,setHostList]=useState([])
    const [currentPage,setCurrentPage]=useState(1)
    const [totalPage,setTotalPage]=useState()
    const [pageSize]=useState(10)
    const [totalRecord,setTotalRecord]=useState()


    const [addVisible,setAddVisible] = useState(false)
    const [serverData,setServerData] = useState(null)

    useEffect(()=>{
        findHostInfo(currentPage)
    },[fresh])


    //条件查询主机信息列表
    const findHostInfo = (currentPage) => {
        findRepositoryServerPage({ pageParam:{currentPage:currentPage,pageSize:pageSize}
        }).then(res=>{
            if (res.code===0){
                setHostList(res.data?.dataList)
                setTotalPage(res.data.totalPage)
                setCurrentPage(res.data.currentPage)
                setTotalRecord(res.data.totalRecord)
            }
        })
    }




    //打开编辑的弹窗
    const openEditPop = (value) => {
        setAddVisible(true)
        setServerData(value)
    }

    //刷新
    const refreshFind = () => {

    }
    //分页
    const changPage = () => {

    }

    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width:'15%',
            ellipsis:true,
        },
        {
            title: '服务地址',
            dataIndex: 'address',
            key: 'address',
            width:'15%',
            ellipsis:true,
        },
        {
            title: '类型',
            dataIndex: 'serverType',
            key: 'serverType',
            width:'10%',
            ellipsis:true,
        },
        {
            title: '创建人',
            dataIndex: ['user','nickname'],
            key: 'user',
            width:'15%',
            ellipsis:true,
            render:(text,record)=><div className='icon-text-use'>
                <UserIcon text={record?.user?.nickname?text:record?.user?.name} size={"small"}/>
                <div>{record?.user?.nickname?text:record?.user?.name}</div>
            </div>
        },
        {
            title:'操作',
            dataIndex: 'action',
            width:'10%',
            key: 'action',
            render:(text,record)=>(
                <div className='host-info-table-action' >
                    <EditOutlined onClick={()=>openEditPop(record)}/>

                    <DeleteExec value={record} deleteData={deleteRepositoryServer} title={"确认删除"}/>
                </div>)
        }
    ]

    return(
        <div className=' drop-down sourcewair-page-width host-info'>
            <Col sm={{ span: "24" }}
                 md={{ span: "24" }}
                 lg={{ span: "24" }}
                 xl={{ span: "22", offset: "1" }}
                 xxl={{ span: "18", offset: "3" }}
            >
                <div className='host-info-up'>
                    <Breadcrumb firstItem={'服务集成'}/>
                    <Btn
                        type={'primary'}
                        title={'添加服务'}
                        onClick={()=> setAddVisible(true)}
                    />
                </div>

                <div className='host-info-table'>
                    {
                        <Table
                            bordered={false}
                            columns={columns}
                            dataSource={hostList}
                            rowKey={record=>record.id}
                            pagination={false}
                            locale={{emptyText: <EmptyText title={'暂无主机'}/>}}
                        />
                    }
                    <Page pageCurrent={currentPage}
                          changPage={changPage}
                          totalPage={totalPage}
                          totalRecord={totalRecord}
                          refresh={refreshFind}
                    />
                </div>
            </Col>
            <RepositoryServerEditPop visible={addVisible}
                                     setVisible={setAddVisible}
                                     serverData={serverData}
                                     setServerData={setServerData}
            />
        </div>
    )
}
export default observer(RepositoryServerList)
