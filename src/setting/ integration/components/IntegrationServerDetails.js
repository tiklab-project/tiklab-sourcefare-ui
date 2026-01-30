/**
 * @name: IntegrationServerList
 * @author: limingliang
 * @date: 2025-5-22 10:30
 * @description：仓库服务
 * @update: 2025-5-22 10:30
 */
import React, {useState,useEffect} from "react";
import {EditOutlined, StopOutlined} from "@ant-design/icons";

import {observer} from "mobx-react";
import {Col, Select, Table} from "antd";
import "./IntegrationDetails.scss"
import Btn from "../../../common/btn/Btn";
import EmptyText from "../../../common/emptyText/EmptyText";
import IntegrationServerPop from "./IntegrationServerPop";
import Page from "../../../common/page/Page";
import UserIcon from "../../../common/project/UserIcon";
import DeleteExec from "../../../common/delete/DeleteExec";
import repositoryServerStore from "../store/RepositoryServerStore";
import Breadcrumb from "../../../common/breadcrumb/Breadcrumb";
import {PrivilegeButton} from 'tiklab-privilege-ui';
const IntegrationServerDetails = (props) => {
    const {match:{params}}=props
    const {findRepositoryServerPage,deleteRepositoryServer,repoFresh} = repositoryServerStore

    const [secondName]=useState("仓库服务")

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
    },[repoFresh])


    //条件查询主机信息列表
    const findHostInfo = (currentPage) => {
        findRepositoryServerPage({ pageParam:{currentPage:currentPage,pageSize:pageSize},
            serverType:params.type
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

    //仓库
    const repColumns = [
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
                    <PrivilegeButton code={"service_integration_update"} key={'service_integration_update'}>
                        <EditOutlined onClick={()=>openEditPop(record)}/>
                    </PrivilegeButton>

                    <PrivilegeButton code={"service_integration_delete"} key={'service_integration_delete'}>
                        <DeleteExec value={record} deleteData={deleteRepositoryServer} title={"确认删除"}/>
                    </PrivilegeButton>
                </div>)
        }
    ]



    const goBack = () => {
        props.history.push(`/setting/server`)
    }

    return(
        <div className=' drop-down sourcewair-page-width host-info'>
            <Col sm={{ span: "24" }}
                 md={{ span: "24" }}
                 lg={{ span: "24" }}
                 xl={{ span: "22", offset: "1" }}
                 xxl={{ span: "18", offset: "3" }}
            >
                <div className='host-info-up'>
                    <Breadcrumb firstItem={'服务集成'} secondItem={secondName} goBack={goBack}/>
                    <PrivilegeButton code={"service_integration_add"} key={'service_integration_add'}>
                        <Btn
                            type={'primary'}
                            title={'添加服务'}
                            onClick={()=> setAddVisible(true)}
                        />
                    </PrivilegeButton>
                </div>

                <div className='host-info-table'>
                    {
                        <Table
                            bordered={false}
                            columns={repColumns}
                            dataSource={hostList}
                            rowKey={record=>record.id}
                            pagination={false}
                            locale={{emptyText: <EmptyText title={'没有查询到数据'}/>}}
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
            <IntegrationServerPop visible={addVisible}
                                  setVisible={setAddVisible}
                                  serverData={serverData}
                                  setServerData={setServerData}
                                  serverType={params.type}
            />

        </div>
    )
}
export default observer(IntegrationServerDetails)
