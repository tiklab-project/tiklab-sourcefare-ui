import React from 'react';
import {Redirect} from 'react-router-dom';
import AsyncComponent from './common/lazy/SyncComponent';
import NotFoundContent from "./setting/not/NotFoundContent";


const Home=AsyncComponent(()=>import('./home/components/Home'))

const Login=AsyncComponent(()=>import('./login/login'))
const Logout=AsyncComponent(()=>import('./login/Logout'))
const LoginRpwContent=AsyncComponent(()=>import('./login/LoginRpwContent'))
const SysException=AsyncComponent(()=>import('./login/SysExceptionContent'))
const ExcludeProductUser=AsyncComponent(()=>import('./login/ExcludeProductUser'))
const error=AsyncComponent(()=>import('./login/error'))
const RequestErrorContent=AsyncComponent(()=>import('./login/RequestErrorContent'))
/**
 * 首页
 */
const Homepage=AsyncComponent(()=>import('./home/components/HomePage'))
const TodoPageList=AsyncComponent(()=>import('./home/components/TodoPageList'))


/**
 * 项目
 */
const ProjectList = AsyncComponent(() => import('./project/project/components/ProjectList'));
const ProjectAdd = AsyncComponent(() => import('./project/project/components/ProjectAdd'));
const ProjectAside = AsyncComponent(() => import('./project/navigator/ProjectAside'));


//概览

const Survey = AsyncComponent(() => import('./project/survey/components/Survey'));


/*
* 扫描报告
* */
const ScanReport = AsyncComponent(() => import('./project/scanCode/components/ScanReportList'));
const ScanReportData = AsyncComponent(() => import('./project/scanCode/components/ScanReportDetails'));

/*扫描问题*/
const ScanIssueList = AsyncComponent(() => import('./project/scanIssue/components/ScanIssueList'));

//统计
const Statistics = AsyncComponent(() => import('./project/statistics/components/Statistics'));


/*仓库设置*/
const ProjectSetting = AsyncComponent(() => import('./project/setting/navigator/ProjectSetting'));
const ProjectBasicInfo = AsyncComponent(() => import('./project/setting/basicInfo/ProjectBasicInfo'));
const ProgramUser = AsyncComponent(() => import('./project/setting/element/ProgramUser'));
const ProjectDomainRole = AsyncComponent(() => import('./project/setting/element/ProjectDomainRole'));

/*扫描门禁*/
const ScanDoor = AsyncComponent(() => import('./project/setting/door/components/ScanDoor'));



/**
 * 系统设置
 */
const SettingHome=AsyncComponent(()=>import('./setting/home/components/SettingHome'))
const Setting=AsyncComponent(()=>import('./setting/navigator/Setting'))


// message
const MessageContent=AsyncComponent(()=>import('./setting/element/MessageContent'))
const MessageManagement=AsyncComponent(()=>import('./setting/message/MessageManagement'))
const MessageType=AsyncComponent(()=>import('./setting/message/MessageType'))
const MessageSendType=AsyncComponent(()=>import('./setting/message/MessageSendType'))
const MessageSendTypeTrue=AsyncComponent(()=>import('./setting/message/MessageSendTypeTrue'))
const MessageNotice=AsyncComponent(()=>import('./setting/message/MessageNotice'))
const MessageNoticeTrue=AsyncComponent(()=>import('./setting/message/MessageNoticeTrue'))

//备份 恢复
const BackupRecoveryContent=AsyncComponent(()=>import('./setting/backups/BackupRecoveryContent'))


/*系统设置*/
const ServerInfoList=AsyncComponent(()=>import('./setting/server/compoents/RepositoryServerList'))
/*扫描配置*/
const ScanConfig = AsyncComponent(() => import('./project/setting/config/components/ScanConfig'));



//扫描方案
const ScanEnvironment=AsyncComponent(()=>import('./setting/scan/scanEnv/components/ScanEnvironment'))
const ScanScheme=AsyncComponent(()=>import('./setting/scan/scanScheme/components/SchemeList'))
const SchemeDetails=AsyncComponent(()=>import('./setting/scan/scanScheme/components/SchemeDetails'))
const ScanRuleSetList=AsyncComponent(()=>import('./setting/scan/scanRule/components/ScanRuleSetList'))
const ScanRuleList=AsyncComponent(()=>import('./setting/scan/scanRule/components/ScanRuleList'))




// security
const MyLog=AsyncComponent(()=>import("./setting/security/MyLog"))
const LogTemplate=AsyncComponent(()=>import("./setting/security/LogTemplate"))
const LogType=AsyncComponent(()=>import("./setting/security/LogType"))

// todotask
const MyTodoTask=AsyncComponent(()=>import("./setting/todotask/MyTodoTask"))
const Task=AsyncComponent(()=>import("./setting/todotask/Task"))
const TodoTemp=AsyncComponent(()=>import("./setting/todotask/TodoTemp"))
const TodoType=AsyncComponent(()=>import("./setting/todotask/TodoType"))

// licence
const Version=AsyncComponent(()=>import('./setting/licence/Version'))
const AuthContent=AsyncComponent(()=>import('./setting/licence/AuthContent'))

// element
const User=AsyncComponent(()=>import("./setting/element/User"))
const Directory=AsyncComponent(()=>import("./setting/element/Directory"))
const Orga=AsyncComponent(()=>import("./setting/element/Orga"))
const UserGroup=AsyncComponent(()=>import("./setting/element/Group"))
const UserGroupTrue=AsyncComponent(()=>import("./setting/element/Groupture"))
const sysFeature=AsyncComponent(()=>import('./setting/element/SystemFeature'))
const sysRole=AsyncComponent(()=>import('./setting/element/SystemRole'))
const sysRoleTrue=AsyncComponent(()=>import('./setting/element/SystemRoleTrue'))
const ProjectRole=AsyncComponent(()=>import('./setting/element/ProjectRole'))
const ProjectFeature=AsyncComponent(()=>import('./setting/element/ProjectFeature'))



//集成与开放
const OpenApi =AsyncComponent(()=>import('./setting/integration/openApi/OpenApi'))
const OpenApiDoc =AsyncComponent(()=>import('./setting/integration/openApi/OpenApiDoc'))
const SystemInt =AsyncComponent(()=>import('./setting/integration/systemInt/components/SystemInt'))

const routers = [
    {
        path:'/login',
        component:Login,
    },
    {
        path:'/logout',
        component:Logout,
    },

    {
        path:'/no-auth',
        exact:true,
        component:ExcludeProductUser,
    },
    {
        exact: true,
        path: '/noaccess',
        render: props => <NotFoundContent {...props}/>
    },
    {
        path:'/requestError',
        exact:true,
        component:RequestErrorContent,
    },
    {
        path: '/loginRpw',
        component: LoginRpwContent,
        exact:true,
    },
    {
        path: "/openApi",
        component: OpenApiDoc,
        key:'OpenApiDocPage',
    },
    {
        path:"/500",
        exact:true,
        component:SysException,
    },
    {
        exact: true,
        path: '/404',
        render: props => <NotFoundContent {...props} homePath={'/'}/>
    },

    {
        path: '/',
        exact:true,
        render:()=><Redirect to={'/project'}/>,
    },
    {
        path:'/',
        component:Home,
        routes:[
            {
                path:'/index',
                exact:true,
                component:Homepage,
            },
            {
                path:'/index/todoList',
                exact:true,
                component:TodoPageList,
            },

            {
                path: '/project',
                exact:true,
                component: ProjectList,
            },
            {
                path: '/project/add',
                exact:true,
                component: ProjectAdd,
            },
            {
                path:'/project/:id',
                component:ProjectAside,
                routes:[
                    {
                        path: '/project/:id/overview',
                        exact:true,
                        component: Survey,
                    },
                    {
                        path: '/project/:id/report',
                        exact:true,
                        component: ScanReport,
                    },
                    {
                        path: '/project/:id/report/:recordId',
                        exact:true,
                        component: ScanReportData,
                    },
                    {
                        path: '/project/:id/issue',
                        exact:true,
                        component: ScanIssueList,
                    },
                    {
                        path: '/project/:id/statistics',
                        exact:true,
                        component: Statistics,
                    },

                    {
                        path:'/project/:id/setting',
                        component: ProjectSetting,
                        routes: [
                            {
                                path: '/project/:id/setting/info',
                                component: ProjectBasicInfo,
                            },
                            {
                                path: '/project/:id/setting/config',
                                exact:true,
                                component: ScanConfig,
                            },
                            {
                                path: '/project/:id/setting/user',
                                component: ProgramUser,
                            },
                            {
                                path: '/project/:id/setting/role',
                                component: ProjectDomainRole,
                            },
                            {
                                path: '/project/:id/setting/door',
                                component: ScanDoor,
                            },
                            {
                                exact: true,
                                path: '/noaccess',
                                render: props => <NotFoundContent {...props} homePath={'/'} type='noaccess'/>
                            },
                        ]
                    },

                ]},

            {
                path:'/setting',
                component: Setting,
                routes: [
                    {
                        path: '/setting/home',
                        component: SettingHome,
                    },

                    {
                        path: '/setting/role',
                        component: sysRole,
                    },
                    {
                        path: '/setting/roletrue',
                        component: sysRoleTrue,
                    },
                    {
                        path: '/setting/syr/feature',
                        component: sysFeature,
                    },
                    {
                        path: '/setting/project/role',
                        component: ProjectRole,
                    },
                    {
                        path: '/setting/project/feature',
                        component: ProjectFeature,
                    },
                    {
                        path: '/setting/task',
                        component: Task,
                    },
                    {
                        path: '/setting/todoTask',
                        component: MyTodoTask,
                    },
                    {
                        path: '/setting/todoTemp',
                        component: TodoTemp,
                    },
                    {
                        path: '/setting/todoType',
                        component: TodoType,
                    },
                    {
                        path:'/setting/myLog',
                        component: MyLog,
                    },
                    {
                        path:'/setting/logTemplate',
                        component: LogTemplate,
                    },{

                        path:'/setting/logType',
                        component: LogType,
                    },
                    {
                        path: '/setting/orga',
                        component: Orga,
                    },
                    {
                        path: '/setting/userGroup',
                        component: UserGroup,
                    },
                    {
                        path: '/setting/dir',
                        component: Directory,
                    },
                    {
                        path: '/setting/user',
                        component: User,
                    },


                    {
                        path:'/setting/message',
                        component: MessageContent,
                    },
                    {
                        path:'/setting/mes/management',
                        component: MessageManagement,
                    },
                    {
                        path:'/setting/mes/type',
                        component: MessageType,
                    },
                    {
                        path:'/setting/mes/send',
                        component: MessageSendType,
                    },
                    {
                        path:'/setting/mes/sendtrue',
                        component: MessageSendTypeTrue,
                    },
                    {
                        path:'/setting/mes/notice',
                        component: MessageNotice,
                    },
                    {
                        path:'/setting/mes/noticetrue',
                        component: MessageNoticeTrue,
                    },

                    {
                        path:'/setting/server',
                        exact: true,
                        component: ServerInfoList,
                    },
                    {
                        path:'/setting/scanEnv',
                        exact: true,
                        component: ScanEnvironment,
                    },
                    {
                        path:'/setting/scheme',
                        exact: true,
                        component: ScanScheme,
                    },
                    {
                        path:'/setting/scheme/:id',
                        exact: true,
                        component: SchemeDetails,
                    },
                    {
                        path:'/setting/scanRuleSet',
                        exact: true,
                        component: ScanRuleSetList,
                    },
                    {
                        path:'/setting/scanRule/:ruleSetId',
                        exact: true,
                        component: ScanRuleList,
                    },


                    {
                        path:'/setting/backupRecovery',
                        component: BackupRecoveryContent,
                    },

                    {
                        path: '/setting/element/userGrouptrue',
                        component: UserGroupTrue,
                    },
                    {
                        path:'/setting/version',
                        component: Version,
                    },
                    {
                        path:'/setting/authContent',
                        component: AuthContent,
                    },

                    {
                        path: "/setting/openApi",
                        component: OpenApi,
                        key:'OpenApi',
                    },
                    {
                        path: "/setting/systemInt",
                        component: SystemInt,
                        key:'SystemInt',
                    },
                    {
                        exact: true,
                        path: '/noaccess',
                        render: props => <NotFoundContent {...props} homePath={'/'} type='noaccess'/>
                    },
                ]
            },
            {
                path:'/error',
                component:error,
            },

        ],

    },


]

export default routers
