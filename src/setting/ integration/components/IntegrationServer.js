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
                sm={{ span: 24 }}
                xs={{ span: 24 }}
                md={{ span: 24 }}
                lg={{ span: "18", offset: "2" }}
                xl={{ span: "16", offset: "3" }}
                xxl={{ span: "14", offset: "4" }}
            >
                <Breadcrumb firstItem={'服务集成'}/>
                <div className='integration'>
                    <div className='integration-list'>
                   {/*     <div className='integration-text-title'>代码</div>*/}
                        <div className='integration-border'>
                            <div className="integration-li"  onClick={()=>openSystemNav("code")}>
                                <div className="integration-li-icon">
                                    <AppstoreOutlined />
                                </div>
                                <div className="integration-li-center">
                                    <div className="integration-text-title">{"仓库服务"}</div>
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
