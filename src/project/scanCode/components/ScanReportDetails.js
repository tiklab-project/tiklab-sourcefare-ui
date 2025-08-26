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
import {Table, message, Empty, Tooltip, Popconfirm, Col} from "antd";
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
const ScanReportDetails= (props) => {
    const {projectStore,match:{params}} = props;
    const {findScanRecord,findScanRecordLogList,refresh}=scanRecordStore
    const {findRecordInstancePageByPlay}=InstanceStore
    const {findScanDoorByProjectId}=ScanDoorStore

    const {codeScanExec}=codeScanStore
    const {findProject,findProjectRepByProjectId} = projectStore
    const {findProjectCoverStat,findScanRecordStat,findMetricStat}=OverviewStore

    const [projectData,setProjectData]=useState(null)

    //代码仓库信息
    const [repository,setRepository]=useState(null)


    const [tableType,setTableType]=useState('overview')

    const [scanRecord,setScanRecord]=useState('')

    const [logVisible,setLogVisible]=useState(false)  //日志抽屉状态

    const [logRecordLog,setRecordLog]=useState(null)  //打开日志的扫描记录

    const [scanRecordStat,setScanRecordStat]=useState('')
    const [scanCoverStat,setScanCoverStat]=useState(null)  //扫描覆盖率统计
    const [metricStat,setMetricStat]=useState(null)  //扫描重复度统计、复杂度统计

    const [probNum,setProbNum]=useState(0)
    //门禁值
    const [scanDoor,setScanDoor]=useState(null)



    useEffect(async () => {

        findScanRecord(params.recordId).then(res=>{
            res.code===0&&setScanRecord(res.data)
        })

        getScanRecordStat()

        findProjectRepByProjectId(params.id).then(res=>{
            res.code===0&&setRepository(res.data)
        })

    }, [refresh]);


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
        })
    }




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
        setLogVisible(true)
        findScanRecordLogList({scanRecordId:params.recordId}).then(res=>{
            if (res.code===0&&res.data){
               setRecordLog(res.data[0])
            }
        })

    }



    return(
        <div className='scanRecord'>
            <div className='scanRecord-header'>
                <div className='scanRecord-top'>
                    <div className='canRecord-header-left'>
                        <div className='canRecord-header-left-title'>
                            <Breadcrumb firstItem={`扫描报告`} secondItem={params?.recordId} goBack={goBack}/>
                        </div>
                        <div className='scanRecord-header-tab'>
                            <div className='scan-tab-style'>
                                <div className={`${tableType==='overview'&&' choose-scanRecord-type'}`} onClick={()=>cuteTab("overview")}>概览</div>
                                <div className={`${tableType==='report'&&' choose-scanRecord-type'}`} onClick={()=>cuteTab("report")}>
                                    报告
                                </div>
                                <div className={`${tableType==='code'&&' choose-scanRecord-type'}`} onClick={()=>cuteTab("code")}>代码</div>
                            </div>
                        </div>
                    </div>
                    <div className='scan-play-style'>

                        <div className='scan-but-style'>
                            <Btn   title={'日志'} onClick={openLog}/>
                        </div>
                    </div>
                </div>
            </div>

            {
                tableType === 'report' ?
                <ReportContent {...props}
                               recordId={params?.recordId}
                               projectData={projectData}
                               scanRecord={scanRecord}
                               probNum={probNum}
                />:
                <div className='sourcefare  scan-report-page-width'>
                    <Col sm={{ span: "24" }}
                         md={{ span: "24" }}
                         lg={{ span: "24" }}
                         xl={{ span: "20", offset: "2" }}
                         xxl={{ span: "18", offset: "3" }}
                    >
                        <div className='scan-data-style'>
                            {
                                tableType === 'overview' &&
                                <div className='tab-top'>
                                    <Overview scanRecordStat={scanRecordStat}
                                              scanCoverStat={scanCoverStat}
                                              metricStat={metricStat}
                                              scanDoor={scanDoor}
                                    />
                                </div>||
                                tableType === 'code' &&
                                <div className='tab-top'>
                                    <ScanCode {...props}
                                              projectId={params?.id}
                                              recordId={params?.recordId}
                                              projectData={projectData}
                                              findProject={findProject}
                                    />
                                </div>
                            }
                        </div>
                    </Col>
                </div>
            }
            <ScanLogDrawer visible={logVisible}
                           setVisible={setLogVisible}
                           scanRecord={scanRecord}
                           logRecordLog={logRecordLog}
            />
        </div>

    )

}
export default inject('projectStore')(observer(ScanReportDetails))
