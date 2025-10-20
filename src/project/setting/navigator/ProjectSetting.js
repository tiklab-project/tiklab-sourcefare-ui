/**
 * @name: ProjectSetting 制品库左侧导设置-导航栏
 * @author: limingliang
 * @date: 2023-02-17 16:51
 * @description：setting
 * @update: 2023-02-17 16:51
 */
import React,{useState,useEffect,Fragment} from 'react';
import {renderRoutes} from 'react-router-config'
import './ProjectSetting.scss'
import {inject, observer} from "mobx-react";
import {SettingOutlined, TagsOutlined} from "@ant-design/icons";
import {ProjectNav,PrivilegeProjectButton} from 'tiklab-privilege-ui';
import {getVersionInfo} from "tiklab-core-ui";
const ProjectSetting = (props) => {
    const {match:{params},location,projectStore} = props
    let path = location.pathname

    const projectId = params.id;      // 仓库id
    const {findProject} = projectStore
    const [navPath,setNavPath]=useState()   //左侧导航览类型

    //清理策略状态
    const [cleanVisible,setCleanVisible]=useState(false)

    let remoteLayerRouter = [
        {
            id:'1',
            title: '项目信息',
            router:`/project/${projectId}/setting/info`,
        },
        {
            id:'4',
            title: '成员',
            router:`/project/${projectId}/setting/user`,
            icon:   <SettingOutlined className='icon-nav'/>,
            // purviewCode: "rpy_user",
        },
        {
            id:'5',
            title: '权限',
            router:`/project/${projectId}/setting/role`,
            //  purviewCode: "rpy_authority",
        },
        {
            id:"2",
            router:`/project/${projectId}/setting/config`,
            title:`扫描配置`,
        },
        {
            id:"3",
            router:`/project/${projectId}/setting/door`,
            title:`扫描门禁`,
        },
    ];


    useEffect(async () => {
        if (path.endsWith("/pushLibrary")){
            const pa= path.substr(0,path.lastIndexOf("setting")+7);
            setNavPath(pa+"/push")
        }else {
            setNavPath(path)
        }

    }, [path]);

    //切换类型
    const cuteType =async (value) => {
        if (value.id==="7"&&(getVersionInfo().expired&&getVersionInfo().release!==3)){
            setCleanVisible(true)
            return
        }
        setNavPath(value.router)
        props.history.push(value.router)
    }



    const renderRouter = item => {
        return  <PrivilegeProjectButton key={item.id} code={item.purviewCode} domainId={projectId}>
            {navContent(item)}
        </PrivilegeProjectButton>
    }

    const navContent = item =>{
        return   <div key={item.id} className={`${navPath===item.router&&' layer-choice-table'}  nav-tabs pitch-nav-table`}
                      onClick={()=>cuteType(item)} >
            <div className='layer-nav-char'>
                {item.title}
            </div>
        </div>
    }


    return(
        <ProjectNav
            {...props}
            domainId={projectId}
            projectRouters={remoteLayerRouter}
            noAccessPath={"/noaccess"}  //没有访问权限
            pathkey={'id'}
            outerPath={`/repository/${path}/setting`}
        >
            <div className='layerSetup'>
                <div className={'layer-nav'}>
                    <div className='layer-title layer-nav-char'>设置</div>
                    { remoteLayerRouter?.map(item=>renderRouter(item))}
                </div>
                <div  className={'layer-right-style'}>
                    {renderRoutes(props.route.routes)}
                </div>
            </div>
        </ProjectNav>

    )
}
export default inject('projectStore')(observer(ProjectSetting))
