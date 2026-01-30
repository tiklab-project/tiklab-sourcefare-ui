/**
 * @Description: 服务集成
 * @Author: limingliang
 * @Date: 2025/9/10
 * @LastEditors: limingliang
 * @LastEditTime: 2025/9/10
 */
import React, {useEffect, useState} from "react";
import {Col, Form, Input, Modal, Row, Select} from "antd";
import {observer} from "mobx-react";
import {Breadcrumb} from "../../../ui";
import Btn from "../../../common/btn/Btn";
import "./Integration.scss"
import {AppstoreOutlined, RightOutlined} from "@ant-design/icons";
import Images from "../../../common/image/Images";
const IntegrationServer = (props) => {


    const openSystemNav = (type) => {
        props.history.push(`/setting/server/${type}`)
    }
    return(
        <div className=' drop-down sourcewair-page-width'>
            <Col
                xs={{ span: "24" }}
                sm={{ span: "24" }}
                md={{ span: "24" }}
                lg={{ span: "20", offset: "2" }}
                xl={{ span: "16", offset: "4" }}
                xxl={{ span: "16", offset: "4" }}
            >
                <Breadcrumb firstItem={'服务集成'}/>
                <div className='integration '>
                    <div className='integration-list'>
                        <div className='integration-text-title'>代码源</div>
                        <div className='integration-border'>
                            <div className="integration-li"  onClick={()=>openSystemNav("gitpuk")}>
                                <div className="integration-li-icon"  >
                                    <Images type={"gitpuk"}  width={18} height={18}/>
                                </div>
                                <div className="integration-li-center">
                                    <div className="integration-text-title">{"GitPuk"}</div>
                                    <div className="integration-li-desc">{"服务端扫描拉取代码地址"}</div>
                                </div>
                                <div className="system-li-down">
                                    <RightOutlined />
                                </div>
                            </div>
                            <div className="integration-li"  onClick={()=>openSystemNav("gitee")}>
                                <div className="integration-li-icon">
                                    <Images type={"gitee"}  width={18} height={18}/>
                                </div>
                                <div className="integration-li-center">
                                    <div className="integration-text-title">{"Gitee"}</div>
                                    <div className="integration-li-desc">{"服务端扫描拉取代码地址"}</div>
                                </div>
                                <div className="system-li-down">
                                    <RightOutlined />
                                </div>
                            </div>
                            <div className="integration-li"  onClick={()=>openSystemNav("pri-gitlab")}>
                                <div className="integration-li-icon">
                                    <Images type={"gitlab"}  width={18} height={18}/>
                                </div>
                                <div className="integration-li-center">
                                    <div className="integration-text-title">{"自建GitLab"}</div>
                                    <div className="integration-li-desc">{"服务端扫描拉取代码地址"}</div>
                                </div>
                                <div className="system-li-down">
                                    <RightOutlined />
                                </div>
                            </div>
                            <div className="integration-li"  onClick={()=>openSystemNav("url")}>
                                <div className="integration-li-icon">
                                    <Images type={"url"}  width={18} height={18}/>
                                </div>
                                <div className="integration-li-center">
                                    <div className="integration-text-title">{"通用Git"}</div>
                                    <div className="integration-li-desc">{"服务端扫描拉取代码地址"}</div>
                                </div>
                                <div className="system-li-down">
                                    <RightOutlined />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
        </div>
    )
}
export default observer(IntegrationServer)
