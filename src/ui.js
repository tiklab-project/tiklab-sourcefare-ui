
import {store as sourceFareStore} from "./store";

import App from "./app";
import Routers from "./routes";
import Portal from "./home/components/Portal";
import SettingContent from "./setting/navigator/SettingContent";

import AsyncComponent from "./common/lazy/SyncComponent";
//语言
import xcodeZh from "./common/language/zh.json"

//公共组件
const SearchInput=AsyncComponent(()=>import('./common/input/SearchInput'))
const Breadcrumb=AsyncComponent(()=>import('./common/breadcrumb/Breadcrumb'))
const DeleteExec=AsyncComponent(()=>import('./common/delete/DeleteExec'))
const Btn=AsyncComponent(()=>import('./common/btn/Btn'))
const UserIcon=AsyncComponent(()=>import('./common/project/UserIcon'))
const Listicon=AsyncComponent(()=>import('./common/project/Listicon'))
const Modal=AsyncComponent(()=>import('./common/modal/Modals'))
const Page=AsyncComponent(()=>import('./common/page/Page'))
const TimeTaskPop=AsyncComponent(()=>import('./common/timetask/TimeTaskPop'))
const EmptyText=AsyncComponent(()=>import('./common/emptyText/EmptyText'))
const DownSelect=AsyncComponent(()=>import('./common/downSelect/DownSelect'))
const Loading=AsyncComponent(()=>import('./common/loading/Loading'))

const ExcludeProductUser=AsyncComponent(()=>import('./login/ExcludeProductUser'))
const ProjectSetting=AsyncComponent(()=>import('./project/setting/navigator/ProjectSetting'))

/**
 * 首页
 */
const Homepage=AsyncComponent(()=>import('./home/components/HomePage'))
const TodoPageList=AsyncComponent(()=>import('./home/components/TodoPageList'))


const repository_white = require("./assets/images/img/repository-white.png").default;
/**
 * 仓库
 */

const RepositoryAside=AsyncComponent(()=>import('./project/navigator/ProjectAside'))

const error=AsyncComponent(()=>import('./login/error'))




/**
 * 系统设置
 */
const SettingHome=AsyncComponent(()=>import('./setting/home/components/SettingHome'))
const Setting=AsyncComponent(()=>import('./setting/navigator/Setting'))




// message
const MessageManagement=AsyncComponent(()=>import('./setting/message/MessageManagement'))
const MessageType=AsyncComponent(()=>import('./setting/message/MessageType'))
const MessageSendType=AsyncComponent(()=>import('./setting/message/MessageSendType'))
const MessageSendTypeTrue=AsyncComponent(()=>import('./setting/message/MessageSendTypeTrue'))
const MessageNotice=AsyncComponent(()=>import('./setting/message/MessageNotice'))
const MessageNoticeTrue=AsyncComponent(()=>import('./setting/message/MessageNoticeTrue'))


//备份 恢复
const BackupRecoveryContent=AsyncComponent(()=>import('./setting/backups/BackupRecoveryContent'))


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

const Login=AsyncComponent(()=>import('./login/login'))
const Logout=AsyncComponent(()=>import('./login/Logout'))


const SettingRouters=AsyncComponent(()=>import('./setting/navigator/SettingRouters'))

const gitTokImg = {
    repository_white
};


export {
    sourceFareStore,
    gitTokImg,
    ProjectSetting,
    SearchInput,
    Routers,
    xcodeZh,

    Breadcrumb,
    DeleteExec,
    Btn,
    UserIcon,
    Listicon,
    Modal,
    Page,
    TimeTaskPop,
    EmptyText,
    DownSelect,
    Loading,

    App,
     Homepage,
    TodoPageList,
    RepositoryAside,

    error,

    SettingHome,
    Setting,
    MessageManagement,
    MessageType,
    MessageSendType,
    MessageSendTypeTrue,
    MessageNotice,
    MessageNoticeTrue,

    BackupRecoveryContent,
    MyLog,
    LogTemplate,
    LogType ,
    MyTodoTask,
    Task,
    TodoTemp,
    TodoType,
    Version,
    AuthContent,
    User ,
    Directory,
    Orga,
    UserGroup,
    UserGroupTrue,
    sysFeature ,
    sysRole,
    sysRoleTrue,
    ProjectRole,
    ProjectFeature,
    Login,
    Logout,

    SettingContent,
    Portal,
    ExcludeProductUser,
    SettingRouters,
}
