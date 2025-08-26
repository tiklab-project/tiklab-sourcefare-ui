import React, {useState,useEffect} from "react";
import {Row,Col} from "antd";
import SystemCountStore from "../store/SystemCountStore";
import {applyJump, disableFunction, applySubscription, getUser} from "tiklab-core-ui";

import "./SettingHome.scss";
import moment from "moment";
import {
    ApartmentOutlined,
    UserOutlined,
    MessageOutlined,
    GroupOutlined,
    ScheduleOutlined,
    InsertRowBelowOutlined,
    VerifiedOutlined,
    ToolOutlined,
    AlertOutlined,
    CloudOutlined,
    HistoryOutlined,
    LaptopOutlined,
    DesktopOutlined,
} from "@ant-design/icons"

const SettingHome = props => {

    const {findUseLicence,collectCount} = SystemCountStore;


    //系统设置统计数据
    const [count,setCount] = useState({});
    //当前版本
    const [licence,setLicence] = useState(null);
    //操作日志
    const [log,setLog] = useState(null);

   /* useEffect(()=>{
        findCount().then(res=>{
            if(res.code===0){
                setCount(res.data)
            }
        })
        if(version==='cloud'){
            findlogpage({
                pageParam: {pageSize: 1, currentPage: 1},
                userId:getUser().userId
            }).then(res=>{
                if(res.code===0){
                    setLog(res.data)
                }
            })
            findHomesApplyProduct().then(res=>{
                if(res.code===0){
                    setLicence(res.data)
                }
            })
        } else {
            findUseLicence().then(res=>{
                if(res.code===0){
                    setLicence(res.data)
                }
            })
        }
    },[])*/

    useEffect(()=>{
        const versionInfo = JSON.parse(localStorage.getItem("versionInfo"))
        collectCount().then(res=>{
            if(res.code===0){
                setCount(res.data)
            }
        })

        findUseLicence().then(res=>{
            if(res.code===0){
                setLicence(res.data)
            }
        })
    },[])

    /**
     * 路由跳转
     */
    const li = ['orga','user','userGroup','dir'];
    const goPath = path => {
        const authConfig = JSON.parse(localStorage.getItem("authConfig"))
        if(!authConfig.authType){
            const isAuth = li.some(item => item===path)
            if(isAuth){
                return applyJump(`${authConfig.authServiceUrl}/#/setting/${path}`)
            }
        }
        props.history.push(`/setting/${path}`)
    }


    const commonBox = (
        <>
            <div className='home-message-box'>
                <div className='home-title'>消息</div>
                <div className='home-message'>
                    <div className='home-message-item' onClick={()=>goPath('mes/notice')}>
                        <div className='home-left'>
                            <div className='home-icon'><MessageOutlined/></div>
                            <div className='home-label'>消息通知方案</div>
                        </div>
                        <div className='home-info'>
                            {count?.messageNoticeNum || 0}
                        </div>
                    </div>
                    <div className='home-message-item' onClick={()=>goPath('mes/send')}>
                        <div className='home-left'>
                            <div className='home-icon'><AlertOutlined /></div>
                            <div className='home-label'>消息发送方式</div>
                        </div>
                        <div className='home-info'>
                            {count?.messageSendTypeNum || 0}
                        </div>
                    </div>
                </div>
            </div>
            <div className='home-config-box'>
                <div className='home-title'>安全</div>
                <div className='home-config'>
                    <div className='home-config-item' onClick={()=>goPath('backupRecovery')}>
                        <div className='home-left'>
                            <div className='home-icon'><HistoryOutlined /></div>
                            <div className='home-label'>上次备份时间</div>
                        </div>
                        <div className='home-info'>{count.backupsTime?moment(count.backupsTime).format('YYYY-MM-DD') :'无'}</div>
                    </div>
                    <div className='home-config-item' onClick={()=>goPath('myLog')} >
                        <div className='home-left'>
                            <div className='home-icon'><LaptopOutlined /></div>
                            <div className='home-label'>操作日志</div>
                        </div>
                        {/*<div className='home-info'>{count?.envNumber || 0}</div>*/}
                    </div>
                </div>
            </div>
        </>
    )

    return (
        <Row className='setting-home'>
            <Col
                xs={{ span: "24" }}
                sm={{ span: "24" }}
                md={{ span: "24" }}
                lg={{ span: "20" , offset: "2"  }}
                xl={{ span: "18", offset: "3" }}
                xxl={{ span: "14", offset: "5" }}
            >

            </Col>
        </Row>
    )
};

export default SettingHome;
