
/**
 * @name: IntegrationServerList
 * @author: limingliang
 * @date: 2025-5-22 10:30
 * @description：仓库服务
 * @update: 2025-5-22 10:30
 */
import React, {useState,useEffect} from "react";
import "./IntegrationDetails.scss"
import {EditOutlined, StopOutlined} from "@ant-design/icons";

import {observer} from "mobx-react";
import {Col, Select, Table} from "antd";

import Btn from "../../../common/btn/Btn";
import EmptyText from "../../../common/emptyText/EmptyText";
import DeleteExec from "../../../common/delete/DeleteExec";
import Breadcrumb from "../../../common/breadcrumb/Breadcrumb";
import scanEnvStore from "../store/ScanEnvStore";
import IntegrationToolPop from "./IntegrationToolPop";
import {PrivilegeButton} from 'tiklab-privilege-ui';
const IntegrationServer = (props) => {
    const {match:{params}}=props

    const {deployEnvList,findDeployEnvList,deleteDeployEnv,fresh} = scanEnvStore

    const [secondName]=useState(params.type)


    const [addVisible,setAddVisible] = useState(false)
    const [serverData,setServerData] = useState(null)

    useEffect(()=>{
        findDeployEnvList(params.type);
    },[fresh])




    //打开编辑的弹窗
    const openEditPop = (value) => {
        setAddVisible(true)
        setServerData(value)
    }



    const columns = [
        {
            title: '名称',
            dataIndex: 'envName',
            key: 'envName',
            width:'15%',
            ellipsis:true,
        },
        {
            title: '地址',
            dataIndex: 'envAddress',
            key: 'envAddress',
            width:'50%',
            ellipsis:true,
        },
        {
            title:'操作',
            dataIndex: 'action',
            width:'10%',
            key: 'action',
            render:(text,record)=>(
                <div className='scan-evn-action-icon' >
                    <PrivilegeButton code={"tool_integration_update"} key={'tool_integration_update'}>
                        <EditOutlined onClick={()=>openEditPop(record)}/>
                    </PrivilegeButton >


                    {
                        record.category===2?
                            <PrivilegeButton code={"tool_integration_delete"} key={'tool_integration_delete'}>
                                <DeleteExec value={record} deleteData={deleteDeployEnv} title={"确认删除"}/>
                            </PrivilegeButton > :
                            <StopOutlined disabled className='scheme-table-icon-no'/>
                    }
                </div>)
        }
    ]


    const goBack = () => {
        props.history.push(`/setting/tool`)
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

                    <PrivilegeButton code={"tool_integration_add"} key={'tool_integration_add'}>
                        <Btn
                            type={'primary'}
                            title={'添加服务'}
                            onClick={()=> setAddVisible(true)}
                        />
                    </PrivilegeButton >

                </div>

                <div className='host-info-table'>
                    {params?.type==='net'&&
                        <div className='tool-details-border-dec'>
                            <div>
                                {"当前扫描工具仅支持.net6对应的版本,在全局需要安装.net6版本"}
                            </div>
                            <div>
                                {"请添加--sdk-path,如果全局安装了.net,通过命令查询--sdk-path： dotnet --list-sdks"}
                            </div>
                        </div>||
                        params?.type==='node'&&
                        <div className='tool-details-border-dec'>{"node 版本需要 >18"}</div>
                    }

                    {
                        <Table
                            bordered={false}
                            columns={ columns}
                            dataSource={deployEnvList}
                            rowKey={record=>record.id}
                            pagination={false}
                            locale={{emptyText: <EmptyText title={'没有查询到数据'}/>}}
                        />
                    }

                </div>
            </Col>
            <IntegrationToolPop {...props}
                           visible={addVisible}
                           setVisible={setAddVisible}
                           type={params.type}
                           serverData={serverData}
                           setServerData={setServerData}
            />
        </div>
    )
}
export default observer(IntegrationServer)
