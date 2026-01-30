/**
 * @name: ScanDetails
 * @author: limingliang
 * @date: 2023-11-03 14:30
 * @description：扫描记录
 * @update: 2023-11-03 14:30
 */

import React,{useState,useEffect,Fragment} from 'react';
import "./ScanReportDetails.scss"
import {inject, observer} from "mobx-react";
import scanRecordStore from "../store/ScanRecordStore"
import {Table, message, Empty, Tooltip, Popconfirm, Col, Row, Modal} from "antd";
import codeScanStore from "../store/CodeScanStore";
import ScanLogDrawer from "../common/ScanLogDrawer";
import ScanSetting from "./ScanSetting";
import Breadcrumb from "../../../common/breadcrumb/Breadcrumb";
import Btn from "../../../common/btn/Btn";
import Overview from "./Overview";
import InstanceStore from "../store/InstanceStore";
import ScanDoorStore from "../../setting/door/store/ScanDoorStore";
import ScanCode from "./ScanCode";
import ReportContent from "./ReportContent";
import OverviewStore from "../store/OverviewStore";
import IssueList from "./IssueList";
import MetricContent from "./MetricContent";
import CodeStore from "../store/CodeStore";
import {
    DownloadOutlined,
    FileDoneOutlined,
    FileTextOutlined,
    QuestionCircleOutlined,
    ToTopOutlined
} from "@ant-design/icons";
import {getVersionInfo} from "tiklab-core-ui";
import ModalContentTip from "../../../common/statistics/ComTip/ModalContentTip";
const ScanReportDetails= (props) => {
    const {projectStore,match:{params}} = props;
    const {findScanRecord,findScanRecordLogList,refresh}=scanRecordStore
    const {findRecordInstancePageByPlay}=InstanceStore
    const {findScanDoorByProjectId}=ScanDoorStore
    const {codeScanExec}=codeScanStore
    const {findProject,findProjectRepByProjectId,findApplySystem} = projectStore
    const {findProjectCoverStat,findScanRecordStat,findMetricStat}=OverviewStore

    const [projectData,setProjectData]=useState(null)

    //代码仓库信息
    const [repository,setRepository]=useState(null)


    const [tableType,setTableType]=useState('overview')

    const [scanRecord,setScanRecord]=useState('')

    const [logVisible,setLogVisible]=useState(false)  //日志抽屉状态

    const [logRecordLogList,setRecordLogList]=useState([])  //打开日志的扫描记录

    const [scanRecordStat,setScanRecordStat]=useState('')
    const [scanCoverStat,setScanCoverStat]=useState(null)  //扫描覆盖率统计
    const [metricStat,setMetricStat]=useState(null)  //扫描重复度统计、复杂度统计

    const [probNum,setProbNum]=useState(0)
    //门禁值
    const [scanDoor,setScanDoor]=useState(null)

    const [staticVisible,setStaticVisible] = useState(false)    //打开提示款弹窗

    const [applySystem,setApplySystem]=useState(null)

    useEffect(async () => {

        findScanRecord(params.recordId).then(res=>{
            res.code===0&&setScanRecord(res.data)
        })

        getScanRecordStat()

        findProjectRepByProjectId(params.id).then(res=>{
            res.code===0&&setRepository(res.data)
        })

    }, [refresh]);

    useEffect( ()=>{
        findApplySystem().then(value=>{
            if (value.code===0){
                setApplySystem(value.data)
            }
        })
    },[])


    useEffect(async () => {
        findRecordInstancePageByPlay({
            pageParam:{currentPage:1, pageSize:10},
            scanRecordId:params.recordId,
        }).then(res=>{
            if (res.code===0){
                setProbNum(res.data.totalRecord)
            }
        })

        //查询覆盖率
        findProjectCoverStat(params.recordId).then(res=>{
            res.code===0&&setScanCoverStat(res.data)
        })

        //查询门禁值
        findScanDoorByProjectId(params.id).then(res=>{
            res.code===0&&setScanDoor(res.data)
        })

        findProject(params.id).then(res=>{
            res.code===0&&setProjectData(res.data)
        })

        findMetricStat(params.id,params.recordId).then(res=>{
            res.code===0&&setMetricStat(res.data)
        })
    }, []);



    //查询扫描记录统计
    const getScanRecordStat = () => {
        findScanRecordStat(params.recordId).then(res=>{
            if (res.code===0){
                setScanRecordStat(res.data)
            }
        })}


    const goBack = () => {
        props.history.push(`/project/${params?.id}/report`)
    }

    const excMultiScan = () => {
        message.info("开始执行扫描")

        //setLogVisible(true)
        codeScanExec(params.id).then(res=>{
            if (res.code===0&&res.data==='ok'){
                //setMultiState(true)
                //scanLibraryTime()
            }else {
                message.error(res.msg)
            }
        })
    }


    //切换tab
    const cuteTab = (value) => {
      setTableType(value)
        setLogVisible(false)
        if (value==='history'){
            findScanRecord(currentPage)
        }
    }


    const goScanResult= (value) => {
        props.history.push(`/project/${params?.id}/scanDetails/${value.id}`)
    }




    //打开扫描日志
    const openLog = (value) => {

    }
    //导出报告
    const exportReport = (value) => {
        if (value==='log'){
            setLogVisible(true)
            findScanRecordLogList({scanRecordId:params.recordId}).then(res=>{
                if (res.code===0&&res.data){
                    setRecordLogList(res.data)
                }
            })
        }else {
            window.open(`${node_env? base_url:window.location.origin}/exportData/exportPdf/${scanRecord.projectId}/${scanRecord.id}`);

        }
    }

    const closeVisible = () => {
        setStaticVisible(false)
        window.open(`${node_env? base_url:window.location.origin}/exportData/exportPdf/${scanRecord.projectId}/${scanRecord.id}`);
    }

    return(
        <div className='scanRecord'>
            <div className='scanRecord-header'>
                <Row >
                    <Col span={8}>
                        <div className='canRecord-header-left'>
                            <div className='canRecord-header-left-title'>
                                <Breadcrumb firstItem={`扫描历史`} secondItem={params?.recordId} goBack={goBack}/>
                            </div>
                        </div>
                    </Col>
                    <Col span={8} >
                        <div className='scan-tab-style'>
                            <div className={`${tableType==='overview'&&' choose-scanRecord-type'}`} onClick={()=>cuteTab("overview")}>
                                概览
                            </div>
                            <div className={`${tableType==='issue'&&' choose-scanRecord-type'}`} onClick={()=>cuteTab("issue")}>
                                问题
                            </div>
                            <div className={`${tableType==='metric'&&' choose-scanRecord-type'}`} onClick={()=>cuteTab("metric")}>
                                度量
                            </div>
                            <div className={`${tableType==='code'&&' choose-scanRecord-type'}`} onClick={()=>cuteTab("code")}>
                                代码
                            </div>
                        </div>

                    </Col>
                    <Col span={8}>
                        <div className='scan-play-style-right'>
                            <div className='scan-play-style' onClick={()=>exportReport("log")}>
                                <Tooltip title='日志'>
                                    <FileTextOutlined />
                                </Tooltip>

                            </div>
                            <div className='scan-play-style' onClick={()=>exportReport("pdf")}>
                                <Tooltip title='导出'>
                                    <DownloadOutlined />
                                </Tooltip>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            {
                tableType === 'metric' &&
                <MetricContent {...props}
                               recordId={params?.recordId}
                               projectData={projectData}
                               scanRecord={scanRecord}
                               probNum={probNum}
                />||
                tableType === 'code' &&
                <ScanCode {...props}
                          projectId={params?.id}
                          recordId={params?.recordId}
                          projectData={projectData}
                          findProject={findProject}
                />||
                ( tableType === 'overview' ||tableType === 'issue' )&&
                <div className='sourcefare  scan-report-page-width'>
                    <Col sm={{ span: "24" }}
                         md={{ span: "24" }}
                         lg={{ span: "24" }}
                         xl={{ span: "20", offset: "2" }}
                         xxl={{ span: "18", offset: "3" }}
                    >
                        <div className='scanRecord-data-top'>

                            {
                                tableType === 'overview' &&
                                <Overview scanRecordStat={scanRecordStat}
                                          scanCoverStat={scanCoverStat}
                                          metricStat={metricStat}
                                          scanDoor={scanDoor}
                                />||
                                tableType === 'issue' &&
                                <IssueList projectId={projectData?.id}
                                           scanRecord={scanRecord}
                                />
                            }
                        </div>
                    </Col>
                </div>
            }
            <ScanLogDrawer visible={logVisible}
                           setVisible={setLogVisible}
                           scanRecord={scanRecord}
                           logList={logRecordLogList}
            />

            <Modal
                closable={false}
                footer={null}
                className='task-add-enhance-modal'
                width={450}
                visible={staticVisible}
                onCancel={()=>setStaticVisible(false)}
            >
                <ModalContentTip
                    config={{
                        title:'导出pdf',
                        desc:'导出扫描概览的pdf'
                    }}
                    applySystem={applySystem}
                    closeVisible={closeVisible}
                />
            </Modal>
        </div>

    )

}
export default inject('projectStore')(observer(ScanReportDetails))
