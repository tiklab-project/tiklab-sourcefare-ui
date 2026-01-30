/**
 * @name: SchemeRuleList
 * @author: limingliang
 * @date: 2025-11-25 14:30
 * @description：扫描方案规则
 * @update: 2025-11-25 14:30
 */
import React,{useState,useEffect,Fragment} from 'react';
import {Col, Popconfirm, Table, Tooltip} from "antd";
import Breadcrumb from "../../../../common/breadcrumb/Breadcrumb";
import ScanSchemeStore from "../store/ScanSchemeStore";
import ScanSchemeRuleStore from "../store/ScanSchemeRuleStore";
import {SpinLoading} from "../../../../common/loading/Loading";
import EmptyText from "../../../../common/emptyText/EmptyText";
import {CheckCircleOutlined, CloseCircleOutlined} from "@ant-design/icons";
import "./SchemeRuleList.scss"
import Page from "../../../../common/page/Page";
import {observer} from "mobx-react";
import SchemeRuleDrawer from "./SchemeRuleDrawer";
const SchemeRuleList = (props) => {
    const {ruleSet,contentType,setContentType}=props

    const {findScanSchemeRulePage,updateScanSchemeRule,fresh}=ScanSchemeRuleStore

    const [load,setLoad]=useState(false)
    const [schemeRuleList,setSchemeRuleList]=useState([])

    const [currentPage,setCurrentPage]=useState(1)
    const [totalPage,setTotalPage]=useState()
    const [totalRecord,setTotalRecord]=useState()
    const [pageSize]=useState(20)

    //打开详情抽屉的状态
    const [visible,setVisible]=useState(false)
    const [schemeRule,setSchemeRule]=useState(null)

    useEffect(()=>{
        if (contentType){
            getScanRulePage(1);
        }

    },[contentType])


    //分页查询规则
    const getScanRulePage = (currentPage) => {
        setLoad(true)
        findScanSchemeRulePage({
            scanSchemeId:ruleSet.scanSchemeId,
            schemeRulesetId:ruleSet.id,
            pageParam:{currentPage:currentPage, pageSize:pageSize}}).then(res=>{
            setLoad(false)
            if (res.code==0){
                setSchemeRuleList(res.data.dataList)
                setTotalPage(res.data.totalPage)
                setCurrentPage(res.data.currentPage)
                setTotalRecord(res.data.totalRecord)
            }
        })
    }

    //打开详情
    const openRuleDetails = (value) => {
        setVisible(true)
        setSchemeRule(value)
    }

    //更新
    const updateSchemeRule = (data,disable) => {
        updateScanSchemeRule({...data,isDisable:disable}).then(res=>{
            res.code===0&&getScanRulePage(currentPage)
        })
    }

    //分页
    const changPage = (value) => {
        setCurrentPage(value)
        getScanRulePage(value)
    }

    //刷新
    const refreshFind = () => {
        getScanRulePage(currentPage)
    }

    //返回上页
    const goBack = () => {
        setContentType("ruleSet")
    }



    const columns=[
        {
            title: '名称',
            dataIndex: ['scanRule','ruleName'],
            key: 'ruleName',
            width:'30%',
            ellipsis:true,
            render:(text,record)=><div className='details-table-name'>
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
            width:'50%',
            ellipsis:true,
            render:(text)=> <Tooltip placement="top" title={text}>{text} </Tooltip>
        },
        {
            title: '问题等级',
            dataIndex: 'problemLevel',
            key: 'problemLevel',
            width:'10%',
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
                        {
                            record.isDisable===0?
                                <Tooltip title={"停用"}>
                                    <Popconfirm
                                        placement="topRight"
                                        title="停用后，运行当前检测方案时将不再执行对应规则"
                                        onConfirm={()=>updateSchemeRule(record,1)}
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
                                        onConfirm={()=>updateSchemeRule(record,0)}
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

    return (
        <div className='scheme_rule'>
            <Breadcrumb firstItem={ruleSet?.scanRuleSet.ruleSetName} goBack={goBack}/>

            <div className='scheme_rule-table'>
                <Table
                    bordered={false}
                    columns={columns}
                    dataSource={schemeRuleList}
                    rowKey={record=>record.id}
                    pagination={false}
                    locale={{emptyText: load ?
                            <SpinLoading type="table"/>: <EmptyText title={"暂无扫描规则"}/>}}
                />

                <Page pageCurrent={currentPage}
                      changPage={changPage}
                      totalPage={totalPage}
                      totalRecord={totalRecord}
                      refresh={refreshFind}
                />
            </div>

            <SchemeRuleDrawer {...props}
                              visible={visible}
                              setVisible={setVisible}
                              schemeRule={schemeRule}
                              scanRuleSet={ruleSet?.scanRuleSet}
            />
        </div>
    )

}
export default observer(SchemeRuleList)
