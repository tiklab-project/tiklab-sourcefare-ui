/**
 * @name: Statistics
 * @author: limingliang
 * @date: 2025-08-11 14:30
 * @description：统计
 * @update: 2025-08-11 14:30
 */
import React,{useState,useEffect,Fragment} from 'react';
import "./Statistics.scss"
import ScanLeftNav from "../../../common/scan/ScanLeftNav";
import {Col, Select} from "antd";
import Breadcrumb from "../../../common/breadcrumb/Breadcrumb";
import {observer} from "mobx-react";
import StatisticsStore from "../store/StatisticsStore";
import IssueStatistics from "./IssueStatistics";
import DupStatistics from "./DupStatistics";
import CompStatistics from "./CompStatistics";
import {PieChartOutlined} from "@ant-design/icons";
import CoverStatistics from "./CoverStatistics";

const Statistics = (props) => {
    const {match:{params}} = props;

    const [treeNav,setTreeNav]=useState("issue")
    const [type,setType]=useState()
    const {issueStat,duplicatedStat,complexityStat,coverStat}=StatisticsStore
    const [title,setTitle]=useState("问题")
    const [secondValue,setSecondValue]=useState(null)

    const addTreeNav = (value) => {
        setTreeNav(value)
        switch (value){
            case 'issue':
                setTitle("问题")
                setSecondValue(null)
                break
            case 'function':
                setTitle("问题")
                setSecondValue("功能")
                break
            case 'security':
                setTitle("问题")
                setSecondValue("安全")
                break

            case 'norm':
                setTitle("问题")
                setSecondValue("规范")
                break
            case "duplicated":
                setTitle("重复率")
                setSecondValue(null)
                break
            case "complexity":
                setTitle("复杂度")
                setSecondValue(null)
                break
            case "cover":
                setSecondValue(null)
                setTitle("覆盖率")
        }
    }

    return(
        <div className='scan-statistics'>
            <ScanLeftNav {...props}
                         treeNav={treeNav}
                         setTreeNav={addTreeNav}
                         setType={setType}

            />
            <div className='sourcefare  scan-issue-width'>
                <Col sm={{ span: "24" }}
                     md={{ span: "24" }}
                     lg={{ span: "22",offset: "1" }}
                     xl={{ span: "22", offset: "1" }}
                     xxl={{ span: "20", offset: "2" }}
                >
                    <Breadcrumb firstItem={title}  secondItem={secondValue}/>
                    {
                        (treeNav==="issue"||treeNav==="security"||treeNav==="norm"||treeNav==="function")&&
                        <IssueStatistics projectId={params.id}
                                         issueStat={issueStat}
                                         treeNav={treeNav}
                        />||
                        treeNav==="duplicated"&&
                        <DupStatistics projectId={params.id}
                                       duplicatedStat={duplicatedStat}
                        />||
                        treeNav==="complexity"&&
                        <CompStatistics projectId={params.id}
                                   complexityStat={complexityStat}
                        />||
                        treeNav==='cover'&&
                        <CoverStatistics  projectId={params.id}
                                          coverStat={coverStat}

                        />

                    }
                </Col>
            </div>
        </div>
    )
}
export default observer(Statistics)
