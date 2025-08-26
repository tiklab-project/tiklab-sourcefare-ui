
/**
 * @name: ScanRuleSetList
 * @author: limingliang
 * @date: 2023-11-08 14:30
 * @description：扫描规则
 * @update: 2023-11-08 14:30
 */
import React,{useState,useEffect} from 'react';
import "./ScanRuleSetList.scss"
import {Col, Table} from "antd";
import {observer} from "mobx-react";
import ScanRuleSetEditPop from "./ScanRuleSetEditPop";
import ScanRuleSetStore from "../store/ScanRuleSetStore";
import Breadcrumb from "../../../../common/breadcrumb/Breadcrumb";
import Btn from "../../../../common/btn/Btn";
import SearchInput from "../../../../common/input/SearchInput";
import EmptyText from "../../../../common/emptyText/EmptyText";
const ScanRuleSetList = (props) => {

    const {createScanRuleSet,deleteScanRuleSet,findScanRuleSetList,scanRuleSetList,fresh}=ScanRuleSetStore

    const [editVisible,setEditVisible] = useState(false)

    const [ruleSetName,setRuleSetName]=useState('')

    const columns = [
        {
            title: '名称',
            dataIndex: 'ruleSetName',
            key: 'ruleSetName',
            width:'30%',
            ellipsis:true,
            render:(text,record)=><div className='text-color' onClick={()=>openRuleSetDetails(record)}>{text}</div>
        },
        {
            title: '支持语言',
            dataIndex: 'language',
            key: 'language',
            width:'20%',
            ellipsis:true,
            render:(text,record)=>  <div className='scanRule-tables-nav'>{text}</div>
        },
        {
            title: '描述',
            dataIndex: 'describe',
            key: 'describe',
            width:'50%',
            ellipsis:true,
        },
        /*   {
               title:'操作',
               dataIndex: 'action',
               key: 'action',
               width:'5%',
               render:(text,record)=>(
                   <Tooltip title={"删除"}>
                       <Popconfirm
                           placement="topRight"
                           title="你确定删除吗"
                           onConfirm={()=>deleteScanRuleSet(record.id)}
                           okText="确定"
                           cancelText="取消"
                       >
                           <span style={{cursor:"pointer"}}>
                               <DeleteOutlined />
                           </span>
                       </Popconfirm>
                   </Tooltip>
               )
           }*/
    ]

    useEffect(()=>{
        getScanRuleSet();
    },[fresh])

  const getScanRuleSet = (ruleSetName) => {
      findScanRuleSetList({ruleSetName:ruleSetName})
  }

    //输入规则名称
    const onInputRuleSetName = (e) => {
        const value = e.target.value
        setRuleSetName(value)
        if (value===''){
            getScanRuleSet()
        }

    }
    //通过规则名称查询规则
    const onSearchRuleSet = () => {
        getScanRuleSet(ruleSetName)
    }

    const openRuleSetDetails = (value) => {
        props.history.push(`/setting/scanRule/${value.id}`)
    }

    return(
        <div className='sourcefare sourcewair-page-width scanRule'>
            <Col sm={{ span: "24" }}
                 md={{ span: "24" }}
                 lg={{ span: "24" }}
                 xl={{ span: "22", offset: "1" }}
                 xxl={{ span: "18", offset: "3" }}
            >
                <div className='scanRule-up'>
                    <Breadcrumb firstItem={"扫描规则集"}/>
                   {/* <Btn
                        type={'primary'}
                        title={'创建规则集'}
                        onClick={()=> setEditVisible(true)}
                    />*/}
                </div>
                <div className='scanRule-search'>
                    <SearchInput
                        placeholder={"搜索规则集名称"}
                        onChange={onInputRuleSetName}
                        onPressEnter={onSearchRuleSet}
                    />
                </div>

                <div className='scanRule-table'>
                    <Table
                        bordered={false}
                        columns={columns}
                        dataSource={scanRuleSetList}
                        rowKey={record=>record.id}
                        pagination={false}
                        locale={{emptyText: <EmptyText title={'暂无扫描规则集'}/>}}
                    />
                </div>
            </Col>

            <ScanRuleSetEditPop editVisible={editVisible} setEditVisible={setEditVisible} createScanRuleSet={createScanRuleSet}/>
        </div>
    )

}
export default observer(ScanRuleSetList)
