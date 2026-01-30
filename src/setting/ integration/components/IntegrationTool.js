/**
 * @Description: 工具集成
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
const IntegrationTool = (props) => {

    const openSystemNav = (type) => {
        props.history.push(`/setting/tool/${type}`)
    }

    return(
        <div className=' drop-down sourcewair-page-width'>
            <Col
                sm={{ span: 24 }}
                xs={{ span: 24 }}
                md={{ span: 24 }}
                lg={{ span: "20", offset: "2" }}
                xl={{ span: "16", offset: "4" }}
                xxl={{ span: "16", offset: "4" }}
            >
                <Breadcrumb firstItem={'工具集成'}/>
                <div className='integration'>
                    <div className='integration-list'>
                      {/*  <div className='integration-text-title'>环境</div>*/}
                        <div className='integration-border'>
                            <div className='integration-li' onClick={()=>openSystemNav("maven")}>
                                <div className="integration-li-icon">
                                    <Images type={"maven"}  width={18} height={18}/>
                                </div>
                                <div className="integration-li-center">
                                    <div className="integration-text-title">{"Maven"}</div>
                                    <div className="integration-li-desc">{"Maven版本"}</div>
                                </div>
                                <div className="system-li-down">
                                    <RightOutlined />
                                </div>
                            </div>
                            <div className='integration-li' onClick={()=>openSystemNav("jdk")}>
                                <div className="integration-li-icon"  >
                                    <Images type={"jdk"}  width={18} height={18}/>
                                </div>
                                <div className="integration-li-center">
                                    <div className="integration-text-title">{"JDK"}</div>
                                    <div className="integration-li-desc">{"JDK版本"}</div>
                                </div>
                                <div className="system-li-down">
                                    <RightOutlined />
                                </div>
                            </div>
                            <div className='integration-li' onClick={()=>openSystemNav("node")}>
                                <div className="integration-li-icon">
                                    <Images type={"node"}  width={18} height={18} />
                                </div>
                                <div className="integration-li-center">
                                    <div className="integration-text-title">{"Node"}</div>
                                    <div className="integration-li-desc">{"Node版本"}</div>
                                </div>
                                <div className="system-li-down">
                                    <RightOutlined />
                                </div>
                            </div>
                            <div className='integration-li' onClick={()=>openSystemNav("python")}>
                                <div className="integration-li-icon">
                                    <Images type={"python"}  width={18} height={18} />
                                </div>
                                <div className="integration-li-center">
                                    <div className="integration-text-title">{"Python"}</div>
                                    <div className="integration-li-desc">{"Python版本"}</div>
                                </div>
                                <div className="system-li-down">
                                    <RightOutlined />
                                </div>
                            </div>
                            <div className='integration-li' onClick={()=>openSystemNav("go")}>
                                <div className="integration-li-icon">
                                    <Images type={"go"}  width={18} height={18}/>
                                </div>
                                <div className="integration-li-center">
                                    <div className="integration-text-title">{"Go"}</div>
                                    <div className="integration-li-desc">{"Go版本"}</div>
                                </div>
                                <div className="system-li-down">
                                    <RightOutlined />
                                </div>
                            </div>
                            <div className='integration-li' onClick={()=>openSystemNav("net")}>
                                <div className="integration-li-icon">
                                    <Images type={"net"}  width={18} height={18}/>
                                </div>
                                <div className="integration-li-center">
                                    <div className="integration-text-title">{".Net"}</div>
                                    <div className="integration-li-desc">{".Net版本"}</div>
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
export default observer(IntegrationTool)
