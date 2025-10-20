import React, {useEffect, useState} from 'react';
import {
    LayoutOutlined,
    SoundOutlined,
    VerifiedOutlined,
    FileDoneOutlined,
    TeamOutlined,
    SafetyCertificateOutlined,
    UserDeleteOutlined
} from '@ant-design/icons';
import SettingContent from './SettingContent';
import {templateRouter} from "./SettingRouters"
import {inject, observer} from "mobx-react";
const Setting = props =>{

    const {projectStore}=props
    const {setNavLevel} = projectStore

    const [authConfig,setAuthConfig]=useState(null)

    useEffect( ()=>{
        setNavLevel(2)

        const authConfig=localStorage.getItem('authConfig')
        setAuthConfig(JSON.parse(authConfig))
    },[])

    const applicationRouters = [
            {
                id: "1",
                title: "用户",
                icon: <TeamOutlined/>,
                children: [
                    {
                        id: "/setting/orga",
                        title: "部门",
                        purviewCode: "orga",
                    },
                    {
                        id: "/setting/user",
                        title: "Users",
                        purviewCode: "user",
                    },
                    {
                        id: "/setting/userGroup",
                        title: "用户组",
                        purviewCode: "user_group",
                    },
                    {
                        id: "/setting/dir",
                        title: "用户目录",
                        purviewCode: "user_dir",
                    },

                ]
            },
            {
                id:'/setting/role',
                title:'Privilege',
                icon: <UserDeleteOutlined />,
                purviewCode:'permission',
            },
            {
                id:'/setting/message',
                title: '消息',
                icon:<SoundOutlined/>,
                purviewCode:'message',
            },
            /*{
                id:'4',
                title: '仓库配置',
                icon:<DeploymentUnitOutlined />,
                children: [
                    {
                        id:'/setting/server',
                        title: '服务集成',
                    },
                ]
            },*/
            {
                 id:'3',
                 title: '扫描配置',
                 icon: <FileDoneOutlined />,
                children: [

                       {
                           id:'/setting/scheme',
                           title: '扫描方案',
                       },

                    {
                        id:'/setting/scanRuleSet',
                        title:'扫描规则集',
                    },
                   ]
             },
            {
                id:'7',
                title: '集成开放',
                icon: <LayoutOutlined />,
                children: [
                    {
                        id:'/setting/tool',
                        title: '工具集成',
                    },
                    {
                        id:'/setting/server',
                        title: '服务集成',
                    },
                    {
                        id:'/setting/openApi',
                        title:'openApi',
                        purviewCode:'openapi',
                    },
                ]
            },
            {
                id:'5',
                title:'Security',
                icon:<SafetyCertificateOutlined/>,
                children: [
                    {
                        id:'/setting/backupRecovery',
                        title:'备份与恢复',
                        purviewCode:'backups_and_recover',
                    },
                ]
            },
            {
                id:'6',
                title:'系统',
                icon:<VerifiedOutlined />,
                children: [
                    {
                        id:'/setting/version',
                        title:'Version And Licence',
                        purviewCode:'licence',
                    },
                    {
                        id:'/setting/authContent',
                        title:'系统访问权限',
                        purviewCode:'apply_limits',
                    },
                ]
            },
        ]



    return  <SettingContent
                {...props}
                isDepartment={false}
                applicationRouters={applicationRouters}
                templateRouter={templateRouter}
                setNavLevel={setNavLevel}
            />
}

export default inject('projectStore')(observer(Setting))
