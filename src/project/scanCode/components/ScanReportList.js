
/**
 * @name: scanReportList
 * @author: limingliang
 * @date: 2025-05-30 14:30
 * @description：扫描报告
 * @update: 2025-05-30 14:30
 */

import React,{useState,useEffect,Fragment} from 'react';
import Breadcrumb from "../../../common/breadcrumb/Breadcrumb";
import {Button, Col, Input, message, Select, Spin, Table, Tooltip, Upload} from "antd";
import "./ScanReportList.scss"
import {inject, observer} from "mobx-react";
import Page from "../../../common/page/Page";
import ScanRecordStore from "../store/ScanRecordStore";
import success from "../../../assets/images/img/success.png";
import fail from "../../../assets/images/img/fail.png";
import DeleteExec from "../../../common/delete/DeleteExec";
import {SpinLoading} from "../../../common/loading/Loading";
import EmptyText from "../../../common/emptyText/EmptyText";
import Btn from "../../../common/btn/Btn";
import codeScanStore from "../store/CodeScanStore";
import {CopyOutlined, FileOutlined, FileTextOutlined, SearchOutlined, SyncOutlined} from "@ant-design/icons";
import ProjectRepUploadStore from "../../project/store/ProjectRepUploadStore";
import {getUser,getAPIgateway} from "tiklab-core-ui";
import Tabs from "../../../common/tabs/Tabs";
import {PrivilegeProjectButton} from 'tiklab-privilege-ui';
import ScanLogDrawer from "../common/ScanLogDrawer";
const scanReportList = (props) => {
    const {match:{params},projectStore} = props;
    const {findScanRecordPage,deleteScanRecordByProjectId,findScanRecordLogList,refresh}=ScanRecordStore
    const {findProjectRepUploadByRepId}=ProjectRepUploadStore

    const {projectData,findProject} = projectStore
    const {codeScanExec,findScanState}=codeScanStore
    const user = getUser();
    const [findState,setFindState]=useState(true)

    const [isLoading,setIsLoading]=useState(false)
    const [scanRecordList,setScanRecordList]=useState([])
    const [currentPage,setCurrentPage]=useState(1)
    const [totalRecord,setTotalRecord]=useState()
    const [totalPage,setTotalPage]=useState()
    const [pageSize]=useState(15)

    const [scanResult,setScanResult]=useState(null)

    const [multiState,setMultiState]=useState(false)
    const [logVisible,setLogVisible]=useState(false)  //日志抽屉状态

    //代码信息
    const [uploadCodeState,setUploadCodeState]=useState(false)
    //本地上传二进制包
    const [fileList, setFileList] = useState([]);

    //执行类型
    const [execType,setExecType]=useState("all")

    //扫描日志
    const [logList,setLogList]=useState([])
    const [scanRecord,setScanRecord]=useState(null)

    const [openLogType,setOpenLogType]=useState()



    useEffect(async() => {
        findProject(params.id).then(res=>{
            if (res.code===0&&res.data?.scanWay==='serverUpload'){
                findProjectRepUploadByRepId(params.id).then(res=>{
                    if (res.code===0){
                        if (res.data){
                            setUploadCodeState(false)
                        }else {
                            setUploadCodeState(true)
                        }
                    }
                    setFindState(false)
                })
            }
        })
    }, [fileList]);

    useEffect(async() => {
        await findScanRecord(currentPage)
        setFindState(false)
    }, [refresh]);


    const findScanRecord = (currentPage,scanResult) => {
        setIsLoading(true)
        findScanRecordPage({
            pageParam:{currentPage:currentPage, pageSize:pageSize},
            projectId:params.id,
            issueResult:scanResult

        }).then(res=>{
            if (res.code===0){
                setScanRecordList(res.data.dataList)
                setTotalPage(res.data.totalPage)
                setCurrentPage(res.data.currentPage)
                setTotalRecord(res.data.totalRecord)
            }
            setIsLoading(false)
        })

    }
    //分页
    const changPage = (value) => {
        setCurrentPage(value)
        findScanRecord(value,scanResult)
    }

    //刷新查询
    const refreshFind = () => {
        findScanRecord(1)
    }


    const changResult = (value) => {
        setScanResult(value)
        findScanRecord(1,value)
    }

    //执行扫描
    const excMultiScan = () => {
        setMultiState(true)
        codeScanExec(params.id).then(res=>{
            if (res.code===0&&res.data){
                setOpenLogType("run")
                setDataNll()
                setLogVisible(true)
                scanTime(res.data.id)
                findScanRecord(1)
            }else {
                message.error(res.msg)
                setMultiState(false)
            }
        })
    }


    //扫描定时任务
    const scanTime =async(value)=>{
        let timer=setInterval(()=>{
            findScanState(params.id,value).then(res=>{
                if (res.code===0){
                    const data=res.data
                    setLogList(data.Logs)
                    setScanRecord({
                        id:value,
                        ...data,
                    })
                    if (data.scanRecord?.scanResult==='success'||data.scanRecord?.scanResult==='fail'){
                        message.success('扫描成功',1)
                    }
                    if (data.scanRecord?.scanResult==='execFail'){
                        message.error('扫描失败',1)
                    }
                    if (res.data.state==='end'){
                        clearInterval(timer)
                        setMultiState(false)
                        findScanRecord(1)
                    }
                }else {
                    clearInterval(timer)
                    setMultiState(false)
                }
            })
        },1000)
    }



    //查询扫描报告的记录
    const goDetails = (data) => {
        props.history.push(`/project/${params.id}/report/${data.id}`)
    }

    //打开日志
    const openLog = (value) => {
        setDataNll()
        setScanRecord(value)
        setOpenLogType("")
        if (value.issueResult==='run'){
            scanTime(value.id)
          /*  findScanState(params.id,value.id).then(res=>{
                if (res.code===0){
                    setScanRecord({
                        id:value,
                        ...res.data
                    })
                }else {
                    message.error("查询日志失败",1)
                }
            })*/
        }else {

            findScanRecordLogList({scanRecordId:value.id}).then(res=>{
                if (res.code===0){
                    setLogList(res.data)
                } else {
                    message.error("查询日志失败",1)
                }
            })
        }
        setLogVisible(true)
    }

    const setDataNll = () => {
        setLogList([])
        setScanRecord(null)
    }


    //切换项目类型
    const clickType = (value) => {
        setExecType(value.id)
    }

    //复制
    const clickCopy = (type) => {
        let value= document.getElementById(type).outerText;
        const textarea = document.createElement('textarea');
        textarea.value = value;

        // 使 textarea 不可见
        textarea.style.position = 'fixed'; // 避免影响页面布局
        textarea.style.left = '-9999px';

        // 添加到文档中
        document.body.appendChild(textarea);

        // 选中 textarea 的内容
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length); // 确保在移动设备上也能正确选中

        // 执行复制命令
        const successful = document.execCommand('copy');
        if (successful){
            message.success("复制成功",1)
        }else {
            message.error("复制失败",1)
        }
        document.body.removeChild(textarea);
    }

    const beforeUpload = (file) => {
        const isZip = file.type === 'application/zip' || file.name.endsWith('.zip');
        if (!isZip) {
            message.error('只能上传 ZIP 文件!');
            return Upload.LIST_IGNORE; // 阻止上传
        }
        return true;
    };


    //文件上传
    const fileUpload={
        name: 'uploadFile',
        action: `${node_env? base_url:window.location.origin}/projectRepUpload/upload`,
        headers:{
            ticket: user.ticket,
            tenant: user.tenant,
            ...getAPIgateway(),
        },
        data:{
            projectId:params.id
        },
        progress:{
            strokeColor: {
                '0%': '#108ee9',
                '100%': '#108ee9',
            },
            strokeWidth: 3,
            format: (percent) =>`${parseFloat(percent.toFixed(2))}%`,
        },

        onChange(info) {
            setFileList([])
            let fileList = [...info.fileList];
            fileList = fileList.slice(-1);
            fileList = fileList.map(file => {
                if (file.response) {
                    if (file.response.code===0){
                        message.success("上传成功")
                    }else {
                        message.error("上传失败："+file.response.msg)
                    }
                    file.url = file.response.url;
                }

                return file;
            });
            setFileList(fileList)
        },
    }


    const uploadUrl = base_url === '/' ? window.location.origin : base_url;

    const columns = [
        {
            title: '报告编号',
            dataIndex: "id",
            key:"id",
            width:'20%',
            ellipsis:true,
            render:(text,record)=>{
                return (
                    <div className='scan-report-table-nav' onClick={()=>goDetails(record)}>
                        {text}
                    </div>

                )
            }
        },
        {
            title: '运行状态',
            dataIndex: "scanResult",
            key:"scanResult",
            width:'15%',
            render:(text,record)=>{
                return(
                    <div>
                        {
                            record.issueResult==='run'?
                                <div className='icon-text'>
                                    <span>执行中</span>
                                </div>:
                            ( record.issueResult==='execFail'|| record.comResult==='execFail'||
                                record.dupResult==='execFail'||   record.coverResult==='execFail')?
                            <div className='icon-text'>
                                <img  src={fail}  style={{width:16,height:16}}/>
                                <span>失败</span>
                            </div>:
                            <div className='icon-text'>
                                <img  src={success}  style={{width:16,height:16}}/>
                                <span>成功</span>
                            </div>
                        }
                    </div>
                )
            }
        },
        {
            title: '扫描结果',
            dataIndex: 'issueResult',
            width:'15%',
            render:(text,record)=>{
                return (
                    <div>
                        {
                            text==='fail'&&
                                <div className='scan-result-fail'>
                                    <span>未通过</span>
                                </div>||
                            text==='success'&&
                                <div className='scan-result-success'>
                                    <span>通过</span>
                                </div>/*||
                            ( text==='execFail'||text==='run')&&
                                <div className='scan-result-exec-fail'>
                                    {"——"}
                                </div>*/
                        }
                    </div>

                )
            }
        },
        {
            title: '扫描问题',
            dataIndex: 'scanResult',
            width:'23%',
            render:(text,record)=>{
                return (
                    <div className='scan-report-result-num'>
                        <span className='scan-report-num-red'>{record?.severityTrouble}</span>
                        <span>/</span>
                        <span className='scan-report-num-yellow'>{record?.errorTrouble}</span>
                        <span>/</span>
                        <span className='scan-report-num-build'>{record?.noticeTrouble}</span>
                        <span>/</span>
                        <span className='scan-report-num-green'>{record?.suggestTrouble}</span>
                    </div>

                )
            }
        },
        {
            title: '扫描时间',
            dataIndex: 'createTime',
            width:'20%',
        },
        {
            title: '耗时',
            dataIndex: 'scanTime',
            width:'10%',
        },
        {
            title: '操作',
            key: 'activity',
            width:'7%',
            render: (text, record) => {
                return(
                    <div className="icon-text">

                        <Tooltip title='日志'>
                            <FileTextOutlined  onClick={()=>openLog(record)}/>
                        </Tooltip>
                        <PrivilegeProjectButton code={"scan_report_delete"} domainId={params.id}>
                            <DeleteExec value={record}
                                        repositoryId={params.id}
                                        deleteData={deleteScanRecordByProjectId}
                                        type={"record"}
                                        title={"确认删除"}/>
                        </PrivilegeProjectButton>
                    </div>


                )
            }
        },
    ];

    return(
        <div className='sourcefare sourcewair-page-width scan-report' >
            <Col sm={{ span: "24" }}
                 md={{ span: "24" }}
                 lg={{ span: "24" }}
                 xl={{ span: "20", offset: "2" }}
                 xxl={{ span: "18", offset: "3" }}
            >
                <div className='scan-report-top'>
                     <Breadcrumb firstItem={`扫描历史`}/>
                     {
                         (projectData?.scanWay==='server'||(!uploadCodeState&&projectData?.scanWay==='serverUpload'))&&
                         <PrivilegeProjectButton code={"scan_exec"} domainId={params.id}>
                             <div className='scan-but-style'>
                                 {
                                     multiState?
                                         <Btn   type={'primary'} title={'加载中'} />:
                                         <Btn   type={'primary'} title={'扫描'} onClick={excMultiScan}/>
                                 }
                             </div>
                         </PrivilegeProjectButton>
                     }
                </div>

                <Spin spinning={findState}>
                    {
                        uploadCodeState?
                            <div className='scan-report-no-code'>
                                <div className="no-code-style">
                                    <div>
                                        {"上传扫描代码包 (支持zip类型)"}
                                    </div>
                                    <div className='no-code-style-button'>
                                        <Upload {...fileUpload}
                                                beforeUpload={beforeUpload}
                                                maxCount={1}
                                        >
                                            <Btn  title={'上传代码'} type={'primary'} />
                                        </Upload>
                                    </div>

                                </div>
                            </div>:
                            <Fragment>
                                <div className='scan-report-search'>
                                    <Tabs
                                        type={execType}
                                        tabLis={[
                                            {id:"all", title:'所有'},
                                            {id:"oneself", title:'我执行的'},
                                        ]}
                                        onClick={clickType}
                                    />

                                    <div className='scan-report-search-right'>
                                        <Select  allowClear onChange={value=>changResult(value)} style={{minWidth:140}} placeholder='扫描结果'>
                                            <Select.Option value={"success"}>{"通过"}</Select.Option>
                                            <Select.Option value={"fail"}>{"未通过"}</Select.Option>
                                            <Select.Option value={"execFail"}>{"运行失败"}</Select.Option>
                                        </Select>
                                        {
                                            projectData?.scanWay==='client'&&
                                            <div className='scan-report-search-text'>
                                                <code id={'projectKey'}>{params.id}</code>
                                                <Tooltip title='复制projectKey' >
                                                    <CopyOutlined className={"scan-report-search-icon"} onClick={()=>clickCopy("projectKey")}/>
                                                </Tooltip >
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className='scan-report-tab'>
                                    <Table
                                        columns={columns}
                                        dataSource={scanRecordList}
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
                            </Fragment>
                    }
                </Spin >
            </Col>
            <ScanLogDrawer visible={logVisible}
                           setVisible={setLogVisible}
                           scanRecord={scanRecord}
                           logList={logList}

            />
        </div>
    )

}
export default inject('projectStore')(observer(scanReportList))
