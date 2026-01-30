/**
 * @name: SchemeRuleList
 * @author: limingliang
 * @date: 2025-11-25 14:30
 * @description：扫描方案规则的详情
 * @update: 2025-11-25 14:30
 */
import React,{useState,useEffect,Fragment} from 'react';
import {Col, Drawer, Popconfirm, Table, Tooltip} from "antd";
import {CloseOutlined, LeftOutlined} from "@ant-design/icons";
import "./SchemeRuleDrawer.scss"
const SchemeRuleDrawer = (props) => {
    const {visible,setVisible,scanRuleSet,schemeRule}=props


    //取消弹窗
    const cancelDrawer = () => {
        setVisible(false)
    }

    return(
        <Drawer
            title={schemeRule?.scanRule.ruleName}
            placement='right'
            closable={false}
            width={"60%"}
            onClose={cancelDrawer}
            destroyOnClose={true}
            contentWrapperStyle={{height:"100%"}}
            bodyStyle={{overflow:"auto"}}
            visible={visible}
            extra={
                <CloseOutlined style={{cursor:'pointer'}} onClick={cancelDrawer} />
            }
        >
            <div className='scheme-details-drawer'>
                <div className='rule-info'>
                    <div className='rule-info-nav-style'>
                        <div className='rule-info-nav-title'>问题等级</div>
                        <div>{
                            schemeRule?.problemLevel===1&&<div className='text-red'>严重</div>||
                            schemeRule?.problemLevel===2&&<div className='text-yellow'>错误</div> ||
                            schemeRule?.problemLevel===3&&<div className='text-blue'>警告</div>||
                            schemeRule?.problemLevel===4&&<div className='text-green'>提示</div>
                        }</div>
                    </div>
                     <div className='rule-info-nav-style'>
                        <div className='rule-info-nav-title'>类型</div>
                        <div>
                            {
                             schemeRule?.scanRule.ruleType==='function'&&<div>功能</div>||
                             schemeRule?.scanRule.ruleType==='norm'&&<div>规范</div>||
                             schemeRule?.scanRule.ruleType==='security'&&<div>安全</div>
                            }
                        </div>
                    </div>
                    <div className='rule-info-nav-style'>
                        <div className='rule-info-nav-title'>语言</div>
                        <div className='rule-info-nav-de'>{scanRuleSet?.language}</div>
                    </div>
                    <div className='rule-info-nav-style'>
                        <div className='rule-info-nav-title'>检测工具</div>
                        <div className='rule-info-nav-de'>{schemeRule?.scanRule.scanTool}</div>
                    </div>
                    <div className='rule-info-nav-style'>
                        <div className='rule-info-nav-title'>概述</div>
                        <div className='rule-info-nav-de'>{schemeRule?.scanRule.ruleOverview}</div>
                    </div>
                    <div className='rule-info-nav-style'>
                        <div  className='rule-info-nav-title'>说明</div>
                        <div className='rule-info-nav-de'>
                            {(schemeRule?.scanRule.describe)?
                                schemeRule?.scanRule.describe:
                                schemeRule?.scanRule.ruleOverview
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    )

}
export default SchemeRuleDrawer
