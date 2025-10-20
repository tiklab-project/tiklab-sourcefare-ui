/**
 * @name: ScanIssueList
 * @author: limingliang
 * @date: 2025-05-30 14:30
 * @description：扫描问题汇总
 * @update: 2025-05-30 14:30
 */
import React,{useState,useEffect,Fragment} from 'react';
import Breadcrumb from "../../../common/breadcrumb/Breadcrumb";
import {Col, Select, Table, Tooltip} from "antd";
import "./ScanIssueList.scss"
import {SpinLoading} from "../../../common/loading/Loading";
import EmptyText from "../../../common/emptyText/EmptyText";
import Page from "../../../common/page/Page";
import ScanReqDrawer from "../../scanCode/components/ScanReqDrawer";
import Tabs from "../../../common/tabs/Tabs";
import IssueStatisticsStore from "../store/IssueStatisticsStore";
const ScanIssueList = (props) => {
    const {match:{params}} = props;

    const {findIssueStatisticPage,findIssueStatisticCount}=IssueStatisticsStore

    //问题等级
    const [issueLeve,setIssueLeve]=useState(null)

    //类型
    const [type,setType]=useState()

    const [issueNumData,setIssueNumData]=useState(null)

    const [isLoading,setIsLoading]=useState(false)
    const [recordReqList,setRecordReqList]=useState([])
    const [currentPage,setCurrentPage]=useState(1)
    const [totalRecord,setTotalRecord]=useState()
    const [totalPage,setTotalPage]=useState()
    const [pageSize]=useState(16)


    const [drawerVisible,setDrawerVisible]=useState(false)  //抽屉弹窗状态
    const [reqDetails,setReqDetails]=useState('')       //错误详情

    const [issueState,setIssueState]=useState(2)

    useEffect(async() => {
        getIssueCount()

        await getIssueList(currentPage)

    }, []);


    //查询扫描问题列表
    const getIssueList = (currentPage,param) => {
        let data=param
        if (param&&param.problemState===2){
            data={...param,problemState:null}
        }

        findIssueStatisticPage({
            pageParam:{currentPage:currentPage, pageSize:pageSize},
            projectId:params.id,
            ...data
        }).then(res=>{
            setRecordReqList(res.data.dataList)
            setTotalPage(res.data.totalPage)
            setCurrentPage(res.data.currentPage)
            setTotalRecord(res.data.totalRecord)
        })
    }

    //查询扫描问题数量
    const getIssueCount = (param) => {
        let data=param
        if (param&&param.problemState===2){
            data={...param,problemState:null}
        }
        findIssueStatisticCount({
            projectId:params.id,
            ...data
        }).then(res=>{
            setIssueNumData(res.data)
        })
    }


    const columns = [
        {
            title: '问题',
            dataIndex: 'ruleName',
            key:"ruleName",
            width:'35%',
            ellipsis:true,
            render:(text,record)=>   <Tooltip placement="top" title={text} ><div className='scan-issue-text' onClick={()=>openReqDrawer(record)}>
                {text}
            </div>
            </Tooltip>
        },
        {
            title: '文件',
            dataIndex: 'filePath',
            key:"filePath",
            width:'35%',

            render:(text,record)=>{
                const data=text.length>30?"..."+text.slice(text.length-30):text
                return(
                    <Tooltip placement="top" title={text}>
                        {data}
                    </Tooltip>
                )
            }
        },
        {
            title: '问题类型',
            dataIndex: 'ruleType',
            key:"ruleType",
            width:'10%',
            render:(text)=>text==="norm"&&<div>规范</div>|| text==="function"&&<div >功能</div>
                ||text==="security"&&<div>安全</div>
        },
        {
            title: '问题等级',
            dataIndex: 'problemLevel',
            key:"problemLevel",
            width:'10%',
            ellipsis:true,
            render:(text)=>text===1&&<div className='scanDetails-hole-red'>严重</div>|| text===2&&<div className='scanDetails-hole-dired'>警告</div>
                ||text===3&&<div className='scanDetails-hole-blue'>建议</div>
        },


        {
            title: '状态',
            dataIndex: 'problemState',
            width:'10%',
            ellipsis:true,
            render:(text)=>text===0?<div className='scan-req-state-no'>未处理</div>:<div className='scan-req-state'>已处理</div>
        },
    ];



    //分页查询
    const changPage = (value) => {
        setCurrentPage(value)
        getIssueList(value,{problemLevel:issueLeve,ruleType:type,problemState:issueState})

    }
    const refreshFind = () => {
        setCurrentPage(1)
    }

    //通过问题等级查询
    const changLeve = (value) => {
        setIssueLeve(value)
        getIssueList(1,{problemLevel:value,ruleType:type,problemState:issueState})
        getIssueCount({problemLevel:value,ruleType:type,problemState:issueState})
    }

    //切换类型
    const changType = (value) => {
        setType(value)
        getIssueList(1,{problemLevel:issueLeve,ruleType:value,problemState:issueState})
        getIssueCount({problemLevel:issueLeve,ruleType:value,problemState:issueState})
    }

    //打开抽屉弹窗
    const openReqDrawer= (value) => {
        setReqDetails(value)
        setDrawerVisible(true)
    }

    const clickState = (value) => {
        setIssueState(value.id)
        getIssueList(1,{problemLevel:issueLeve,ruleType:type,problemState:value.id})
    }


    return(
        <div className='sourcefare sourcewair-page-width scan-issue'>
            <Col sm={{ span: "24" }}
                 md={{ span: "24" }}
                 lg={{ span: "24" }}
                 xl={{ span: "20", offset: "2" }}
                 xxl={{ span: "18", offset: "3" }}
            >
                <div className='scan-req-top'>
                    <Breadcrumb firstItem={`问题`}/>
                </div>
                <div className='scan-req-search'>
                    <Tabs
                        type={issueState}
                        tabLis={[
                            {id:2, title:'所有'},
                            {id:0, title:'未处理'},
                            {id:1, title:'已处理'},
                        ]}
                        onClick={clickState}
                        findType={'issue'}
                        dataNum={issueNumData}
                    />
                    <div className='scan-req-search-right'>
                        <Select  allowClear onChange={value=>changType(value)} style={{minWidth:140}} placeholder='类型'>
                            <Select.Option value={"security"}>{"安全"}</Select.Option>
                            <Select.Option value={"function"}>{"功能"}</Select.Option>
                            <Select.Option value={"norm"}>{"规范"}</Select.Option>
                        </Select>
                        <Select  allowClear onChange={value=>changLeve(value)} style={{minWidth:140}} placeholder="问题等级">
                            <Select.Option value={1}>{"严重"}</Select.Option>
                            <Select.Option value={2}>{"警告"}</Select.Option>
                            <Select.Option value={3}>{"建议"}</Select.Option>
                        </Select>
                    </div>
                </div>
                <div className='scan-req-tab'>
                    <Table
                        columns={columns}
                        dataSource={recordReqList}
                        rowKey={record=>record.id}
                        pagination={false}
                        locale={{emptyText: isLoading ?
                                <SpinLoading type="table"/>: <EmptyText title={"没有数据"}/>}}
                    />
                </div>
                <Page pageCurrent={currentPage}
                      changPage={changPage}
                      totalRecord={totalRecord}
                      totalPage={totalPage}
                      refresh={refreshFind}
                />

                <ScanReqDrawer visible={drawerVisible}
                               setVisible={setDrawerVisible}
                               reqDetails={reqDetails}
                               projectId={params.id}
                               type={"issue"}
                />
            </Col>
        </div>
    )
}
export default ScanIssueList
