/**
 * @name: Scheme
 * @author: limingliang
 * @date: 2024-09-14 14:30
 * @description：扫描方案
 * @update: 2024-09-14 14:30
 */
import React,{useState,useEffect,Fragment} from 'react';
import "./Scheme.scss"
import {Col, Spin, Menu, Table, Modal, Tooltip, Layout} from "antd";
import {EllipsisOutlined, ExclamationCircleOutlined, StopOutlined} from "@ant-design/icons";
import ScanSchemeStore from "../store/ScanSchemeStore";
const { confirm } = Modal;
import {inject, observer} from "mobx-react";
import {getVersionInfo} from "tiklab-core-ui";
import SchemeLeftTree from "./SchemeLeftTree";
import {Content} from "antd/es/layout/layout";
import ScanSchemeRuleStore from "../store/ScanSchemeRuleStore";
import SchemeRuleList from "./SchemeRuleList";
import Tabs from "../../../../common/tabs/Tabs";

import SchemePlay from "./SchemePlay";
import {withRouter} from "react-router";
import Images from "../../../../common/image/Images";
const Scheme = (props) => {
    const {projectStore}=props

    const {findScanSchemeRuleSetList,deleteScanSchemeRuleSet}=ScanSchemeRuleStore
    const {findProjectPage,findProjects}=projectStore

    const [load,setLoad]=useState(false)
    //选择的扫描方案
    const [scanScheme,setScanScheme]=useState(null)
    //扫描方案的规则集
    const [schemeRuleSetList,setSchemeRuleSetList]=useState([])
    const [contentType,setContentType]=useState("ruleSet")

    //扫描方案的规则集
    const [ruleSet,setRuleSet]=useState(null)

    //tab类型
    const [tab,setTab]=useState("rule")

    useEffect(()=>{
        if (scanScheme){
            findRuleSet()
        }


    },[scanScheme])

    //查询方案规则集
    const findRuleSet = () => {
        setLoad(true)
        findScanSchemeRuleSetList({scanSchemeId:scanScheme.id}).then(res=>{
            setLoad(false)
           if(res.code===0){
               setSchemeRuleSetList(res.data)
           }
        })
    }

    //点击扫描方案
    const clickScheme = (value) => {
        if (value.property===1&&getVersionInfo().expired){
            return
        }
       setContentType("rule")
        setRuleSet(value)
    }

    //切换tab
    const clickTab = (value) => {
      setTab(value.id)
    }


    return(
        <Layout className='scheme'>
            <SchemeLeftTree {...props}
                            scanScheme={scanScheme}
                            setScanScheme={setScanScheme}
                            setContentType={setContentType}
                            findProjectList={findProjects}
                            setTab={setTab}
            />
            <Content className='scheme-page scheme-page-width'>
                <Col sm={{ span: "24" }}
                     md={{ span: "24" }}
                     lg={{ span: "24" }}
                     xl={{ span: "22", offset: "1" }}
                     xxl={{ span: "20", offset: "2" }}
                >

                    {
                        contentType==="ruleSet"?
                            <div>
                                <div  className='scheme-page-title'>{scanScheme?.schemeName}</div>
                                <div className='scheme-page-tab'>
                                    <Tabs
                                        type={tab}
                                        tabLis={[
                                            {id:"rule", title:'检测规则'},
                                            {id:"task", title:'关联任务'},
                                        ]}
                                        onClick={clickTab}
                                    />
                                </div>

                                <div className='scheme-page-content'>
                                    {
                                        tab==='rule'?
                                            <Spin spinning={load}>
                                                <div className='scheme-page-content-table' >
                                                    {schemeRuleSetList.length&&schemeRuleSetList.map(item=>{
                                                        return(
                                                            <div key={item.id}
                                                                 className={`scheme-page-content-single
                                                                 ${(item.property===1&&getVersionInfo().expired)&&" content-single-no"}`}
                                                                 onClick={()=>clickScheme(item)}
                                                            >
                                                                {
                                                                    (item.property===1&&getVersionInfo().expired)&&
                                                                    <div className='scheme-page-content-property'>
                                                                        <Images type={"enter"} width={30} height={30} />
                                                                    </div>

                                                                   /* <div className='scheme-page-content-property'>企业版</div>*/
                                                               }

                                                                <div className='content-single-title'>
                                                                    {item?.scanRuleSet.ruleSetName}
                                                                </div>
                                                                <div className='content-single-desc'>
                                                                    {item?.scanRuleSet.describe}
                                                                </div>
                                                                <div className={`${(item.property===1&&getVersionInfo().expired)?"":"content-single-num"}`}>
                                                                    <div>数量：{item?.ruleNum}</div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </Spin>:
                                            <SchemePlay {...props}
                                                        scanSchemeId={scanScheme?.id}
                                                        findProjectPage={findProjectPage}
                                            />
                                    }
                                </div>
                            </div>:
                            <SchemeRuleList {...props}
                                            ruleSet={ruleSet}
                                            setContentType={setContentType}
                                            contentType={contentType}
                            />

                    }

                </Col>
            </Content>
        </Layout>
    )
}
export default withRouter(inject('projectStore')(observer(Scheme)))
