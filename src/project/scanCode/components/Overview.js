/**
 * @name: Overview
 * @author: limingliang
 * @date: 2025-06-18 14:30
 * @description：扫描概览
 * @update: 2025-06-18 14:30
 */
import React,{useState,useEffect,useRef} from 'react';
import "./Overview.scss"
import ProblemLevel from "../../../common/statistics/ProblemLevel";
import ProblemType from "../../../common/statistics/ProblemType";
import EmptyText from "../../../common/emptyText/EmptyText";
import CoverPercent from "../../../common/statistics/CoverPercent";
import CoverNum from "../../../common/statistics/CoverNum";
const Overview = (props) => {
    const {scanRecordStat,scanCoverStat,metricStat,scanDoor}=props

    return(
        <div className='overview'>
            {
                scanRecordStat?
                    <>
                        <div className='overview-border'>
                            <div className='overview-hole-border'>
                                <div className={`${scanRecordStat?.scanResult==="success"?"result-success ":"result-fails "}  overview-rpy-border`}>
                                    <div className='overview-rpy-desc'>检测结果</div>
                                    {
                                        scanRecordStat?.scanResult==='success'&&
                                            <div className='overview-rpy-num relyOn-num'>{"通过"}</div>||
                                        scanRecordStat?.scanResult==='fail'&&
                                            <div className='overview-rpy-num relyOn-num'>{"不通过"}</div>||
                                        scanRecordStat?.scanResult==='execFail'&&
                                        <div className='overview-rpy-num relyOn-num'>{"运行失败"}</div>
                                    }
                                </div>
                                <div className='hole-border-left'>
                                    <div className='overview-hole-desc'>严重问题</div>
                                    <div className='overview-hole-num overview-hole-red'>{scanRecordStat?.severityTrouble}</div>
                                    <div className='overview-access'>
                                        <div> 门禁阈值</div>
                                        {
                                            scanDoor?.severityState===1?
                                                <div>{scanDoor?.severityNum}</div>:
                                                <div>未启动</div>
                                        }
                                    </div>
                                </div>
                                <div className='hole-border-left'>
                                    <div className='overview-hole-desc'>警告问题</div>
                                    <div className='overview-hole-num overview-hole-dired'>{scanRecordStat?.noticeTrouble}</div>
                                    <div className='overview-access'>
                                        <div> 门禁阈值</div>
                                        {
                                            scanDoor?.noticeState===1?
                                                <div>{scanDoor?.noticeNum}</div>:
                                                <div>Non</div>
                                        }
                                    </div>
                                </div>
                                <div className='hole-border-left'>
                                    <div className='overview-hole-desc'>提示问题</div>
                                    <div className='overview-hole-num overview-hole-blue'>{scanRecordStat?.suggestTrouble}</div>
                                    <div className='overview-access'>
                                        <div>门禁阈值</div>
                                        {
                                            scanDoor?.suggestState===1?
                                                <div>{scanDoor?.suggestNum}</div>:
                                                <div>未启动</div>
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className='overview-hole-border'>
                                <div className='hole-border-right'>
                                    <div className='overview-hole-desc'>所有问题</div>
                                    <div className='overview-hole-num'>{scanRecordStat?.allTrouble}</div>
                                </div>

                                <div className='hole-border-right'>
                                    <div className='overview-hole-desc'>解决问题</div>
                                    <div className='overview-hole-num'>{scanRecordStat?.allTrouble}</div>
                                </div>
                            </div>
                        </div>

                        <div className='overview-statistics'>
                            {

                                metricStat?
                                    <div  className='metricStat-border-style'>
                                        <div className='overview-statistics-title'>
                                            度量概况
                                        </div>
                                        <div className='overview-statistics-metricStat'>
                                            <div className='metricStat-border'>
                                                <div>代码重复率</div>
                                                <div className='metricStat-border-size'>{metricStat?.duplicated}</div>
                                            </div>
                                            <div className='metricStat-border'>
                                                <div>圈复杂度</div>
                                                <div className='metricStat-border-size'>{metricStat?.complexityNum}</div>
                                            </div>
                                            <div className='metricStat-border'>
                                                <div>非空代码行数</div>
                                                <div className='metricStat-border-size'>{metricStat?.allLine}</div>
                                            </div>
                                        </div>
                                    </div>:
                                    <div className='overview-statistics-not-date overview-no'>
                                        <EmptyText title={"没有度量数据概况"}/>
                                    </div>
                            }
                        </div>

                        <div className='overview-statistics'>
                            <div className='overview-statistics-border'>
                                <ProblemLevel scanRecordStat={scanRecordStat}/>
                            </div>

                            <div className='overview-statistics-border'>
                                <ProblemType scanRecordStat={scanRecordStat}/>
                            </div>
                        </div>
                        {
                            scanCoverStat ?
                                <div className='overview-statistics'>
                                    <div className='overview-statistics-border'>
                                        <CoverNum cover={scanCoverStat}/>
                                    </div>

                                    <div className='overview-statistics-border'>
                                        <CoverPercent cover={scanCoverStat}/>
                                    </div>
                                </div>:
                                <div>
                                    <div className='overview-statistics-title'>
                                        覆盖率
                                    </div>
                                    <div className='overview-statistics-not-date overview-no'>
                                        <EmptyText title={"没有覆盖率"}/>
                                    </div>
                                </div>
                        }
                    </>:
                    <div className='overview-no'><EmptyText title={"没有数据"}/></div>
            }
        </div>
    )
}
export default Overview
