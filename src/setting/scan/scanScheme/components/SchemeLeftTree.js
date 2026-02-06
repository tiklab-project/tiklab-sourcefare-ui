/**
 * @name: SchemeLeftTree
 * @author: limingliang
 * @date: 2025-11-25 14:30
 * @description：扫描方案左侧导航
 * @update: 2025-11-25 14:30
 */

import React,{useState,useEffect,Fragment} from 'react';
import {inject, observer} from "mobx-react";
import "./SchemeLeftTree.scss"
import {Col, Dropdown, Layout, Modal, Tooltip} from "antd";
import ScanSchemeStore from "../store/ScanSchemeStore";
import {
    DeleteOutlined,
    EditOutlined,
    EllipsisOutlined,
    ExclamationCircleOutlined,
    PlusOutlined
} from "@ant-design/icons";
const { confirm } = Modal;
import {getUser, getVersionInfo} from "tiklab-core-ui";
import ModalContentTip from "../../../../common/statistics/ComTip/ModalContentTip";
import SchemeAddPop from "./SchemeAddPop";
const { Sider } = Layout;
const SchemeLeftTree = (props) => {
    const {scanScheme,setScanScheme,setContentType,findProjectList,setTab,projectStore}=props
    const {findScanSchemeList,deleteScanScheme,fresh}=ScanSchemeStore
    const [width, setWidth] = useState(260); // 初始宽度
    const {findApplySystem} = projectStore

    //扫描方案列表
    const [scanSchemeList,setScanSchemeList]=useState([])

    //打开扫描方案弹窗状态
    const [addVisible,setAddVisible] = useState(false)
    //打开提示款弹窗
    const [staticVisible,setStaticVisible] = useState(false)

    //编辑选择的扫描方案
    const [schemeDate,setSchemeDate]=useState('')

    //当前悬浮的文档
    const [isHover, setIsHover] = useState(null);
    //下拉框
    const [dropdownVisible,setDropdownVisible] = useState(null);


    const [applySystem,setApplySystem]=useState(null)


    useEffect( ()=>{
        findApplySystem().then(value=>{
            if (value.code===0){
                setApplySystem(value.data)
            }
        })
    },[])

    useEffect(()=>{
        getScanScheme();
    },[fresh])

    //扫描方案
    const getScanScheme = () => {
        findScanSchemeList({}).then(res=>{
            if (res.code===0){
                if (res.data?.length){
                    setScanScheme(res.data[0])
                }
                setScanSchemeList(res.data)
            }
        })
    }

    //切换nv
    const clickNav = value => {
        setTab("rule")
        setContentType("ruleSet")
        setScanScheme(value)
    }

    //打开扫描方案
    const openScheme = () => {
        setAddVisible(true)
    }

    const closeVisible = () => {
        setStaticVisible(false)
        setAddVisible(true)
    }


    //删除弹窗
    const openDelete=async (value)=>{
        findProjectList({scanSchemeId:value.id}
        ).then(res=>{
               if (res.code===0&&res.data&&res.data.length>0){
                   Modal.warning({
                       title: '存在关联的扫描计划，移出扫描计划后可删除',
                   });
               }else {
                   deletePop(value)
               }
           })
    }

    const deletePop = (value) => {
        confirm({
            title: "确认删除",
            icon: <ExclamationCircleOutlined />,
            content: '',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                deleteScanScheme(value.id)
            },
            onCancel() {
            },
        });
    }


    const editMenu = (item) => {
        return <div className='scheme-dropdown-more'
                    onClick={(event) => event.stopPropagation()}>
                        {
                            item.category===1?
                                <>
                                    <Tooltip placement="top" title={'默认方案不能编辑'}
                                             className='dropdown-more-item-no'>
                                        <EditOutlined />
                                        编辑
                                    </Tooltip>
                                    <Tooltip placement="top" title={'默认方案不能删除'}
                                             className='dropdown-more-item-no'>
                                        <DeleteOutlined />
                                        删除
                                    </Tooltip>
                                </>:
                                <>
                                    <div className='dropdown-more-item'>
                                        <EditOutlined />
                                        编辑
                                    </div>
                                    <div className='dropdown-more-item' onClick={()=>openDelete(item)}>
                                        <DeleteOutlined />
                                        删除
                                    </div>
                                </>
                        }

            </div>
    };


    return (
        <Sider trigger={null}
               collapsible
               width={width}
               className="scheme-tree"
               resizeable
               onResize={(newWidth) => setWidth(newWidth)}
        >
            <div className='scheme-tree-style'>
                <div className='scheme-tree-title'>
                    <div className='scheme-tree-title-text'>检测方案</div>
                    <Tooltip oltip placement="bottom" title={"添加方案"}>
                        <div className='scheme-tree-title-icon' onClick={openScheme}><PlusOutlined /></div>
                    </Tooltip>
                </div>

                <div className='scheme-tree-data'>
                    {
                        scanSchemeList?.length&&scanSchemeList.map((item=>{
                            return(
                                <div key={item.id}
                                     className={`${item.id===scanScheme?.id&&"scheme-tree-data-nv-choice "} scheme-tree-data-nv`}
                                     onClick={()=>clickNav(item)}
                                     onMouseOver={(event) => { event.stopPropagation(); setIsHover(item.id) }}
                                     onMouseLeave={(event) => { event.stopPropagation(); setIsHover(null) }}
                                >
                                    <div className='scheme-tree-data-nv-text'>
                                        {item.schemeName}
                                    </div>
                                    {
                                        isHover===item.id&&
                                        <Dropdown
                                            overlay={()=>editMenu(item)}
                                            placement="bottomLeft"
                                            visible={dropdownVisible===item.id}
                                            onVisibleChange={visible => {
                                                setDropdownVisible(visible ? item.id : null);
                                            }}
                                        >
                                            <EllipsisOutlined className='scheme-tree-data-nv-icon' />
                                        </Dropdown>

                                    }
                                </div>
                            )
                        }))
                    }
                </div>
                <Modal
                    closable={false}
                    footer={null}
                    className='task-add-enhance-modal'
                    width={450}
                    visible={staticVisible}
                    onCancel={()=>setStaticVisible(false)}
                >
                    <ModalContentTip
                        config={{
                            title:'添加扫描方案',
                            desc:'根据需求添加自定义扫描方案'
                        }}
                        applySystem={applySystem}
                        closeVisible={closeVisible}
                    />
                </Modal>

                <SchemeAddPop visible={addVisible}
                              setVisible={setAddVisible}
                              setSchemeDate={setSchemeDate}
                              scanSchemeList={scanSchemeList}
                />
            </div>
        </Sider>
    )
}
export default inject('projectStore')(observer(SchemeLeftTree))
