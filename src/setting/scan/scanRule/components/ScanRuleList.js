
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
const scanToolList=[{key:"all",value:"全部"},{key:"SpotBugs",value:"SpotBugs"},{key:"PMD",value:"PMD"}]
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
    const [scanTool,setScanTool]=useState()  //工具

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
                    <div className='text-color' onClick={()=>openRuleDetails(record)}>
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
            title: '扫描工具',
            dataIndex: 'scanTool',
            key: 'scanTool',
            width:'15%',
            ellipsis:true,
        },
        {
            title: '语言',
            dataIndex: 'language',
            key: 'language',
            width:'15%',
            ellipsis:true,
            render:(text)=><div>{scanRuleSet.language}</div>
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
            getScanRulePage(1,problemLevel,scanTool)
        }
    }
    //通过规则名称查询规则
    const onSearchRule = () => {
        setCurrentPage(1)
        getScanRulePage(1,problemLevel,scanTool,ruleName)
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
        getScanRulePage(1,value,scanTool,ruleName)
    }


    //漏洞工具查询
    const selectTool = (value) => {
        setCurrentPage(1)
        setScanTool(value)
        getScanRulePage(1,problemLevel,value,ruleName)
    }


    //分页查询
    const getScanRulePage = (currentPage,problemLevel,scanTool,ruleName) => {
        findScanRulePage({ruleSetId:params.ruleSetId,
            pageParam:{currentPage:currentPage, pageSize:pageSize},
            problemLevel:problemLevel,
            scanTool:scanTool,
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
        getScanRulePage(value,problemLevel,scanTool,ruleName)
    }
    //刷新查询
    const refreshFind = (data) => {
        getScanRulePage(currentPage,problemLevel,scanTool,ruleName)
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

                    <Select   style={{width: 190}}  onChange={selectTool}  placeholder='工具'>
                        {scanToolList.map(item=>{
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
