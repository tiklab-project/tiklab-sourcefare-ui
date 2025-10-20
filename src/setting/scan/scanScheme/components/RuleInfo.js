/**
 * @name: RuleInfo
 * @author: limingliang
 * @date: 2024-19-14 14:30
 * @description：规则详情
 * @update: 2024-19-14 14:30
 */
import React,{useState,useEffect} from 'react';
import "./RuleInfo.scss"
import {LeftOutlined} from "@ant-design/icons";
const RuleInfo = (props) => {
    const {schemeRule,scanRuleSet,setDataType}=props

    return(
        <div className='rule-info'>
            <div className='rule-info-head'>
                <LeftOutlined onClick={()=>setDataType("list")} style={{color:'#0063FF',paddingRight:8}}/>
                <div className='rule-info-head-text'>{schemeRule?.scanRule.ruleName}</div>
            </div>
            <div className='rule-info-nav-style'>
                <div className='rule-info-nav-title'>问题等级</div>
                <div>{
                    schemeRule?.problemLevel===1&&<div className='text-red'>严重</div>||
                    schemeRule?.problemLevel===2&&<div className='text-yellow'>错误</div> ||
                    schemeRule?.problemLevel===3&&<div className='text-blue'>警告</div>||
                    schemeRule?.problemLevel===4&&<div className='text-green'>提示</div>
                }</div>
            </div>
           {/* <div className='rule-info-nav-style'>
                <div className='rule-info-nav-title'>类型</div>
                <div>
                    {
                    scanRuleSet?.ruleSetType==='function'&&<div>功能</div>||
                    scanRuleSet?.ruleSetType==='norm'&&<div>规范</div>||
                    scanRuleSet?.ruleSetType==='secure'&&<div>安全</div>
                    }
                </div>
            </div>*/}
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
                <div className='rule-info-nav-de'>{schemeRule?.scanRule.describe}</div>
            </div>
        </div>
    )
}
export default RuleInfo
