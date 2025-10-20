/**
 * @name: ProjectList
 * @author: limingliang
 * @date: 2025-5-21 10:30
 * @description：项目列表
 * @update: 2025-5-21 10:30
 */
import React, {useState, useEffect} from "react";
import './projectList.scss'
import {Table, Dropdown, Menu, Tooltip, Col, Select} from "antd";
const { Option } = Select;
import {withRouter} from "react-router";
import {inject, observer} from "mobx-react";
import Breadcrumb from "../../../common/breadcrumb/Breadcrumb";
import Page from "../../../common/page/Page";
import EmptyText from "../../../common/emptyText/EmptyText";
import {SpinLoading} from "../../../common/loading/Loading";
import {getUser} from "tiklab-core-ui";
import {
    CheckCircleOutlined, CloseCircleOutlined, CloseSquareOutlined,
    DeleteOutlined,
    EditOutlined,
    EllipsisOutlined,
    SettingOutlined, StarFilled,
} from "@ant-design/icons";
import UserIcon from "../../../common/project/UserIcon";
import Listicon from "../../../common/project/Listicon";
import SearchInput from "../../../common/input/SearchInput";
import ProjectEditePop from "./ProjectAddPop";
import ProjectDeletePop from "../../../common/project/ProjectDeletePop";
import ProjectUpdatePop from "./ProjectUpdatePop";
import Tabs from "../../../common/tabs/Tabs";
import projectCollectStore from "../store/ProjectCollectStore";
import ScanRecordStore from "../../scanCode/store/ScanRecordStore";
import {PrivilegeButton} from 'tiklab-privilege-ui';
const ProjectList = (props) => {
    const {projectStore}=props
    const {refresh,findProjectPage,createRecordOpen,deleteProject,updateProject,findProjectNum}=projectStore
    const {coRefresh,deleteCollect,createProjectCollect}=projectCollectStore
    const {findNewScanRecord}=ScanRecordStore


    const [currentPage,setCurrentPage]=useState(1)
    const [totalPage,setTotalPage]=useState()
    const [pageSize]=useState(10)
    const [totalRecord,setTotalRecord]=useState()

    const [projectNumData,setProjectNumData]=useState(null)

    // 项目类型
    const [projectType,setProjectType] = useState("viewable")
    const [project,setProject]=useState(null)
    const [projectList,setProjectList]=useState([])


    const [isLoading,setIsLoading]=useState(false)
    const [searchName,setSearchName]=useState()

    const [addVisible,setAddVisible]=useState(false)

    //删除弹窗
    const [deleteVisible,setDeleteVisible]=useState(false)
    //更新弹窗
    const [updateVisible,setUpdateVisible]=useState(false)




    useEffect(async () => {
        findProject(currentPage,{name:searchName,findType:projectType})

        findProjectNum(getUser().userId).then(res=>{
                if (res.code===0){
                    setProjectNumData(res.data)
                }
            })
    }, [refresh,coRefresh]);


    //查询项目
    const findProject = (currentPage,param) => {
        setIsLoading(true)
        findProjectPage({ pageParam:{currentPage:currentPage,pageSize:pageSize},
            userId:getUser().userId,
            ...param
        }).then(res=>{
            setIsLoading(false)
            if (res.code===0){
                setProjectList(res.data?.dataList)
                setTotalPage(res.data.totalPage)
                setCurrentPage(res.data.currentPage)
                setTotalRecord(res.data.totalRecord)
            }
        })
    }

    //切换项目类型
    const clickType = (value) => {
        setProjectType(value.id)
        findProject(1, {name:searchName,findType:value.id})
    }

    //条件查询
    const onInputName = (e) => {
        const value=e.target.value
        setSearchName(value)
        if (value===''){
            findProject(1,{name:value,findType:projectType})
        }
    }

    const onSearch = () => {
        findProject(1,{name:searchName,findType:projectType})
    }



    //刷新查询
    const refreshFind = (data) => {
        findProject(currentPage,{findType:projectType})
    }

    //分页查询
    const changPage = (value) => {
        setCurrentPage(value)
        findProject(value,{findType:projectType})
    }

    //跳转项目历史界面
    const goScanList = (data) => {
        //创建打开记录
        createRecordOpen(data.id)
        findNewScanRecord(data.id).then(res=>{
            props.history.push(`/project/${data.id}/report`)
        })
    }

    //跳转项目详情
    const goDetails = (data) => {
        //创建打开记录
        createRecordOpen(data.id)
        findNewScanRecord(data.id).then(res=>{
            if (res.code===0&&res.data){
                props.history.push(`/project/${data.id}/report/${res.data.id}`)
            }
        })
    }



    //打开删除弹窗
    const openDeletePop = (value) => {
        setDeleteVisible(true)
        setProject(value)
    }
    //打开编辑弹窗
    const openEditePop = (value) => {
        setUpdateVisible(true)
        setProject(value)
    }

    //跳转设置
    const goSet = (value) => {
        //创建打开记录
        createRecordOpen(value.id)
        props.history.push(`project/${value.id}/setting/info`)
    }

    //切换收藏
    const clickCollect = (value,type) => {
        if (type==='collect'){
            createProjectCollect({projectId:value.id,user:{id:getUser().userId}})
        }else {
            deleteCollect(value.id,getUser().userId)
        }
    }



    /**
     * 操作下拉
     */
    const execPullDown=(value) => (
        <Menu>
            {
                value.update?
                    <Menu.Item  style={{width:120}} onClick={()=>openEditePop(value)}>
                        <div className='project-nav'>
                            <div><EditOutlined /></div>
                            <div>编辑</div>
                        </div>
                    </Menu.Item>:
                <Menu.Item  style={{width:120}}  disabled>
                    <div className='project-nav' >
                        <div><EditOutlined /></div>
                        <div>编辑</div>
                    </div>
                </Menu.Item>
            }
            {
                value.delete?
                    <Menu.Item onClick={()=>openDeletePop(value)}>
                        <div className='project-nav'>
                            <div><DeleteOutlined /></div>
                            <div>删除</div>
                        </div>
                    </Menu.Item>:
                    <Menu.Item  disabled>
                        <div className='project-nav'>
                            <div><DeleteOutlined /></div>
                            <div>删除</div>
                        </div>
                    </Menu.Item>
            }
            <Menu.Item  style={{width:120}} onClick={()=>goSet(value)}>
                <div className='project-nav'>
                    <div><SettingOutlined /></div>
                    <div>设置</div>
                </div>
            </Menu.Item>
        </Menu>
    );


    const baseColumns = [
        {
            title: '项目名称',
            dataIndex: 'name',
            width:'25%',
            ellipsis:true,
            render:(text,record)=>{
                return (
                    <div className='project-table-nav' onClick={()=>goScanList(record)}>
                        <Listicon text={text}
                                  colors={record.color}
                                  type={"project"}
                        />
                        <div>{record.name}</div>
                    </div>

                )
            }
        },
        {
            title: '最近扫描',
            dataIndex: 'newScanTime',
            ellipsis:true,
            width:'20%',
            render:(text,record)=>{
                return (
                    <div>
                        {
                            text?
                            <div style={{display:'flex',gap:'5',alignItems:"center",cursor:"pointer"}} onClick={()=>goDetails(record)}>
                                {text}
                                <div className='project-table-nav-result'>
                                    {record.scanResult==="success"&&
                                        <CheckCircleOutlined className={"project-table-nav-result-success"}/>
                                       ||
                                        record.scanResult==="fail"&&
                                        <CloseCircleOutlined className='project-table-nav-result-fail'/>
                                    }
                                </div>
                            </div> :
                            <div className='project-nav-desc'>未扫描</div>
                        }
                    </div>
                )}
        },
        {
            title: '扫描方式',
            dataIndex: "scanWay",
            key:"scanWay",
            width:'15%',
            ellipsis:true,
            render:(text,record)=>{
                return(
                    <div>
                        {
                            record?.scanWay==='client'&& <div>{"客户端"}</div>||
                            record?.scanWay==='server'&& <div>{"服务端(Git)"}</div>||
                            record?.scanWay==='serverUpload'&& <div>{"服务端(包上传)"}</div>
                        }

                    </div>
                )
            }
        },
        {
            title: '负责人',
            dataIndex: ['user','nickname'],
            key: 'user',
            width:'15%',
            ellipsis:true,
            render:(text,record)=><div className='icon-text-use'>
                <UserIcon text={record?.user?.nickname?text:record?.user?.name} size={"small"}/>
                <div>{record?.user?.nickname?text:record?.user?.name}</div>
            </div>
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'user',
            width:'15%',
            ellipsis:true,
        },
        {
            title: '操作',
            key: 'activity',
            ellipsis:true,
            width:'6%',
            render: (text, record) => (
                <div className='project-tables-set'>
                    {
                        record.collect?
                            <Tooltip title='取消收藏'>
                                <StarFilled className={"icon-text-collect"}  onClick={()=>clickCollect(record,"cancel")}/>
                            </Tooltip>:
                            <Tooltip title='收藏'>
                                <StarFilled className={"icon-text-size"}  onClick={()=>clickCollect(record,"collect")}/>
                            </Tooltip>
                    }

                    <Tooltip title='更多'>
                        <Dropdown    overlay={()=>execPullDown(record)}
                                     placement="bottomRight"
                                     trigger={['click']}
                            /* getPopupContainer={e => e.parentElement}*/
                        >
                            <EllipsisOutlined style={{fontSize:25}}/>
                        </Dropdown>
                    </Tooltip>
                </div>

            )
        }
    ];

    return(
        <div className='drop-down project sourcewair-page-width'>
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "20", offset: "2" }} xxl={{ span: "18", offset: "3" }}>
                <div className='project-head-style'>
                    <Breadcrumb firstItem={'项目'}/>
                    <PrivilegeButton  code={"project_add"} key={'project_add'} >
                        <div className='add-button' onClick={()=>setAddVisible(true)}>
                            新建项目
                        </div>
                    </PrivilegeButton>

                </div>

                <div className='project-search'>
                    <Tabs
                        type={projectType}
                        tabLis={[
                            {id:"viewable", title:'所有'},
                            {id:"oneself", title:'我创建的'},
                            {id:"collect", title:'我收藏的'}
                        ]}
                        onClick={clickType}
                        findType={'project'}
                        dataNum={projectNumData}
                    />
                    <SearchInput
                        placeholder={'搜索名称'}
                        onChange={onInputName}
                        onPressEnter={onSearch}
                    />
                </div>

                <div className='project-table '>
                    <Table
                        dataSource={projectList}
                        columns={baseColumns}
                        pagination={false}
                        locale={{emptyText: isLoading ?
                                <SpinLoading type="table"/>: <EmptyText title={"暂无项目"}/>}}
                    />
                    <Page pageCurrent={currentPage}
                          changPage={changPage}
                          totalPage={totalPage}
                          totalRecord={totalRecord}
                          refresh={refreshFind}
                    />
                </div>

                <ProjectEditePop {...props}
                                 visible={addVisible}
                                 setVisible={setAddVisible}/>
                <ProjectDeletePop {...props}
                                  deleteVisible={deleteVisible}
                                  project={project}
                                  setDeleteVisible={setDeleteVisible}
                                  deleteProject={deleteProject}/>
                <ProjectUpdatePop {...props}
                                   visible={updateVisible}
                                   setVisible={setUpdateVisible}
                                  project={project}
                                  updateProject={updateProject}
                />

            </Col>
        </div>
    )
}
export default withRouter(inject('projectStore')(observer(ProjectList)))
