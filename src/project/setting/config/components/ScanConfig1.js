/**
 * @name: ScanConfig
 * @author: limingliang
 * @date: 2025-06-18 14:30
 * @description：扫描配置
 * @update: 2025-06-18 14:30
 */
import React,{useState,useEffect,useRef,Fragment} from 'react';
import "./ScanConfig.scss"
import {Col, Form, Select, Table} from "antd";
import Breadcrumb from "../../../../common/breadcrumb/Breadcrumb";
import {withRouter} from "react-router";
import {inject, observer} from "mobx-react";
import success from "../../../../assets/images/img/success.png";
import ScanRecordStore from "../../../scanCode/store/ScanRecordStore";
import Btn from "../../../../common/btn/Btn";
import ScanConfigEditPop from "./ScanConfigEditPop";
import EmptyText from "../../../../common/emptyText/EmptyText";
const ScanConfig = (props) => {
    const {match:{params},projectStore} = props;
    const {projectData,findProject,findProjectRepByProjectId,updateProjectRep,updateProject
        ,findProjectEnvList,updateProjectEnv,refresh}=projectStore
    const {findScanRecordPage}=ScanRecordStore
    const [form] = Form.useForm()


    const [execEnv,setExecEnv]=useState(null)
    const [jdkEnv,setJdkEnv]=useState(null)

    //项目仓库信息
    const [projectRep,setProjectRep]=useState(null)
    const [scanRecordList,setScanRecordList]=useState([])
    const [isLoading,setIsLoading]=useState(false)

    const [visible,setVisible]=useState(false)

    useEffect(async () => {
        findProjectRepByProjectId(params.id).then(res=>{
            if (res.code===0){
                setProjectRep(res.data)
            }
        })
        findScanRecord(1)

        findProject(params.id)

        //查询扫描环境
        findProjectEnvList({projectId:params.id}).then(res=>{
            if (res.code===0&&res.data){
                const env=res.data.filter(a=>"exec"===a.type)
                if (env.length){
                    setExecEnv(env[0])
                }

                const jdk=res.data.filter(a=>"jdk"===a.type)
                if (jdk.length){
                    setJdkEnv(jdk[0])
                }
            }
        })
    },[params.id,refresh])

    //查询扫描记录
    const findScanRecord = (currentPage) => {
        setIsLoading(true)
        findScanRecordPage({
            pageParam:{currentPage:currentPage, pageSize:10},
            projectId:params.id,
        }).then(res=>{
            if (res.code===0){
                setScanRecordList(res.data.dataList)
            }
            setIsLoading(false)
        })
    }


    const goDetails = (data) => {
        props.history.push(`/project/${params.id}/report/${data.id}`)
    }

    //打开编辑
    const openEdit = () => {
      setVisible(true)
    }


    const openBorder = (item) => {
        return(
            <Fragment>
                <div className='body-record-border-flex'>
                    <div className='body-record-border-text' >
                        #{item?.id}
                    </div>
                </div>
                <div className='body-record-border-flex body-record-border-text-top'>
                    <div className='body-record-border-desc'>
                        <span className='title-color'>状态</span>
                        {
                            item?.scanResult==="success"?
                                <div className='desc-text-success'>成功</div>:
                                <div className='desc-text-fail'>失败</div>
                        }
                    </div>
                    <div className='body-record-border-desc'>
                        <span className='title-color'>耗时</span>
                        <span className='desc-text'>{item?.scanTime}</span>
                    </div>
                </div>
            </Fragment>
        )
    }

    return(
        <div className='sourcefare scan-config sourcewair-page-width'>
            <Col sm={{ span: "24" }}
                 md={{ span: "24" }}
                 lg={{ span: "24" }}
                 xl={{ span: "20", offset: "2" }}
                 xxl={{ span: "18", offset: "3" }}
            >
                <div className='scan-config-top'>
                    <Breadcrumb firstItem={`扫描配置`}/>
                    <Btn   type={'primary'} title={'编辑'} onClick={openEdit}/>
                </div>

                <div className='config-body-deploy'>
                 {/*   <div className='config-body-head'>配置信息</div>*/}
                    <div className='config-body-deploy-nav'>
                        <div className='config-body-deploy-nav-title'>扫描方式</div>
                        <div>
                            {projectData?.scanWay==='client'&&"客户端扫描"||
                            projectData?.scanWay==='server'&&"服务端扫描"}
                        </div>
                    </div>
                    {
                        projectData?.scanWay==='server'&&
                        <>
                            <div className='config-body-deploy-nav'>
                                <div className='config-body-deploy-nav-title'>仓库服务</div>
                                <div>
                                    {projectRep?.repositoryServer.name}
                                </div>
                            </div>
                            <div className='config-body-deploy-nav'>
                                <div className='config-body-deploy-nav-title'>仓库名称</div>
                                <div>
                                    {projectRep?.repositoryName}
                                </div>
                            </div>
                            <div className='config-body-deploy-nav'>
                                <div className='config-body-deploy-nav-title'>分支名称</div>
                                <div>
                                    {projectRep?.branch}
                                </div>
                            </div>
                        </>
                    }
                    <div className='config-body-deploy-nav'>
                        <div className='config-body-deploy-nav-title'>扫描方案</div>
                        <div>
                            {projectData?.scanScheme.schemeName}
                        </div>
                    </div>

                    {
                        projectData?.scanScheme.language==='Java'&&
                        <div className='config-body-deploy-nav'>
                            <div className='config-body-deploy-nav-title'>覆盖率测试</div>
                            <div>
                                {projectData?.cover===0?"未启用":"启用"}
                            </div>
                        </div>
                    }
                    <div className='config-body-deploy-nav'>
                        <div className='config-body-deploy-nav-title'>扫描环境</div>
                        <div>
                            {execEnv?execEnv.deployEnv.envAddress:"未设置"}
                        </div>
                    </div>
                    {
                        projectData?.scanScheme.language==='Java'&& projectData?.cover===1&&
                        <div className='config-body-deploy-nav'>
                            <div className='config-body-deploy-nav-title'>jdk路径</div>
                            <div>
                                {jdkEnv?jdkEnv.deployEnv.envAddress:"未设置" }
                            </div>
                        </div>
                    }
                    
                </div>

           {/*     <div className='config-body-record'>
                    <div className='config-body-head'>最近扫描</div>
                    {
                        scanRecordList && scanRecordList.length > 0 ?
                        <div className='config-body-record-style'>
                            {
                                scanRecordList.map((item, key) => {
                                    return (

                                        (key < 4) &&
                                        <div key={key}
                                             className='config-body-record-border config-border-width-25'
                                             onClick={() => goDetails(item)}>
                                            {openBorder(item)}
                                        </div>
                                    )
                                })
                            }
                        </div>  :
                            <EmptyText />
                    }


                </div>*/}
            </Col>
            <ScanConfigEditPop
                visible={visible}
                setVisible={setVisible}
                projectData={projectData}
                scanConfigData={projectRep}
                updateProjectRep={updateProjectRep}
                updateProject={updateProject}
                updateProjectEnv={updateProjectEnv}
                execEnv={execEnv}
                jdkEnv={jdkEnv}
            />
        </div>
    )

}
export default withRouter(inject('projectStore')(observer(ScanConfig)))
