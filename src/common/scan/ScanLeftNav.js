/**
 * @name: ScanLeftNav
 * @author: limingliang
 * @date: 2025-08-11 14:30
 * @description：扫描左侧导航
 * @update: 2025-08-11 14:30
 */
import React,{useState,useEffect,Fragment} from 'react';
import {Col, Layout, Tooltip} from 'antd';
import "./ScanLeftNav.scss"
import {FileSyncOutlined, FileUnknownOutlined, PieChartOutlined, RadarChartOutlined} from "@ant-design/icons";
import {observer} from "mobx-react";
import BreadcrumbContent from "../breadcrumb/Breadcrumb";
const { Sider } = Layout;
const ScanLeftNav = (props) => {
    const {setType,findType,treeNav,setTreeNav}=props

    const onClickNav = (value) => {
        if (value!=="measure"){
            setTreeNav(value)
            if (value==='issue'){
                setType(null)
            }
        }
    }

    const onClickChildNav=(value)=>{
        setTreeNav(value)
        setType(value)
    }

    const navList=[
        {
            title:"问题",
            key:"issue",
            icon:<FileUnknownOutlined />,
            childList:[
                {
                    title:"功能",
                    key:"function",
                },
                {
                    title:"安全",
                    key:"security",
                },

                {
                    title:"规范",
                    key:"norm",
                },
            ]
        },
        {
            title:"度量",
            key:"measure",
            icon:<FileSyncOutlined />,
            childList:[
                {
                    title:"重复率",
                    key:"duplicated",
                    icon:<FileSyncOutlined />,
                },
                {
                    title:"复杂度",
                    key:"complexity",
                    icon:<RadarChartOutlined />,
                },
                {
                    title:"覆盖率",
                    key:"cover",
                    icon:<PieChartOutlined />,
                }
            ]
        },

    ]

    return(
        <Sider trigger={null}
               collapsedWidth="40"
               width={200}
               className="scan-left-nav"
               resizeable
        >
            <div className='left-tree-navs'>
                <div className='left-tree-navs-title'>
                    统计
                </div>

                {
                    navList.map(item=>{
                        return(
                            <div key={item.key}>
                                {
                                    findType==='statistics'&&item.key==='cover'?
                                       null:
                                        <>
                                            <div className={` ${item.key==="measure"?"left-tree-nav-cursor":treeNav===item.key&&" left-tree-nav-opt" } left-tree-nav `}
                                                 onClick={()=>onClickNav(item.key)}
                                            >
                                                <div className='left-tree-nav-icon'>
                                                    <div>{item.icon}</div>
                                                    <div>{item.title}</div>
                                                </div>
                                            </div>
                                            {
                                                item?.childList&&item.childList.map(childItem=>{
                                                    return(
                                                        <div key={childItem.key}
                                                             className={`left-tree-child-nav ${treeNav===childItem.key&&" left-tree-nav-opt"}`}
                                                             onClick={()=>onClickChildNav(childItem.key)}
                                                        >
                                                <span>
                                                    {childItem.title}
                                                </span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </>
                                }
                            </div>
                        )
                    })
                }
            </div>
        </Sider>
    )
}
export default observer(ScanLeftNav)
