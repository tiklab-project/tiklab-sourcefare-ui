/**
 * @name: SchemeDetails
 * @author: limingliang
 * @date: 2024-09-14 14:30
 * @description：扫描方案详情
 * @update: 2024-09-14 14:30
 */
import React,{useState,useEffect,Fragment} from 'react';
import {inject, observer} from "mobx-react";
import "./SchemeDetails.scss"
import {Col, Dropdown, Table, Tooltip} from "antd";
import scanRuleSetStore from "../../scanRule/store/ScanRuleSetStore";
import ScanSchemeStore from "../store/ScanSchemeStore";
import ScanSchemeRuleStore from "../store/ScanSchemeRuleStore";
import {EllipsisOutlined, StopOutlined} from "@ant-design/icons";
import SchemeDetailsOption from "./SchemeDetailsOption";
import ScanSchemePlay from "./ScanSchemePlay";
import {PrivilegeButton} from "tiklab-privilege-ui";
import SchemeDetailsDrawer from "./SchemeDetailsDrawer";
import DeleteExec from "../../../../common/delete/DeleteExec";
import Breadcrumb from "../../../../common/breadcrumb/Breadcrumb";
import Btn from "../../../../common/btn/Btn";
import {SpinLoading} from "../../../../common/loading/Loading";
import EmptyText from "../../../../common/emptyText/EmptyText";
import {withRouter} from "react-router";
const SchemeDetails = (props) => {
    const {match:{params},projectStore}=props
    const {findScanScheme,createScanSchemeRuleSet,fresh}=ScanSchemeStore
    const {findScanRuleSetNotScheme}=scanRuleSetStore
    const {findScanSchemeRuleSetList,deleteScanSchemeRuleSet}=ScanSchemeRuleStore
    const {findProjectPage}=projectStore

  const [load,setLoad]=useState(false)
    const [scheme,setScheme]=useState('')   //扫描方案
    const [scanSchemeRuleSetList,setScanSchemeRuleSetList]=useState([])

    const [notSchemeRuleSet,setNotSchemeRuleSet]=useState([])  //没有添加到扫描
    const [optionVisible,setOptionVisible]=useState(false)  //添加扫描规则集弹窗状态
    const [tableType,setTableType]=useState("ruleSet")

    const [drawerVisible,setDrawerVisible]=useState(false)  //扫描规则集的规则抽屉
    const [scanSchemeRuleSet,setScanSchemeRuleSet]=useState('')

    const columns = [
        {
            title: '规则集名称',
            dataIndex: ['scanRuleSet','ruleSetName'],
            key: 'schemeName',
            width:'20%',
            ellipsis:true,
            render:(text,record)=><div className='details-table-name' onClick={()=>openRuleDetails(record)}>{record.scanRuleSet.ruleSetName}</div>
        },
        {
            title: '规则数量',
            dataIndex: 'ruleNum',
            key: 'ruleNum',
            width:'20%',
            ellipsis:true,
        },
        {
            title: '描述',
            dataIndex: ['scanRuleSet','describe'],
            key: 'describe',
            width:'55%',
            ellipsis:true,
            render:(text,record)=>  <Tooltip placement="top" title={record.scanRuleSet?.describe} >
                {record.scanRuleSet?.describe}
            </Tooltip>
        },
        {
            title:'操作',
            dataIndex: 'action',
            width:'5%',
            key: 'action',
            render:(text,record)=>(
                <div>
                    {
                        scheme?.category===2?
                        /*    <PrivilegeButton  code={"gittok_scan_scheme"} key={'gittok_scan_scheme'} >

                            </PrivilegeButton> :*/
                            <DeleteExec value={record} deleteData={deleteRuleSet} title={"确认移除"}/>:
                            <StopOutlined disabled className='details-table-icon-no'/>
                    }
                </div>
            )
        }
    ]


    useEffect(()=>{
        findScanScheme(params.id).then(res=>{
            if (res.code==0){
                setScheme(res.data)
                getScanRuleSetBySchemeId(res.data)
            }
        })
    },[fresh])


    //通过扫描方案查询扫描
    const getScanRuleSetBySchemeId = (value) => {
        setLoad(true)
        findScanSchemeRuleSetList({scanSchemeId:params.id}).then(res=>{
            setLoad(false)
            if (res.code===0){
                setScanSchemeRuleSetList(res.data)
            }
        })

        /*if (value.scanWay==='sonar'){
            findScanSchemeSonarList({scanSchemeId:params.id}).then(res=>{
                setLoad(false)
                if (res.code===0){
                    setScanSonar(res.data)
                }
            })
        }*/
    }

    //移除关联的规则集
    const deleteRuleSet = (value) => {
        deleteScanSchemeRuleSet(value).then(res=>{
            res.code===0&& getScanRuleSetBySchemeId(scheme)

        })
    }

    //切换tab
    const cuteTab = (value) => {
      setTableType(value)
        if (value==='play'){

        }
    }


    //打开添加扫描方案集的抽屉
    const OpenDrawer = () => {
        setOptionVisible(true)
        findScanRuleSetNotScheme(params.id).then(res=>{
            setNotSchemeRuleSet(res.data)
        })
    }

    //打开规则集的详情
    const openRuleDetails = (value) => {
        setDrawerVisible(true)
        setScanSchemeRuleSet(value)
    }

    const goBack = () => {
        props.history.go(-1)
    }
    return(
        <div className='sourcefare drop-down  sourcewair-page-width scheme-details'>
            <Col sm={{ span: "24" }}
                 md={{ span: "24" }}
                 lg={{ span: "24" }}
                 xl={{ span: "22", offset: "1" }}
                 xxl={{ span: "18", offset: "3" }}
            >
                <Breadcrumb firstItem={scheme?.schemeName} goBack={goBack}/>
                <div className='scheme-details-up'>
                    <div className='scheme-details-desc'>
                        <span>扫描语言：{scheme?.language}</span>
                        <span>创建时间：{scheme?.createTime}</span>
                    </div>
                    {
                        ( scheme?.category===2&&scheme?.scanWay==='rule')&&
                            <Btn
                                type={'primary'}
                                title={'添加规则'}
                                onClick={()=> OpenDrawer(true)}
                            />
                    }

                </div>


                <div className='scheme-details-tab'>
                    <div className={`${tableType==='ruleSet'&& ' choose-tab-nav '} scheme-details-tab-nav`}  onClick={()=>cuteTab("ruleSet")}>扫描规则</div>
                    <div  className={`${tableType==='play'&& ' choose-tab-nav '} scheme-details-tab-nav`}  onClick={()=>cuteTab("play")}>关联计划</div>
                  {/*  {
                        scanScheme?.scanWay!=='rule'&&
                        <div className={`${tableType==='setting'&& ' choose-tab-nav '}  scanScheme-details-tab-nav`} onClick={()=>cuteTab("setting")}>设置</div>
                    }*/}
                </div>
                <div className='scheme-details-table'>
                    {
                        tableType==="ruleSet"&&
                        <Table
                            bordered={false}
                            columns={columns}
                            dataSource={scanSchemeRuleSetList}
                            rowKey={record=>record.id}
                            pagination={false}
                            locale={{emptyText: load ?
                                    <SpinLoading type="table"/>: <EmptyText title={"暂无扫描规则"}/>}}
                        />||
                        tableType==="play"&&
                        <ScanSchemePlay {...props} scanSchemeId={scheme.id}   findProjectPage={findProjectPage}/>
                    }
                </div>
            </Col>

            <SchemeDetailsOption {...props} visible={optionVisible}
                                 setVisible={setOptionVisible}
                                 scanScheme={scheme}
                                 notSchemeRuleSet={notSchemeRuleSet}
                                 createScanSchemeRuleSet={createScanSchemeRuleSet}
            />

            <SchemeDetailsDrawer {...props} visible={drawerVisible}
                                 setVisible={setDrawerVisible}
                                 schemeRuleSet={scanSchemeRuleSet}

            />
        </div>
    )
}
export default withRouter(inject('projectStore')(observer(SchemeDetails)))
