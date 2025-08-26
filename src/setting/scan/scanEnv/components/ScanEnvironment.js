/**
 * @name: EnvDeploy
 * @author: limingliang
 * @date: 2023-05-22 14:30
 * @description：扫描环境
 * @update: 2023-05-22 14:30
 */
import React, {useState,useEffect} from "react";
import "./EnvExec.scss"
import {EditOutlined, StopOutlined} from "@ant-design/icons";

import {observer} from "mobx-react";
import {Col, Select, Table} from "antd";
import ScanEnvironmentEditPop from "./ScanEnvironmentEditPop";
import scanEnvStore from "../store/ScanEnvStore";
import {PrivilegeButton} from 'tiklab-privilege-ui';
import {Option} from "antd/es/mentions";
import nodePng from "../../../../assets/images/img/node.png";
import mavenPng from "../../../../assets/images/img/maven.png";
import DeleteExec from "../../../../common/delete/DeleteExec";
import EmptyText from "../../../../common/emptyText/EmptyText";
import Breadcrumb from "../../../../common/breadcrumb/Breadcrumb";
import Btn from "../../../../common/btn/Btn";
const typeList=[{key:'maven',value:"maven"},{key:'jdk',value:"jdk"},{key:'node',value:"node.js"}]
const ScanEnvironment = (props) => {
    const {deployEnvList,findDeployEnvList,deleteDeployEnv,deleteDeployServer,fresh} = scanEnvStore

    const [addVisible,setAddVisible] = useState(false)
    const [envData,setEnvData] = useState(null)
    const [tab,setTab]=useState(null)

    useEffect(()=>{
        findDeployEnvList(tab);
    },[tab,fresh])

    const columns = [
        {
            title: '名称',
            dataIndex: 'envName',
            key: 'envName',
            width:'15%',
            ellipsis:true,
        },
        {
            title: '类型',
            dataIndex: 'envType',
            key: 'envType',
            width:'15%',
            ellipsis:true,
            render:(text,record)=>(
                <div className='scan-evn-type-icon' >
                    {
                        text==='maven'?
                            <img  src={mavenPng} className='env-icon-image'/>:
                            <img  src={nodePng} className='env-icon-image'/>
                    }
                    <div>{text}</div>
                </div>
            )
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
                    <EditOutlined onClick={()=>openEditPop(record)}/>

                    {
                        record.category===2?
                            <DeleteExec value={record} deleteData={deleteDeployEnv} title={"确认删除"}/> :
                            <StopOutlined disabled className='scheme-table-icon-no'/>
                    }
                </div>)
        }
    ]




    //切换类型
    const setTableType = (value) => {
        setTab(value)
    }

    //打开编辑的弹窗
    const openEditPop = (value) => {
        setAddVisible(true)
        setEnvData(value)
    }

    return(
        <div className='drop-down sourcewair-page-width dev-deploy'>
            <Col sm={{ span: "24" }}
                 md={{ span: "24" }}
                 lg={{ span: "24" }}
                 xl={{ span: "22", offset: "1" }}
                 xxl={{ span: "18", offset: "3" }}
            >
                <div className='dev-deploy-up'>
                    <Breadcrumb firstItem={'扫描环境'}/>
                    <Btn
                        type={'primary'}
                        title={'添加配置'}
                        onClick={()=> setAddVisible(true)}
                    />
                </div>
                <div className='tab-style'>
                    <Select    style={{width: 190}}  onChange={setTableType}  placeholder='类型'  allowClear>
                        {typeList.map(item=>{
                            return(
                                <Option  key={item.key} value={item.key}>
                                    {item.value}
                                </Option>
                            )
                        })}
                    </Select>
                </div>


                <div className='dev-deploy-table'>
                    {
                        <Table
                            bordered={false}
                            columns={columns}
                            dataSource={deployEnvList}
                            rowKey={record=>record.id}
                            pagination={false}
                            locale={{emptyText: <EmptyText title={'暂无配置'}/>}}
                        />
                    }

                </div>
            </Col>

            <ScanEnvironmentEditPop visible={addVisible}
                                    setVisible={setAddVisible}
                                    envData={envData}
                                    setEnvData={setEnvData}
            />
        </div>
    )
}
export default observer(ScanEnvironment)
