/**
 * @name: ScanDoor
 * @author: limingliang
 * @date: 2025-07-18 14:30
 * @description：扫描门禁
 * @update: 2025-07-18 14:30
 */
import React, {useState, useEffect, Fragment, useRef} from "react";
import {Col, Form, Input, Select, Switch, Table, Tooltip} from 'antd';
import "./ScanDoor.scss"
import Breadcrumb from "../../../../common/breadcrumb/Breadcrumb";
import ScanDoorStore from "../store/ScanDoorStore";
import {observer} from "mobx-react";
import {FormOutlined} from "@ant-design/icons";
const ScanDoor = (props) => {
    const {match:{params}}=props

    const {refresh,findScanDoorByProjectId,createScanDoor,updateScanDoor}=ScanDoorStore

    const [scanDoor,setScanDoor]=useState(null)
    const [isLoading,setIsLoading]=useState(false)

    //打开编辑门禁数量类型
    const [compileType,setCompileType]=useState(null)
    //输入的门禁数量
    const [doorNum,setDoorNum]=useState(null)

    const [compileState,setCompileState]=useState(false)

    useEffect(async () => {
        findScanDoorByProjectId(params.id).then(res=>{
            if (res.code===0){
                setScanDoor(res.data)
            }
        })
    }, [refresh]);

    useEffect(async () => {
        function handleClickOutside(event) {
            const classList = event.target.parentElement.parentElement.classList;
            if (classList.value!=='door-body-data-row'){
                setCompileType(null);
                closeInputCompileDoor()
            }
          /*  if (severityRef.current && !severityRef.current.contains(event.target)) {
                debugger
                setCompileType(null);
                closeInputCompileDoor()
            }*/
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(async () => {
        if (compileState){
            if (doorNum){
                switch (doorNum.type){
                    case "severity":
                        if (scanDoor.severityNum!==doorNum.value){
                            compileDoor({...scanDoor,severityNum:doorNum.value})
                        }
                        break
                    case "notice":
                        if (scanDoor.noticeNum!==doorNum.value){
                            compileDoor({...scanDoor,noticeNum:doorNum.value})
                        }
                        break
                    case "suggest":
                        if (scanDoor.suggestNum!==doorNum.value){
                            compileDoor({...scanDoor,noticeNum:doorNum.value})
                        }
                        break
                }
                setCompileState(false)
            }
            setDoorNum(null)
        }
    }, [compileState,doorNum]);


    //切换门禁
    const onChangeDoor = (value,type) => {
        let param;
        const state=value?1:0
        switch (type){
            case "severityState":
                 param={...scanDoor,severityState:state}
                 break
            case "noticeState":
                param={...scanDoor,noticeState:state}
                break
            case "suggestState":
                param={...scanDoor,suggestState:state}
                break
        }
        //编辑
        compileDoor(param)
    }

    //编辑门禁
    const compileDoor= (value) => {
        if (scanDoor.id==='default'){
            createScanDoor({...value,id:null,projectId:params.id})
        }else {
            updateScanDoor(value)
        }
    }


    //关闭input输入框后编辑
    const closeInputCompileDoor = () => {
        setCompileState(true)
    }

    //输入
    const setInputValue = (value,type) => {
        setDoorNum({type:type,value:value})
    }

    //编译数量
    const clickNum = (type) => {
        setCompileType(type)
    }
    // 处理Enter键
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setCompileType(null);
        }
    };
    return(
        <div className='sourcefare scan-door scan-door-width' >
            <Col sm={{ span: "22" }}
                 md={{ span: "22" }}
                 lg={{ span: "21" , offset: "1" }}
                 xl={{ span: "17", offset: "3" }}
                 xxl={{ span: "14", offset: "5" }}
            >
                <Breadcrumb firstItem={`扫描门禁`}/>
                <div className='scan-door-body'>
                    <div className='scan-door-body-title'>
                      <div className='body-title-nav'>门禁项目</div>
                      <div className='body-title-nav'>运算逻辑</div>
                      <div className='body-title-nav'>门禁阈值</div>
                      <div className='body-title-nav'>门禁开关</div>
                    </div>

                    <div className='scan-door-body-data'>
                        <div className='door-body-data-row'>
                            <div className='door-body-data-nav'>严重问题数量</div>
                            <div className='door-body-data-nav'>{"<="}</div>
                            <div className='door-body-data-nav'>
                                {
                                    compileType==='severity'?
                                        <Input defaultValue={scanDoor?.severityNum}
                                               style={{ width: '50%' }}
                                               onKeyDown={handleKeyDown}
                                               autoFocus
                                               onClick={(e) => e.stopPropagation()}
                                               onChange={(e) => setInputValue(e.target.value,"severity")}
                                        />:
                                        <Fragment>
                                            <div className='door-body-data-nav-num' >
                                                {scanDoor?.severityNum}
                                            </div>
                                            <div className='door-body-data-nav-cursor' onClick={()=>clickNum("severity")}>
                                                <FormOutlined />
                                            </div>
                                        </Fragment>
                                }
                            </div>
                            <div className='door-body-data-nav door-body-data-nav-cursor'>
                                <Switch defaultChecked checked={scanDoor?.severityState} checkedChildren="开启" unCheckedChildren="关闭" onChange={(e)=>onChangeDoor(e,"severityState")} />
                            </div>
                        </div>
                        <div className='door-body-data-row'>
                            <div className='door-body-data-nav'>警告问题数量</div>
                            <div className='door-body-data-nav'>{"<="}</div>
                            <div className='door-body-data-nav'>
                                {
                                    compileType==='notice'?
                                        <Input defaultValue={scanDoor?.noticeNum}
                                               style={{ width: '50%' }}
                                               onKeyDown={handleKeyDown}
                                               onChange={(e) => setInputValue(e.target.value,"notice")}
                                               autoFocus

                                        />:
                                        <Fragment>
                                            <div className='door-body-data-nav-num'>
                                                {scanDoor?.noticeNum}
                                            </div>
                                            <div className='door-body-data-nav-cursor' onClick={()=>clickNum("notice")}>
                                                <FormOutlined />
                                            </div>
                                        </Fragment>
                                }

                            </div>
                            <div className='door-body-data-nav door-body-data-nav-cursor'>
                                <Switch defaultChecked checked={scanDoor?.noticeState} checkedChildren="开启" unCheckedChildren="关闭" onChange={(e)=>onChangeDoor(e,"noticeState")} />
                            </div>
                        </div>
                        <div className='door-body-data-row'>
                            <div className='door-body-data-nav'>建议问题数量</div>
                            <div className='door-body-data-nav'>{"<="}</div>
                            <div className='door-body-data-nav'  >
                                {
                                    compileType==='suggest'?
                                        <Input defaultValue={scanDoor?.suggestNum}
                                               style={{ width: '50%' }}
                                               onKeyDown={handleKeyDown}
                                               autoFocus
                                               onChange={(e) => setInputValue(e.target.value,"suggest")}
                                        />:
                                        <Fragment>
                                            <div className='door-body-data-nav-num'>
                                                {scanDoor?.suggestNum}
                                            </div>
                                            <div className='door-body-data-nav-cursor' onClick={()=>clickNum("suggest")}>
                                                <FormOutlined />
                                            </div>
                                        </Fragment>
                                }
                            </div>
                            <div className='door-body-data-nav door-body-data-nav-cursor'>
                                <Switch defaultChecked checked={scanDoor?.suggestState} checkedChildren="开启" unCheckedChildren="关闭" onChange={(e)=>onChangeDoor(e,"suggestState")} />
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
        </div>
    )
}
export default observer(ScanDoor)
