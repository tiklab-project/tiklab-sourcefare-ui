/**
 * @name: MetricContent
 * @author: limingliang
 * @date: 2023-11-07 14:30
 * @description：度量
 * @update: 2023-11-07 14:30
 */
import React,{useState,useEffect,useRef} from 'react';
import "./MetricContent.scss"
import ReportCover from "./ReportCover";
import ReportComplexity from "./ReportComplexity";
import RecordDuplicated from "./RecordDuplicated";
import Tabs from "../../../common/tabs/Tabs";
import {
    BarChartOutlined,
    CodeOutlined, CodepenOutlined,
    DotChartOutlined, ExceptionOutlined, FolderOutlined, PieChartOutlined, ProjectOutlined, QuestionCircleOutlined,
    RotateRightOutlined,
    SnippetsOutlined, SwitcherOutlined,
    WalletOutlined
} from "@ant-design/icons";
import {Tooltip} from "antd";
const MetricContent = (props) => {
    const {projectData,scanRecord,recordId,probNum}=props
    const [tabType,setTabType]=useState("duplicated")

    const clickType = (value) => {
        setTabType(value)
    }

    //跳转帮助
    const goData = () => {
        props.history.push(`/project/${projectData.id}/statistics`)


    }

    return(
        <div className='metric-content'>
            <div className='metric-content-tab'>
                <div className='metric-content-nav'>
                    <div className='metric-content-top-tab'>
                        <div onClick={()=>clickType("duplicated")}
                             className={`content-top-tab-nav ${tabType==='duplicated'&&" content-top-tab-nav-c"}`}
                        >
                            <div className='content-top-tab-nav-icon'>
                                <SnippetsOutlined />
                            </div>

                            <div>重复率</div>
                        </div>
                        <div onClick={()=>clickType("complexity")}
                             className={`content-top-tab-nav ${tabType==='complexity'&&" content-top-tab-nav-c"}`}
                        >
                            <div className='content-top-tab-nav-icon'>
                                <ProjectOutlined />
                            </div>

                            <div>复杂度</div>
                        </div>
                        <div onClick={()=>clickType("cover")}
                             className={`content-top-tab-nav ${tabType==='cover'&&" content-top-tab-nav-c"}`}
                        >
                            <div className='content-top-tab-nav-icon'>
                                <ExceptionOutlined />
                            </div>
                            <div>覆盖率</div>
                        </div>
                    </div>
                </div>
                <div className='metric-content-help' onClick={goData}>
                    <div className='metric-content-icon'>
                        <PieChartOutlined/>
                    </div>
                    <div>统计</div>
                </div>
            </div>
            {/*<div className='metric-content-left-tab'>
                <div onClick={()=>clickType("duplicated")}
                     className={`metric-content-left-tab-nav  ${tabType==='duplicated'&&" content-left-tab-nav-c"}`}
                     style={{marginTop:7}}
                >
                    <div className='content-left-tab-nav-icon'>
                        <SnippetsOutlined />
                    </div>
                    <div className='content-left-tab-nav-text'>
                        {"重复率"}
                    </div>

                </div>
                <div onClick={()=>clickType("complexity")}
                    className={`metric-content-left-tab-nav  ${tabType==='complexity'&&" content-left-tab-nav-c"}`}>
                    <div className='content-left-tab-nav-icon'>
                        <ProjectOutlined />
                    </div>
                    <div className='content-left-tab-nav-text'>
                        {"复杂度"}
                    </div>

                </div>
                <div onClick={()=>clickType("cover")}
                    className={`metric-content-left-tab-nav  ${tabType==='cover'&&" content-left-tab-nav-c"}`}>
                    <div className='content-left-tab-nav-icon'>
                        <ExceptionOutlined />
                    </div>
                    <div className='content-left-tab-nav-text'>
                        {"覆盖率"}
                    </div>
                </div>
            </div>*/}
            <div className='metric-content-data'>
                {
                    tabType==='duplicated'&&
                    <RecordDuplicated projectData={projectData}
                                      scanRecord={scanRecord}
                    />||
                    tabType==='complexity'&&
                    <ReportComplexity projectData={projectData}
                                      scanRecord={scanRecord}

                    />||
                    tabType==='cover'&&
                    <ReportCover recordId={recordId} />

                }
            </div>
        </div>
    )


}
export default MetricContent
