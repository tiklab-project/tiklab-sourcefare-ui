/**
 * @name: ScanIssueList
 * @author: limingliang
 * @date: 2023-11-07 14:30
 * @description：扫描问题列表
 * @update: 2023-11-07 14:30
 */
import React,{useState,useEffect,useRef} from 'react';
import {Select, Table, Tooltip} from "antd";
import ScanReqDrawer from "./ScanReqDrawer";
import Page from "../../../common/page/Page";
import EmptyText from "../../../common/emptyText/EmptyText";
import "./IssueList.scss"
import InstanceStore from "../store/InstanceStore";
import {observer} from "mobx-react";
import Tabs from "../../../common/tabs/Tabs";

const IssueList = (props) => {
    const {projectId,scanRecord}=props

    const {refresh,findRecordInstancePageByPlay,findIssueTypeStatisticCount}=InstanceStore

    const [scanIssuesList,setScanIssuesList]=useState([])
    const [currentPage,setCurrentPage]=useState(1)
    const [totalRecord,setTotalRecord]=useState()
    const [totalPage,setTotalPage]=useState()
    const [pageSize]=useState(15)

    const [drawerVisible,setDrawerVisible]=useState(false)  //抽屉弹窗状态

    const [reqDetails,setReqDetails]=useState('')       //错误详情

    const [type,setType]=useState("all")

    //等级
    const [level,setLevel]=useState()
    //状态
    const [state,setState]=useState()

    const [issueNumData,setIssueNumData]=useState()


    useEffect(async () => {
        if (scanRecord){
            findScanIssues(currentPage)

            findIssueTypeStatisticCount(scanRecord.id).then(res=>{
                setIssueNumData(res.data)
            })
        }
    }, [scanRecord,type]);


    //分页查询问题列表
    const findScanIssues = (currentPage,param) => {
        const findType=type==='all'?null:type
        findRecordInstancePageByPlay({
            pageParam:{currentPage:currentPage, pageSize:pageSize},
            projectId:projectId,
            scanRecordId:scanRecord.id,
            ruleType: findType,
            ...param
            }).then(res=>{

            if (res.code===0){
                setScanIssuesList(res.data.dataList)
                setTotalPage(res.data.totalPage)
                setCurrentPage(res.data.currentPage)
                setTotalRecord(res.data.totalRecord)
            }
        })
    }

    //打开右侧抽屉
    const openReqDrawer = (record) => {
        setReqDetails(record);
        setDrawerVisible(true)
    }

    //分页查询
    const handleChange = (value) => {
        setCurrentPage(value)
        findScanIssues(value)
    }

    //切换问题等级
    const changLeave = (value) => {
        setLevel(value)
        findScanIssues(1,{problemLevel:value,state:state})
    }
    //切换状态
    const changState = (value) => {
        setState(value)
        findScanIssues(1,{problemLevel:level,state:value})
    }
  /*  //切换类型
    const changType = (value) => {
        setType(value)
        findScanIssues(1,{problemLevel:level,state:state})
    }
*/
    const clickType = (value) => {
        setType(value.id)
    }

    const recordColumns =[
        {
            title: '问题',
            dataIndex: 'ruleName',
            key:"ruleName",
            width:'30%',
            ellipsis:true,
            render:(text,record)=>{
                return(
                    <Tooltip placement="top" title={text} >
                        <div className='scan-req-name' onClick={()=>openReqDrawer(record)}>
                            {text}
                        </div>
                    </Tooltip>
                )}
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
            title: '文件名',
            dataIndex: 'filePath',
            key:"filePath",
            width:'30%',
            ellipsis:true,
            render:(text,record)=>{
               const data=text.length>35?"..."+text.slice(text.length-35):text
                return(
                    <Tooltip placement="top" title={text}>
                        {data}
                    </Tooltip>
                )
            }
        },

        {
            title: '问题等级',
            dataIndex: 'problemLevel',
            key:"problemLevel",
            width:'10%',
            render:(text)=>text===1&&<div className='issue-text-red'>严重</div>||
                text===2&&<div className='issue-text-yellow'>错误</div>||
                text===3&&<div className='issue-text-blue'>警告</div>||
                text===4&&<div className='issue-text-green'>提示</div>
        },
        {
            title: '状态',
            dataIndex: 'state',
            key:"state",
            width:'10%',
            ellipsis:true,
            render:(text,record)=>{
                return(
                    <div>
                        {
                            text===0&&<div className='scan-req-state-no'>未处理</div>||
                            text===1&&<div className='scan-req-state'>已处理</div>
                        }
                    </div>
                )}
        },
        /* {
             title: '引入时间',
             dataIndex: 'importTime',
             key:"importTime",
             width:'10%',
         },
 */
    ]



    return(
        <div className='issue'>
            <div className='issue-search'>
                <Tabs
                    type={type}
                    tabLis={[
                        {id:"all", title:'全部'},
                        {id:"function", title:'功能'},
                        {id:"security", title:'安全'},
                        {id:"norm", title:'规范'}
                    ]}
                    onClick={clickType}
                    findType={"issueType"}
                    dataNum={issueNumData}
                />

                <div className='issue-search-right'>
                    <Select  allowClear onChange={value=>changLeave(value)} style={{minWidth:140}} placeholder='问题等级'>
                        <Select.Option value={1}>{"严重"}</Select.Option>
                        <Select.Option value={2}>{"错误"}</Select.Option>
                        <Select.Option value={3}>{"警告"}</Select.Option>
                        <Select.Option value={4}>{"提示"}</Select.Option>
                    </Select>
                    <Select  allowClear onChange={value=>changState(value)} style={{minWidth:140}} placeholder='状态'>
                        <Select.Option value={0}>{"未处理"}</Select.Option>
                        <Select.Option value={1}>{"已解决"}</Select.Option>
                    </Select>
                </div>
            </div>

            <Table
                columns={recordColumns}
                dataSource={scanIssuesList}
                rowKey={record=>record.id}
                pagination={false}
                className='scan-tab-top'
                locale={{emptyText: <EmptyText title={"暂无数据"}/>}}
            />
            <Page totalPage={totalPage}
                  pageCurrent={currentPage}
                  totalRecord={totalRecord}
                  changPage={handleChange}
            />

            <ScanReqDrawer visible={drawerVisible}
                           setVisible={setDrawerVisible}
                           reqDetails={reqDetails}
                           projectId={projectId}
            />
        </div>
    )

}
export default observer(IssueList)
