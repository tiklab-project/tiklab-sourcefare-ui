import React,{useEffect,useState,Fragment} from 'react';
import {Tooltip, Col, Select} from 'antd';
import homePageStore from "../store/homePageStore"
import Guide from '../../common/guide/Guide';
import EmptyText from "../../common/emptyText/EmptyText";
import Listicon from "../../common/project/Listicon";
import {SpinLoading} from "../../common/loading/Loading";
import './HomePage.scss';

import statisticsStore from "../store/StatisticsStore";
import {withRouter} from "react-router";
import {inject, observer} from "mobx-react";
import SurveyStore from "../../project/survey/store/SurveyStore";
import DyncmicTimeAxis from "../../project/survey/components/DyncmicTimeAxis";
import ScanPlayExec from "../../common/statistics/ScanPlayExec";
import ScanPlayExecTime from "../../common/statistics/ScanPlayExecTime";
import ProjectExec from "../../common/statistics/ProjectExec";
import ProjectExecTime from "../../common/statistics/ProjectExecTime";
/**
 * 首页
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const HomePage = props =>{
    const {projectStore}=props

    const {findRecordOpenList,recordOpenList} = homePageStore
    const {findLogPage,logList} = SurveyStore

    const {createRecordOpen}=projectStore

    const {findProjectStat} = statisticsStore

    // 最近打开的加载状态
    const [newlyLoading,setNewlyLoading] = useState(true)

    const [innerWidth,setInnerWidth]=useState(window.innerWidth)

    const [projectStat,setProjectStat]=useState()


    useEffect(async ()=>{
        // 获取最近打开的仓库
        findRecordOpenList().then(()=>setNewlyLoading(false))

        findLogPage({  currentPage: 1 })

        findProjectStat().then(res=>{
            res.code===0&&setProjectStat(res.data)
        })
    },[])




    //实时获取浏览器宽度
    window.onresize = function() {
        let windowWidth = window.innerWidth;
        setInnerWidth(windowWidth)
        console.log(windowWidth);
    };


    //跳转项目
    const goDetails = (value) => {
        //创建打开记录
        createRecordOpen(value.id)
        props.history.push(`/project/${value.id}/report`)
    }



    const openBorder = (item) => {
        return(
            <Fragment>
                <div className='houseRecent-border-flex'>
                    <Listicon text={item?.project?.name}
                              colors={item?.project.color}
                              type={"project"}
                    />
                    <div className='houseRecent-border-text' >
                        {/*{filedState(item?.repository?.name)}*/}
                        {item?.project?.name}
                    </div>
                </div>
                <div className='houseRecent-border-flex houseRecent-border-text-top'>
                    <div className='houseRecent-border-desc'>
                        <span className='title-color'>报告</span>
                        <span className='desc-text'>{item?.execNum}</span>
                    </div>
                    <div className='houseRecent-border-desc'>
                        <span className='title-color'>成员</span>
                        <span className='desc-text'>{item?.memberNum}</span>
                    </div>
                </div>
            </Fragment>
        )
    }




    return(
        <div className='homePage sourcewair-page-width drop-down'>
            <Col sm={{ span: "24" }}
                 md={{ span: "24" }}
                 lg={{ span: "24" }}
                 xl={{ span: "20", offset: "2" }}
                 xxl={{ span: "18", offset: "3" }}
            >
                <div className='homePage-content'>
                    <div className='houseRecent'>
                        <div className='houseRecent-title'>
                            <Guide title={'常用项目'}/>
                        </div>
                            {
                                newlyLoading ?
                                    <SpinLoading type='table'/>
                                    :
                                    recordOpenList && recordOpenList.length > 0 ?
                                        <div className="houseRecent-repository">
                                            {
                                                recordOpenList.map((item, key) => {
                                                    return (
                                                        (innerWidth >= 1700 && key < 5) &&
                                                        <div key={key}
                                                             className='houseRecent-border houseRecent-border-width-20'
                                                             onClick={() => goDetails(item.project)}>
                                                            {openBorder(item)}
                                                        </div> ||
                                                        (innerWidth < 1700 && key < 4) &&
                                                        <div key={key}
                                                             className='houseRecent-border houseRecent-border-width-25'
                                                             onClick={() => goDetails(item.project)}>
                                                            {openBorder(item)}
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        :
                                        <div className='no-data'>
                                            <EmptyText/>
                                        </div>
                            }
                    </div>
                     <div className='houseRecent'>
                         <div className='houseRecent-title'>
                             <Guide title={'项目扫描统计'}/>
                         </div>
                         <div className='home-page-statistics'>
                             <div className='home-page-tread'>
                                 <div className='home-page-tread-title'>
                                     <div>项目执行统计</div>
                                     <div className='survey-style-title-desc'>(只统计前4个项目)</div>
                                 </div>
                                 <ProjectExec  projectStat={projectStat}/>
                             </div>
                             <div className='home-page-tread'>
                                 <div className='home-page-tread-title'>
                                     <div>时间执行统计</div>
                                     <div className='survey-style-title-desc'>(一周内每天执行的次数统计)</div>
                                 </div>
                                 <ProjectExecTime projectStat={projectStat}/>
                             </div>
                         </div>
                     </div>
                    <div className='houseRecent'>
                        <DyncmicTimeAxis logList={logList}/>
                    </div>

                </div>
            </Col>
        </div>
    )
}

export default withRouter(inject('projectStore')(observer(HomePage)))
