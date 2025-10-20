import React,{useState,useEffect} from 'react';
import {
    ApartmentOutlined,
    BarChartOutlined,
    FileUnknownOutlined, PieChartOutlined,
    SwitcherOutlined,
    TagsOutlined
} from '@ant-design/icons';
import {inject,observer} from 'mobx-react';
import "./ProjectAside.scss"
import Aside from "../../common/aside/Aside";
import {Loading} from '../../common/loading/Loading';
import {getUser,getVersionInfo} from "tiklab-core-ui";


const ProjectAside= props=>{

    const {match,projectStore,systemRoleStore,location}=props

    const {findProjectPage,findProject,setNavLevel} = projectStore

    const {getInitProjectPermissions} = systemRoleStore

    const projectId = match.params.id

    const [theme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "gray");


    // 页面初始加载状态
    const [isLoading,setIsLoading] = useState(true);

    const [projectList,setProjectList]=useState([])
    const [project,setProject]=useState([])

    const [foldState,setFoldState]=useState()


    // 侧边第一栏导航
    const firstRouters=[
       /* {
            id:`/project/${projectId}/overview`,
            title:`概览`,
            icon:<ApartmentOutlined className={`${foldState?'close-iconfont':'open-iconfont'}`}/>,
        },*/
         {
           id:`/project/${projectId}/report`,
           title:`扫描历史`,
           icon:<SwitcherOutlined  className={`${foldState?'close-iconfont':'open-iconfont'}`}/>,
       },
        {
            id:`/project/${projectId}/issue`,
            title:`问题`,
            icon: <FileUnknownOutlined  className={`${foldState?'close-iconfont':'open-iconfont'}`}/>,
        },
        {
            id:`/project/${projectId}/statistics`,
            title:`统计`,
            icon: <PieChartOutlined className={`${foldState?'close-iconfont':'open-iconfont'}`}/> ,
        },

    ]

    useEffect( ()=>{
        setNavLevel(2)
        findProjectPage({pageParam:{currentPage:1, pageSize:15},
            userId:getUser().userId}).then(res=>{
            if (res.code===0){
                const a=res.data.dataList.filter(a=>a.id!==projectId)
               // a.unshift(res.data)
                setProjectList(a)
            }}
        )

        findProject(projectId).then(res=>{
            if (res.code===0){
                setProject(res.data)
            }
        })

        getInitProjectPermissions(getUser().userId,projectId)
    },[])


  /*  if(isLoading){
        return <Loading/>
    }*/

    return  <Aside
                {...props}
                firstRouters={firstRouters}
                list={projectList}
                info={project}
                projectId={projectId}
                setNavLevel={setNavLevel}
                setFoldState={setFoldState}
            />
}

export default inject('systemRoleStore','projectStore')(observer(ProjectAside))


