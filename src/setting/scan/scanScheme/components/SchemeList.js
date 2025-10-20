/**
 * @name: SchemeList
 * @author: limingliang
 * @date: 2024-09-14 14:30
 * @description：扫描方案
 * @update: 2024-09-14 14:30
 */
import React,{useState,useEffect,Fragment} from 'react';
import "./SchemeList.scss"
import {Col, Dropdown, Menu, Table, Modal, Tooltip} from "antd";
import {EllipsisOutlined, ExclamationCircleOutlined, StopOutlined} from "@ant-design/icons";
import ScanSchemeStore from "../store/ScanSchemeStore";
const { confirm } = Modal;
import {observer} from "mobx-react";
import Breadcrumb from "../../../../common/breadcrumb/Breadcrumb";
import Btn from "../../../../common/btn/Btn";
import EmptyText from "../../../../common/emptyText/EmptyText";
import SchemeAddPop from "./SchemeAddPop";
import SchemeUpdatePop from "./SchemeUpdatePop";
import {PrivilegeButton} from 'tiklab-privilege-ui';
const SchemeList = (props) => {
    const {findScanSchemePage,deleteScanScheme,createScanScheme,createScanSchemeRuleSet, updateScanScheme,fresh}=ScanSchemeStore

    //扫描方案列表
    const [scanSchemeList,setScanSchemeList]=useState([])
    const [currentPage,setCurrentPage]=useState(1)
    const [totalPage,setTotalPage]=useState()
    const [totalRecord,setTotalRecord]=useState()
    const [pageSize]=useState(15)

    const [addVisible,setAddVisible] = useState(false)    //打开扫描方案弹窗状态
    const [updateVisible,setUpdateVisible]=useState(false)
    const [schemeDate,setSchemeDate]=useState('') //编辑选择的扫描方案

    const columns = [
        {
            title: '方案名称',
            dataIndex: 'schemeName',
            key: 'schemeName',
            width:'30%',
            ellipsis:true,
            render:(text,record)=><div className='scheme-table-name' onClick={()=>goDetails(record)}>{text}</div>
        },
        {
            title: '语言',
            dataIndex: 'language',
            key: 'language',
            width:'15%',
            ellipsis:true,
            render:(text,record)=><div className='scheme-table-language' onClick={()=>goDetails(record)}>{text}</div>
        },
        /*{
            title: '类型',
            dataIndex: 'scanWay',
            key: 'scanWay',
            width:'20%',
            ellipsis:true,
        },*/
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width:'20%',
            ellipsis:true,
        },
        {
            title:'操作',
            dataIndex: 'action',
            width:'5%',
            key: 'action',
            render:(text,record)=>(
                <Dropdown   overlay={()=>pullDown(record)}
                            placement="bottomRight"
                            trigger={['click']}
                            getPopupContainer={e => e.parentElement}
                >
                    <EllipsisOutlined style={{fontSize:18}} />
                </Dropdown>

            )
        }
    ]

    useEffect(()=>{
        getScanSchemePage();
    },[fresh])

    //分页查询扫描方案
    const getScanSchemePage = (currentPage) => {
        findScanSchemePage({ pageParam:{currentPage:currentPage,pageSize:pageSize}}).then(res=>{
            if (res.code===0){
                setScanSchemeList(res.data?.dataList)
                setTotalPage(res.data.totalPage)
                setCurrentPage(res.data.currentPage)
                setTotalRecord(res.data.totalRecord)
            }
        })
    }

    //跳转详情
    const goDetails = (value) => {
        props.history.push(`/setting/scheme/${value.id}`)
    }

    const openUpdatePop = (value) => {
        setSchemeDate(value)
        setUpdateVisible(true)
    }

    /**
     * 操作下拉
     */
    const pullDown=(value) => (
        <Menu>
            <PrivilegeButton code={"scan_scheme_update"} key={'scan_scheme_update'}>
                <Menu.Item>
                    <div onClick={()=>openUpdatePop(value)} className='table-nav-style'>
                        编辑
                    </div>
                </Menu.Item>
            </PrivilegeButton >
            {
                value.category===1?
                    <Menu.Item disabled>
                        <div className='table-nav-style' >
                            <Tooltip placement="top" title={'默认方案不能被删除'} >
                                删除
                            </Tooltip>
                        </div>
                    </Menu.Item>
                    :
                    <PrivilegeButton code={"scan_scheme_delete"} key={'scan_scheme_delete'}>
                        <Menu.Item>
                            <div onClick={()=>openDelete(value)} className='table-nav-style'>
                                删除
                            </div>
                        </Menu.Item>
                    </PrivilegeButton >
            }

        </Menu>
    );


    //删除弹窗
    const openDelete=async (value)=>{
     /*   findScanPlayList({scanSchemeId:value.id}).then(res=>{
            if (res.code===0&&res.data&&res.data.length>0){
                Modal.warning({
                    title: '存在关联的扫描计划，移出扫描计划后可删除',
                });
            }else {
                deletePop(value)
            }
        })*/
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

    return(
        <div className='xcode drop-down  sourcewair-page-width scheme'>
            <Col sm={{ span: "24" }}
                 md={{ span: "24" }}
                 lg={{ span: "24" }}
                 xl={{ span: "22", offset: "1" }}
                 xxl={{ span: "18", offset: "3" }}
            >
                <div className='scheme-up'>
                    <Breadcrumb firstItem={'扫描方案'}/>
                    <PrivilegeButton  code={"scan_scheme_add"} key={'scan_scheme_add'} >
                        <Btn
                            type={'primary'}
                            title={'添加方案'}
                            /*  icon={<PlusOutlined/>}*/
                            onClick={()=> setAddVisible(true)}
                        />
                    </PrivilegeButton>

                </div>
                <div className='scheme-table'>
                    <Table
                        bordered={false}
                        columns={columns}
                        dataSource={scanSchemeList}
                        rowKey={record=>record.id}
                        pagination={false}
                        locale={{emptyText: <EmptyText title={'暂无方案'}/>}}
                    />
                </div>
            </Col>
            <SchemeAddPop visible={addVisible} setVisible={setAddVisible}
                           createScanScheme={createScanScheme}
                           createScanSchemeRuleSet={createScanSchemeRuleSet}
                           setSchemeDate={setSchemeDate}
                           scanSchemeList={scanSchemeList}
            />

            <SchemeUpdatePop
                visible={updateVisible} setVisible={setUpdateVisible}
                schemeDate={schemeDate}
                setSchemeDate={setSchemeDate}
                updateScanScheme={updateScanScheme}
            />

        </div>
    )

}
export default observer(SchemeList)
