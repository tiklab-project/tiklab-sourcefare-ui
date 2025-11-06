/**
 * @name: ScanReqDrawer
 * @author: limingliang
 * @date: 2023-11-07 14:30
 * @description：扫描问题右侧抽屉弹窗
 * @update: 2023-11-07 14:30
 */
import React,{useState,useEffect} from 'react';
import {Drawer, message, Space, Tooltip} from 'antd'
import {CloseOutlined} from "@ant-design/icons";
import "./ScanReqDrawer.scss"
import Highlighter from "../../../common/editor/Highlight";
import CodeStore from "../store/CodeStore";
import {observer} from "mobx-react";
import ScanReqPop from "./ScanReqPop";
import InstanceStore from "../store/InstanceStore";
import {getUser} from "tiklab-core-ui";
import Breadcrumb from "../../../common/breadcrumb/Breadcrumb";
import {PrivilegeProjectButton} from 'tiklab-privilege-ui';
const ScanReqDrawer = (props) => {
    const {visible,setVisible,reqDetails,type,projectId}=props
    const {findCodeData}=CodeStore
    const {updateScanRecordInstance,createRecordInstanceCond,findScanRecordInstance}=InstanceStore
    const [fileName,setFileName]=useState('')
    const [reqData,setReqData]=useState(null)

    const [dataList,setDataList]=useState(null)
    const [lines, setLines] = useState([]);

    const [popVisible,setPopVisible]=useState(false)


    useEffect(async () => {
        if (visible){
            const fileName=reqDetails.filePath.substring(reqDetails.filePath.lastIndexOf("/")+1);
            setFileName(fileName)
            findCodeData(projectId+"/"+reqDetails.filePath).then(res=>{
                if (res.code===0){
                    const lines = res.data.split("\n")
                    setLines(lines)
                    setDataList(res.data)
                }
            })

            setReqData(reqDetails)
        }
    }, [visible]);

    //更新状态
    const updateState = () => {
        updateScanRecordInstance({...reqDetails,state:0}).then(res=>{
            if (res.code===0){

                createRecordInstanceCond({
                    scanRecordId:reqDetails.scanRecordId,
                    projectId:reqDetails.project.id,
                    recordInstanceId:reqDetails.id,
                    data:"重新打开了问题",
                    user:{
                        id:getUser().userId
                    }
                })
                findRecordInstance()
                message.success("打开成功")
            }
        })
    }

    //查询示例
    const findRecordInstance = () => {
        findScanRecordInstance(reqDetails.id).then(res=>{
            setReqData(res.data)
        })
    }


    //取消弹窗
    const cancelDrawer = () => {
        setVisible(false)
    }

    //打开动态
    const openCond = () => {
        setPopVisible(true)
    }

    return(
        <Drawer
          /*  title={fileName}*/
            placement='right'
            closable={false}
            width={"70%"}
            /*contentWrapperStyle={{top:48,height:"calc(100% - 48px)"}}*/
            className='req-drawer-style '
            onClose={cancelDrawer}
            visible={visible}
            extra={
                <CloseOutlined style={{cursor:'pointer'}} onClick={cancelDrawer} />
            }
        >
            <div className='req-drawer'>
                <div className='req-drawer-head'>
                    <div className='req-drawer-head-style'>
                        <div>
                            <Breadcrumb firstItem={fileName}/>
                            <div className='scan-drawer-hades-desc'>
                                <div className='scan-drawer-hades-desc-nav'>
                                    <div className='scan-drawer-hades-desc-title'>问题名称</div>
                                    <div >{reqDetails.ruleName}</div>
                                </div>
                                <div className='scan-drawer-hades-desc-nav'>
                                    <div className='scan-drawer-hades-desc-title'>问题类型</div>
                                    <div>{reqDetails.ruleType==="function"&&<div>功能</div>||
                                        reqDetails.ruleType==="norm"&&<div >规范</div> ||
                                        reqDetails.ruleType==="security"&&<div>安全</div>}
                                    </div>
                                </div>

                                <div className='scan-drawer-hades-desc-nav'>
                                    <div className='scan-drawer-hades-desc-title'>问题等级</div>
                                    <div>{reqDetails.problemLevel===1&&<div className='scan-drawer-hole-red'>严重</div>||
                                        reqDetails.problemLevel===2&&<div className='scan-drawer-hole-dired'>警告</div>||
                                        reqDetails.problemLevel===3&&<div className='scan-drawer-hole-blue'>建议</div>
                                    }
                                    </div>
                                </div>
                            </div>
                        </div>

                        {
                            type!=='issue'&&
                                <>
                                    {reqData?.state === 0 ?
                                        <PrivilegeProjectButton code={"scan_issue_update"} domainId={projectId}>
                                            <div className="reqDrawer-bottom-text" onClick={openCond}>忽略问题</div>
                                        </PrivilegeProjectButton>
                                        :
                                        <PrivilegeProjectButton code={"scan_issue_update"} domainId={projectId}>
                                            <div className="reqDrawer-bottom-text" onClick={updateState}>重新打开</div>
                                        </PrivilegeProjectButton>
                                    }

                                </>
                        }
                    </div>


                </div>
                <div className='req-drawer-body'>
                    <div className='req-drawer-body-tabs'>
                       {/* <div>问题状态</div>*/}
                        <Highlighter language={"javascript"}
                                     code={dataList}
                                     lines={lines}
                                     reqDetails={reqData}
                                     visible={visible}
                        />
                    </div>
                </div>

                {/*<div className="req-drawer-bottom">
                    {
                        reqData?.state===0?
                            <div className="reqDrawer-bottom-text" onClick={openCond}>忽略问题</div>:
                            <div className="reqDrawer-bottom-text" onClick={updateState}>重新打开</div>
                    }
                </div>*/}
            </div>

            <ScanReqPop
                visible={popVisible}
                setVisible={setPopVisible}
                reqDetails={reqData}
                updateScanRecordInstance={updateScanRecordInstance}
                createRecordInstanceCond={createRecordInstanceCond}
                findRecordInstance={findRecordInstance}
            />
        </Drawer>
    )
}

export  default observer(ScanReqDrawer)
