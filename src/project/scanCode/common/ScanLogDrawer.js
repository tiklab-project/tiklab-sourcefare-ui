/**
 * @name: ScanLogDrawer
 * @author: limingliang
 * @date: 2023-12-15 14:30
 * @description：扫描日志的抽屉
 * @update: 2023-12-15 14:30
 */
import React, {useState, useEffect, Fragment,useRef} from 'react';
import {Drawer, Empty, Space, Tooltip} from 'antd'
import "./ScanLogDrawer.scss"
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    CloseOutlined,
    LoadingOutlined,
    MinusCircleOutlined
} from "@ant-design/icons";
import {runStatusText} from "./ScanLogCommon";
import {Btn} from "../../../ui";
import Breadcrumb from "../../../common/breadcrumb/Breadcrumb";
import fail from "../../../assets/images/img/fail.png";
import success from "../../../assets/images/img/success.png";
import {inject, observer} from "mobx-react";
const ScanLogDrawer = (props) => {
    const {visible,setVisible,scanRecord,logList,openType}=props
    const scrollRef = useRef();
    // 日志滚动条
    const [isActiveSlide,setIsActiveSlide] = useState(true);

    //日志id
    const [id,setId] = useState(null);

    const [logs,setLogs]=useState([])

    useEffect(async () => {


        if (logList.length){
            setId(logList[0].id)
        }


    }, [logList]);


    /**
     * 鼠标滚轮滑动事件
     */
    const onWheel = () => {
        if(!isActiveSlide) return
        setIsActiveSlide(false)
    }
    let startScrollTop  = 0;
    /**
     * 鼠标左键事件获取内容区域初始滚动位置
     * @param e
     */
    const handleMouseDown = e =>{
        if(e.button===0){
            if(!isActiveSlide) return
            startScrollTop =  scrollRef.current.scrollTop;
        }
    }

    /**
     * 结束滚动位置
     * @param e
     */
    const handleMouseUp = e => {
        if(e.button===0){
            if(!isActiveSlide) return
            const endScrollTop = scrollRef.current.scrollTop;
            if(startScrollTop !== endScrollTop) {
                setIsActiveSlide(false)
            }
        }
    }
    /**
     * 锚点跳转
     */
    const changeAnchor = (anchorId) =>{
        setId(anchorId)
        setIsActiveSlide(false)
        const anchorElement = document.getElementById(anchorId)
        if (anchorElement) {
            scrollRef.current.scrollTop = anchorElement.offsetTop - 130
        }
    }


    //日志
 /*   const renderPressLog = (item) => {
        const dataImport=document.getElementById("data-import")
        if(dataImport && isActiveSlide){
            dataImport.scrollTop = dataImport.scrollHeight
        }
        return    item&&item.execLog || '暂无日志'
    }*/

    const renderPressLog = () => {
        if(scrollRef.current && isActiveSlide){
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
        return (
            <div>
                {
                    logList.length&&logList.map(item=>{
                        return <div key={item.id} id={item.id} className='bottom-log-item'>
                            {item.execLog}
                        </div>
                    })
                }
            </div>
        )
    }

    return(
        <Drawer
            width={"80%"}
            visible={visible}
            placement="right"
            closable={false}
            destroyOnClose={true}
            onClose={()=>setVisible(false)}
          /*  contentWrapperStyle={{top:48,height:"calc(100% - 48px)"}}*/
            bodyStyle={{padding:0,overflow:"hidden"}}
        >
          <div className='scan-log'>
              <div className='scan-log-bread'>
                  <div className='scan-log-bread-nav'>
                      <Breadcrumb firstItem={`#${scanRecord?.id}`} />
                      <Btn
                          title={<CloseOutlined style={{fontSize:16}}/>}
                          type="text"
                          onClick={()=>setVisible(false)}
                      />
                  </div>

                  <div className="bread-center">
                      <div className="bread-center-item">
                          <span className='bread-center-name'>开始时间</span>
                          <span className='bread-center-desc'>{scanRecord?.createTime }</span>
                      </div>
                      <div className="bread-center-item">
                          <span className='bread-center-name'>运行状态</span>
                          <span className={"bread-center-desc"}>
                              {
                                  scanRecord?.issueResult==='run'?
                                      <div className='bread-center-run'>
                                          <span>执行中</span>
                                      </div>:
                                      (scanRecord?.issueResult==='execFail'|| scanRecord?.comResult==='execFail'||
                                          scanRecord?.dupResult==='execFail'||   scanRecord?.coverResult==='execFail')?
                                          <div className=' bread-center-fail'>

                                              <span>失败</span>
                                          </div>:
                                          <div className=' bread-center-success'>
                                              <span>成功</span>
                                          </div>
                              }

                          </span>
                      </div>
                      <div className="bread-center-item">
                          <span className='bread-center-name'>运行时长</span>

                          <span className='bread-center-desc'>{scanRecord?.scanTime}</span>
                      </div>
                  </div>
              </div>
              <div className="scan-log-bottom">
                  {
                      logList.length?
                          <Fragment>
                              <div className='scan-log-left'>
                                  {
                                      logList.length&&logList.map(item=>{
                                          return(
                                              <div key={item.id} className={`scan-log-left-li ${item.id===id&&" opt-lft-li"}`}
                                                   onClick={()=>changeAnchor(item.id)}
                                              >
                                                  <div className='left-li-title'>{item.title}</div>
                                                  {
                                                      item.state===0&&
                                                      <div className='left-li-state left-li-state-fail'>
                                                          <CloseCircleOutlined />
                                                      </div>||
                                                      item.state===1&&
                                                      <div className='left-li-state left-li-state-success'>
                                                          <CheckCircleOutlined />
                                                      </div>||
                                                      item.state===2&&
                                                      <div className='left-li-state'>
                                                          <LoadingOutlined />
                                                      </div>||
                                                      item.state===3&&
                                                      <div className='left-li-state'>
                                                          <MinusCircleOutlined />
                                                      </div>
                                                  }
                                                  <div className='left-li-time'>{item.time}</div>
                                              </div>
                                          )
                                      })
                                  }
                              </div>
                              <div className='scan-detail-log'
                                   ref={scrollRef}
                                   onWheel={onWheel}
                                   onMouseDown={handleMouseDown}
                                   onMouseUp={handleMouseUp}
                              >
                                  { renderPressLog() }
                              </div>
                          </Fragment>:
                          <div className='scan-log-no'>
                              <Empty />
                          </div>

                  }
              </div>
          </div>
        </Drawer>
    )
}
export default observer(ScanLogDrawer)
