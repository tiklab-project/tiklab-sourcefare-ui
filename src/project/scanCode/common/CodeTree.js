/**
 * 代码左侧树结构
 * @param CodLeftNav
 * @returns {JSX.Element}
 * @constructor
 */
import React, {useEffect,useState,useRef,Fragment} from "react";
import {observer} from "mobx-react";
import { Layout, Tooltip} from 'antd';
import codeStore from "../store/CodeStore";
import {
    BarChartOutlined,
    CaretDownOutlined,
    CaretRightOutlined, DownOutlined, ExceptionOutlined, FileTextOutlined,
    FolderOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined, ProjectOutlined, RightOutlined, SnippetsOutlined
} from "@ant-design/icons";
import "./CodeTree.scss"
import BreadcrumbContent from "../../../common/breadcrumb/Breadcrumb";
const { Sider } = Layout;

const CodeTree = (props) => {
    const {openChild,completeTreeData,openNav,choseItem,type,goCodeHome,title,setTabType,tabType}=props
    const [width, setWidth] = useState(300); // 初始宽度
    const {setStoreValue,collapsed} = codeStore



    //选择
    const choice = (value) => {
        openChild(value)
    }

    const choiceTypeTab = (value) => {
        setTabType(value)
    }


    const treeItem = (data,index) => {
        const math=index * 15
        return(
            <>
                {
                    data?.codeList?.map(item=>{
                        return(
                            <div key={item.path}>
                                <div
                                    style={{paddingLeft:math}}
                                    className={`code-tree-nav  ${choseItem===item.path+item.type?" code-tree-nav-choice":" "}`}
                                    onClick={()=>choice(item)}
                                >
                                    <div>
                                        {
                                            item.type==="folder" ?
                                                <div className='code-tree-nav-icon'>
                                                    {
                                                        openNav.includes(item.path)?
                                                            <DownOutlined style={{fontSize:11}}/>:
                                                            <RightOutlined style={{fontSize:11}}/>

                                                          /*  <CaretDownOutlined style={{fontSize:11}}/>:
                                                            <CaretRightOutlined style={{fontSize:11}} />*/
                                                    }
                                                    <FolderOutlined/>
                                                </div>
                                                :
                                                <div className='code-left-nav-text ' >
                                                    {
                                                        item.type==='folder'?
                                                            <div><FolderOutlined/></div>:
                                                            <div><FileTextOutlined /></div>
                                                    }
                                                </div>
                                        }
                                    </div>
                                    <div className='code-left-nav-name code-omit'>{item.name}</div>
                                </div>
                                {
                                    (openNav.includes(item.path)&&item.type==="folder")?
                                        treeItem(completeTreeData.filter(a=>a.parentPath.endsWith(item.path))[0],index+1):null
                                }
                            </div>
                        )
                    })
                }
            </>
        )
    }


    return (
        <Sider trigger={null}
               collapsible collapsed={collapsed}
               collapsedWidth="40"
               width={width}
               className="code-tree"
               resizeable
               onResize={(newWidth) => setWidth(newWidth)}
        >

            {
                collapsed ?
                    <div className='code-tree-close' onClick={()=>setStoreValue("collapsed",false)}>
                        <Tooltip title='展开'>
                            <MenuUnfoldOutlined style={{fontSize:17}} />
                        </Tooltip >
                        <div className='code-left-close-text'>文件树</div>

                    </div>:
                    <div className='code-tree-open'>
                        {
                            type!=='code'?
                            <div className='tree-open-title-style'>
                                <div className='tree-open-title-style-head'>
                                    <div className='title-style-head-t'>
                                            度量
                                    </div>
                                    <div className='title-style-head-ta'>
                                        <div className={`${tabType==='duplicated'&&"title-style-head-ta-text-ch "} title-style-head-ta-text`}
                                             onClick={()=>choiceTypeTab('duplicated')}
                                        >
                                            {"重复率"}
                                        </div>
                                        <div className={`${tabType==='complexity'&&"title-style-head-ta-text-ch "} title-style-head-ta-text`}
                                             onClick={()=>choiceTypeTab('complexity')}
                                        >
                                            {"复杂度"}
                                        </div>
                                    </div>
                                </div>
                            </div>:
                                <div className='tree-open-title-code'>
                                    代码
                                </div>
                        }

                        <div className={` ${type==='code'?"code-tree-open-code-height":"code-tree-open-code"}`}>
                            {
                                completeTreeData?.length>0&&treeItem(completeTreeData[0],0)
                            }
                        </div>
                        <div className={`code-tree-open-top ${type==='code'?" code-tree-open-top-end":" code-tree-open-top-between"}`}>
                            {
                                type!=='code'&&
                                <div className='code-tree-open-top-left' onClick={()=>choiceTypeTab("cover")}>
                                    <ExceptionOutlined />
                                    覆盖率
                                </div>
                            }
                            <Tooltip title='收起'>
                                <MenuFoldOutlined style={{fontSize:17}} onClick={()=>setStoreValue("collapsed",true)}/>
                            </Tooltip >
                        </div>
                    </div>
            }
        </Sider>
    )

}
export default observer(CodeTree)
