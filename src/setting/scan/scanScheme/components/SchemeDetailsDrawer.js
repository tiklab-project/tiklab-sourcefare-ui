/**
 * @name: schemeDetailsDrawer
 * @author: limingliang
 * @date: 2024-09-14 14:30
 * @description：扫描规则右侧弹窗
 * @update: 2024-09-14 14:30
 */
import React,{useState,useEffect} from 'react';
import {Drawer, Popconfirm, Table, Tooltip} from 'antd'
import {CheckCircleOutlined, CloseCircleOutlined, CloseOutlined, EditOutlined} from "@ant-design/icons";
import {PrivilegeButton} from "tiklab-privilege-ui";
import ScanSchemeRuleStore from "../store/ScanSchemeRuleStore";
import "./SchemeDetailsDrawer.scss"
import {observer} from "mobx-react";
import RuleInfo from "./RuleInfo";
import ScanRuleSetStore from "../../scanRule/store/ScanRuleSetStore";
import EmptyText from "../../../../common/emptyText/EmptyText";
import {SpinLoading} from "../../../../common/loading/Loading";
const schemeDetailsDrawer = (props) => {

    const {visible,setVisible,schemeRuleSet}=props
    const {findScanSchemeRulePage,updateScanSchemeRule,fresh}=ScanSchemeRuleStore
    const {findScanRuleSet,scanRuleSet}=ScanRuleSetStore

    const [load,setLoad]=useState(false)
    const [schemeRuleList,setSchemeRuleList]=useState([])
    const [currentPage,setCurrentPage]=useState(1)
    const [totalPage,setTotalPage]=useState()
    const [pageSize]=useState(15)

    const [dataType,setDataType]=useState('list')
    const [schemeRule,setSchemeRule]=useState()
    const columns=[
        {
            title: '名称',
            dataIndex: ['scanRule','ruleName'],
            key: 'ruleName',
            width:'35%',
            ellipsis:true,
            render:(text,record)=><div className='details-table-name ' >
                <div className='table-name-text'  onClick={()=>openRuleDetails(record)}>{text}</div>
                {
                    record.isDisable!==0&&
                    <div className='table-name-icon'>{ "已停用"}</div>
                }
            </div>
        },

        {
            title: '规则概述',
            dataIndex: ["scanRule","ruleOverview"],
            key: 'ruleOverview',
            width:'40%',
            ellipsis:true,
            render:(text)=> <Tooltip placement="top" title={text}>{text} </Tooltip>
        },
        {
            title: '问题等级',
            dataIndex: 'problemLevel',
            key: 'problemLevel',
            width:'15%',
            ellipsis:true,
            render:(text)=>text===1&&<div className='text-red'>严重</div>||
                text===2&&<div className='text-yellow'>错误</div> ||text===3&&<div className='text-blue'>警告</div>||
                text===4&&<div className='text-green'>提示</div>
        },
        {
            title: '操作',
            dataIndex: 'exec',
            width:'10%',
            ellipsis:true,
            render:(text,record)=>{
                return(
                    <div className='table-icon-style'>
                        {/* <Tooltip title='编辑'>
                            <span className='icon-style' onClick={()=>opeEditPop(record)}>
                                <EditOutlined />
                            </span>
                            </Tooltip>*/}
                        {
                            record.isDisable===0?
                                <Tooltip title={"停用"}>
                                    <Popconfirm
                                        placement="topRight"
                                        title="停用后，运行当前检测方案时将不再执行对应规则"
                                        onConfirm={()=>updateScanSchemeRule({...record,isDisable:1})}
                                        okText="确定"
                                        cancelText="取消"
                                    >
                                <span className='icon-style'>
                                    <CloseCircleOutlined />
                                </span>
                                    </Popconfirm>
                                </Tooltip>:
                                <Tooltip title={"启用"}>
                                    <Popconfirm
                                        placement="topRight"
                                        title="是否启用"
                                        onConfirm={()=>updateScanSchemeRule({...record,isDisable:0})}
                                        okText="确定"
                                        cancelText="取消"
                                    >
                                        <span className='icon-style'>
                                            <CheckCircleOutlined />
                                        </span>
                                    </Popconfirm>
                                </Tooltip>
                        }

                    </div>
                )
            }
        }
    ]

    useEffect(()=>{
        setDataType("list")
        if (visible){
            getScanRulePage(currentPage);
        }

    },[visible,fresh])

    //分页查询规则
    const getScanRulePage = (currentPage) => {
        setLoad(true)
        findScanSchemeRulePage({scanSchemeId:schemeRuleSet.scanSchemeId,schemeRulesetId:schemeRuleSet.id,
            pageParam:{currentPage:currentPage, pageSize:pageSize}}).then(res=>{
            setLoad(false)
            if (res.code==0){
                setSchemeRuleList(res.data.dataList)
                setTotalPage(res.data.totalPage)
            }
        })
    }

    //打开规则详情
    const openRuleDetails = (value) => {
      //  findScanRuleSet(schemeRuleSet.id)
        setDataType('details')
        setSchemeRule(value)
    }

    //打开编辑弹窗
    const opeEditPop = (value) => {

    }

    //取消弹窗
    const cancelDrawer = () => {
        setVisible(false)
    }



    return(
        <Drawer
            title={schemeRuleSet?.scanRuleSet?.ruleSetName}
            placement='right'
            closable={false}
            width={"60%"}
            onClose={cancelDrawer}
            destroyOnClose={true}
            contentWrapperStyle={{height:"100%"}}
            bodyStyle={{overflow:"auto"}}
            visible={visible}
            extra={
                <CloseOutlined style={{cursor:'pointer'}} onClick={cancelDrawer} />
            }
        >
            <div className='scheme-details-drawer'>
                {
                    dataType==='list'?
                        <Table
                            bordered={false}
                            columns={columns}
                            dataSource={schemeRuleList}
                            rowKey={record=>record.id}
                            pagination={false}
                            locale={{emptyText: load ?
                                    <SpinLoading type="table"/>: <EmptyText title={"暂无扫描规则"}/>}}
                        />:
                        <RuleInfo {...props} schemeRule={schemeRule}
                                  scanRuleSet={schemeRuleSet?.scanRuleSet}
                                  setDataType={setDataType}
                        />
                }

            </div>

        </Drawer>
    )

}
export default observer(schemeDetailsDrawer)
