/**
 * @name: ReportContent
 * @author: limingliang
 * @date: 2025-07-31 14:30
 * @description：报告内容
 * @update: 2025-07-31 14:30
 */
import React,{useState,useEffect,Fragment} from 'react';
import {Col, Layout, Tooltip} from 'antd';
import "./ReportContent.scss"
import ScanReqList from "./IssueList";
import {observer} from "mobx-react";
import ReportCover from "./ReportCover";
import ReportComplexity from "./ReportComplexity";
import RecordDuplicated from "./RecordDuplicated";
import ScanLeftNav from "../../../common/scan/ScanLeftNav";
const ReportContent = (props) => {
    const {projectData,scanRecord,recordId,probNum}=props
    const [treeNav,setTreeNav]=useState("issue")
    //类型
    const [type,setType]=useState(null)



    return(
        <div className='scan-report-content'>
            <ScanLeftNav {...props}
                         setType={setType}
                         treeNav={treeNav}
                         setTreeNav={setTreeNav}
            />
            <div className='content-page-width '>
                <Col sm={{ span: "24" }}
                     md={{ span: "24" }}
                     lg={{ span: "22",offset: "1" }}
                     xl={{ span: "22", offset: "1" }}
                     xxl={{ span: "20", offset: "2" }}
                >
                    {
                        (treeNav==='issue'||treeNav==='security'||treeNav==='reliability'||treeNav==='maintain')&&
                            <ScanReqList projectId={projectData?.id}
                                         scanRecord={scanRecord}
                                         type={type}
                            /> ||
                        treeNav==='cover'&&
                            <ReportCover recordId={recordId} />||
                        treeNav==='complexity'&&
                            <ReportComplexity projectData={projectData}
                                              scanRecord={scanRecord}

                            />||
                        treeNav==='duplicated'&&
                        <RecordDuplicated projectData={projectData}
                                          scanRecord={scanRecord}
                        />
                    }
                </Col>
            </div>
        </div>
    )
}
export default observer(ReportContent)
