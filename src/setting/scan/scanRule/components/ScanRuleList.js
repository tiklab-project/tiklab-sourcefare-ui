
/**
 * @name: ScanRule
 * @author: limingliang
 * @date: 2023-11-08 14:30
 * @description：扫描规则详情
 * @update: 2023-11-08 14:30
 */
import React,{useState,useEffect} from 'react';
import {Col, Select, Table, Tooltip} from "antd";
const { Option } = Select;
import ScanRuleStore from "../store/scanRuleStore";
import "./ScanRuleList.scss"
import ScanRuleListEditPop from "./ScanRuleListEditPop";
import {observer} from "mobx-react";
import ScanRuleListDrawer from "./ScanRuleListDrawer";
import ScanRuleSetStore from "../store/ScanRuleSetStore";
import Breadcrumb from "../../../../common/breadcrumb/Breadcrumb";
import SearchInput from "../../../../common/input/SearchInput";
import Page from "../../../../common/page/Page";
import EmptyText from "../../../../common/emptyText/EmptyText";
const leveList=[{key:0,value:"全部"},{key:1,value:"严重"},{key:2,value:"错误"},{key:3,value:"警告"},{key:4,value:"提示"}]
const scanTypeList=[{key:"function",value:"功能"},{key:"security",value:"安全"},{key:"norm",value:"规范"}]
const ScanRuleList = (props) => {
    const {match:{params}} = props;
    const {createScanRule,deleteScanRule,findScanRulePage,fresh}=ScanRuleStore
    const {findScanRuleSet,scanRuleSet}=ScanRuleSetStore


    const [scanRuleList,setScanRuleList]=useState()
    const [scanRule,setScanRule]=useState()
    const [editVisible,setEditVisible] = useState(false)
    const [DrawerVisible,setDrawerVisible] = useState(false)
    const [ruleName,setRuleName]=useState('') //搜索的输入规则名称
    const [problemLevel,setProblemLevel]=useState()  //选择查询的等级
    const [scanType,setScanType]=useState()  //工具

    const [currentPage,setCurrentPage]=useState(1)
    const [totalPage,setTotalPage]=useState()
    const [totalRecord,setTotalRecord]=useState()
    const [pageSize]=useState(15)




    useEffect(()=>{
        getScanRulePage(currentPage);
        findScanRuleSet(params.ruleSetId)


    },[fresh])


    const columns = [
        {
            title: '规则名称',
            dataIndex: 'ruleName',
            key: 'ruleName',
            width:'20%',
            ellipsis:true,
            render:(text,record)=>
                <Tooltip placement="top" title={text}>
                    <div className='rule-table-name' onClick={()=>openRuleDetails(record)}>
                        {text}
                    </div>
                </Tooltip>

        },
        {
            title: '规则概述',
            dataIndex: 'ruleOverview',
            key: 'ruleOverview',
            width:'40%',
            ellipsis:true,
        },

        {
            title: '类型',
            dataIndex: 'ruleType',
            key: 'ruleType',
            width:'10%',
            ellipsis:true,
            render:(text)=>(
                <div>
                    {
                        text==='function'&&<div>功能</div>||
                        text==='norm'&&<div>规范</div>||
                        text==='security'&&<div>安全</div>
                    }
                </div>
            )

        },
        {
            title: '问题等级',
            dataIndex: 'problemLevel',
            key: 'problemLevel',
            width:'10%',
            ellipsis:true,
            render:(text)=>text===1&&<div className='text-red'>严重</div>|| text===2&&<div className='text-yellow'>错误</div>
                ||text===3&&<div className='text-blue'>警告</div>||text===4&&<div className='text-green'>提示</div>
        },
       /* {
            title:'操作',
            dataIndex: 'action',
            key: 'action',
            width:'10%',
            render:(text,record)=>(
                <Tooltip title={"删除"}>
                    <Popconfirm
                        placement="topRight"
                        title="你确定删除吗"
                        onConfirm={()=>deleteScanRule(record.id)}
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
    //输入规则名称
    const onInputRuleName = (e) => {
        const value = e.target.value
        setRuleName(value)
        if (value===''){
            setCurrentPage(1)
            getScanRulePage(1,problemLevel,scanType)
        }
    }
    //通过规则名称查询规则
    const onSearchRule = () => {
        setCurrentPage(1)
        getScanRulePage(1,problemLevel,scanType,ruleName)
    }


    //打开规则详情
    const openRuleDetails = (value) => {
        setScanRule(value)
        setDrawerVisible(true)

    }


    //漏洞等级查询
    const selectLevel = (value) => {
        setCurrentPage(1)
        setProblemLevel(value)
        getScanRulePage(1,value,scanType,ruleName)
    }


    //扫描类型查询
    const selectType = (value) => {
        setCurrentPage(1)
        setScanType(value)

        getScanRulePage(1,problemLevel,value,ruleName)
    }


    //分页查询
    const getScanRulePage = (currentPage,problemLevel,scanType,ruleName) => {
        findScanRulePage({ruleSetId:params.ruleSetId,
            pageParam:{currentPage:currentPage, pageSize:pageSize},
            problemLevel:problemLevel,
            ruleType:scanType,
            ruleName:ruleName
            }).then(res=>{
            if(res.code===0){
                setScanRuleList(res.data.dataList)
                setTotalPage(res.data.totalPage)
                setCurrentPage(res.data.currentPage)
                setTotalRecord(res.data.totalRecord)
            }
        })
    }

    const goBack = () => {
        props.history.go(-1)
    }

    //分页查询
    const changPage = (value) => {
        setCurrentPage(value)
        getScanRulePage(value,problemLevel,scanType,ruleName)
    }
    //刷新查询
    const refreshFind = (data) => {
        getScanRulePage(1,problemLevel,scanType,ruleName)
    }

    return(
        <div className='drop-down sourcefare sourcewair-page-width ruleDetails'>
            <Col sm={{ span: "24" }}
                 md={{ span: "24" }}
                 lg={{ span: "24" }}
                 xl={{ span: "22", offset: "1" }}
                 xxl={{ span: "18", offset: "3" }}
            >
                <div className='ruleDetails-up'>
                    <Breadcrumb firstItem={scanRuleSet?.ruleSetName} goBack={goBack}/>
                    {/*<Btn
                        type={'primary'}
                        title={'创建规则'}
                        onClick={()=> setEditVisible(true)}
                    />*/}
                </div>
                <div className='rule-search-style'>
                    <SearchInput
                        placeholder={"搜索规则名称"}
                        onChange={onInputRuleName}
                        onPressEnter={onSearchRule}
                    />
                    <Select   style={{width: 190}}
                              onChange={selectLevel}
                              placeholder='问题等级'
                              allowClear
                    >
                        {leveList.map(item=>{
                            return(
                                <Option  key={item.key} value={item.key}>
                                    {item.value}
                                </Option>
                            )
                        })}
                    </Select>

                    <Select   allowClear  style={{width: 190}}  onChange={selectType}  placeholder='工具'>
                        {scanTypeList.map(item=>{
                            return(
                                <Option  key={item.key} value={item.key}>
                                    {item.value}
                                </Option>
                            )
                        })}
                    </Select>


                </div>

                <div className='ruleDetails-table'>
                    <Table
                        bordered={false}
                        columns={columns}
                        dataSource={scanRuleList}
                        rowKey={record=>record.id}
                        pagination={false}
                        locale={{emptyText: <EmptyText title={'暂无扫描规则'}/>}}
                    />
                </div>
                <Page pageCurrent={currentPage}
                      changPage={changPage}
                      totalPage={totalPage}
                      totalRecord={totalRecord}
                      refresh={refreshFind}
                />
            </Col>

            <ScanRuleListEditPop editVisible={editVisible} setEditVisible={setEditVisible} createScanRule={createScanRule} scanRuleSetId={params.ruleSetId}/>
            <ScanRuleListDrawer visible={DrawerVisible} setVisible={setDrawerVisible} scanRule={scanRule}
                                scanRuleSet={scanRuleSet} problemLevel={scanRule?.problemLevel}/>
        </div>
    )
}
export default observer(ScanRuleList)
