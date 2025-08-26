/**
 * 仓库概览
 * @param props
 * @constructor
 */
import React,{useEffect,useState,useRef,Fragment} from 'react';
import "./Survey.scss"
import { Col} from 'antd';
import SurveyStore from "../store/SurveyStore";
import {inject, observer} from "mobx-react";
import DyncmicTimeAxis from "./DyncmicTimeAxis";
import {getUser} from "tiklab-core-ui";
import EmptyText from "../../../common/emptyText/EmptyText";
import Listicon from "../../../common/project/Listicon";
import ScanPlayExec from "../../../common/statistics/ScanPlayExec";
import ScanPlayExecTime from "../../../common/statistics/ScanPlayExecTime";



const Survey = (props) => {
    const {projectStore,match:{params},location} = props

    const {findLogPage,logList,findScanRecordPage,findScanPlayStat} = SurveyStore
    const [scanRecordList,setScanRecordList]=useState([])
    const [scanPlayStat,setScanPlayStat]=useState()


    useEffect(()=>{

        findScanRecord()

        findScanPlayStat(params.id).then(res=>{
            res.code===0&&setScanPlayStat(res.data)
        })
        //查询动态
        findLogPage({ project: params.id, currentPage: 1 })

    }, [])

    //查询最近扫描记录
    const findScanRecord = () => {
        findScanRecordPage({ pageParam:{currentPage:1,pageSize:10},
            projectId: params.id
        }).then(res=>{
            if (res.code===0){
                setScanRecordList(res.data.dataList)
            }
        })
    }

    //跳转扫描详情
    const goDetails = (data) => {
        props.history.push(`/project/${params.id}/report/${data.id}`)
    }

    const openBorder = (item) => {
        return(
            <Fragment>
                <div className='houseRecent-border-flex'>

                    <div className='houseRecent-border-text' >
                        {/*{filedState(item?.repository?.name)}*/}
                        #{item?.id}
                    </div>
                </div>
                <div className='houseRecent-border-flex houseRecent-border-text-top'>
                    <div className='houseRecent-border-desc'>
                        <span className='title-color'>状态</span>
                        {
                            item?.scanResult==="success"&&
                                <div className='desc-text-success'>通过</div>||
                            item?.scanResult==="fail"&&
                            <div className='desc-text-fail'>未通过</div>||
                            item?.scanResult==="execFail"&&
                            <div className='desc-text-fail'>运行失败</div>
                        }
                    </div>
                    <div className='houseRecent-border-desc'>
                        <span className='title-color'>耗时</span>
                        <span className='desc-text'>{item?.scanTime}</span>
                    </div>
                </div>
            </Fragment>
        )
    }

    return(
        <div className='sourcewair-page-width survey'>
            <Col sm={{ span: "24" }}
                 md={{ span: "24" }}
                 lg={{ span: "24" }}
                 xl={{ span: "20", offset: "2" }}
                 xxl={{ span: "18", offset: "3" }}
            >
                <div className='survey-style'>
                    {/*<BreadcrumbContent firstItem={'最近提交'}/>*/}
                    <div>
                        <div className='survey-title'>{'最近扫描'}</div>
                        {
                            scanRecordList && scanRecordList.length > 0 ?
                                <div className="survey-scan">
                                    {
                                        scanRecordList.map((item, key) => {
                                            return (
                                                (innerWidth >= 1700 && key < 5) &&
                                                <div key={key}
                                                     className='houseRecent-border houseRecent-border-width-20'
                                                     onClick={() => goDetails(item)}>
                                                    {openBorder(item)}
                                                </div> ||
                                                (innerWidth < 1700 && key < 4) &&
                                                <div key={key}
                                                     className='houseRecent-border houseRecent-border-width-25'
                                                     onClick={() => goDetails(item)}>
                                                    {openBorder(item)}
                                                </div>
                                            )
                                        })
                                    }
                                </div>:
                                <div className='no-data'>
                                    <EmptyText />
                                </div>
                        }

                    </div>

                    <div className='survey-style'>
                        <div className='survey-title'>扫描统计</div>
                        <div className='survey-style-border'>
                            <div className='survey-style-border-tread'>
                                <div className='survey-style-title'>
                                    <div>计划执行统计</div>
                                    <div className='survey-style-title-desc'>(只统计前4条计划)</div>
                                </div>
                                <ScanPlayExec scanPlayStat={scanPlayStat}/>
                            </div>
                            <div className='survey-style-border-tread'>
                                <div className='survey-style-title'>
                                    <div>时间执行统计</div>
                                    <div className='survey-style-title-desc'>(一周内每天执行的次数统计)</div>
                                </div>
                                <ScanPlayExecTime scanPlayStat={scanPlayStat}/>
                            </div>
                        </div>
                    </div>


                    <DyncmicTimeAxis logList={logList}/>

                </div>
            </Col>
        </div>
    )
}
export default  observer(Survey)
