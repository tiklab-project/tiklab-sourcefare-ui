/**
 * @name: ProjectList
 * @author: limingliang
 * @date: 2025-5-21 10:30
 * @description：项目store
 * @update: 2025-5-21 10:30
 */
import { observable, action } from "mobx";
import {Axios, getUser} from 'tiklab-core-ui';
import {message} from 'antd';
export class ProjectStore{

    @observable
    refresh=false

    @observable projectList = [];

    @observable projectData;


    //导航等级
    @observable navLevel=1

    @action
    setNavLevel = value =>{
        this.navLevel = value
    }

    /**
     * 创建项目
     * @param value
     */
    @action
    createProject=async (value)=>{
        const res = await Axios.post("/project/createProject",value)
        if (res.code===0){
            this.refresh=!this.refresh
            message.success("创建成功")
        }
        return res;
    }



    /**
     * 更新
     * @param value
     */
    @action
    updateProject=async (param)=>{
        const res = await Axios.post("/project/updateProject",param)
        if (res.code===0){
            this.refresh=!this.refresh
            message.success("更新成功",1)
        }else {
            message.error("更新失败")
            return
        }
        return res
    }

    /**
     * 删除制品库
     * @param value
     */
    @action
    deleteProject=async (value)=>{
        const param = new FormData();
        param.append('id',value)
        const res = await Axios.post("/project/deleteProject",param)
        if (res.code===0){
            this.refresh=!this.refresh
            message.success("移除成功")
        }else {
            message.success("移除失败")
        }
        return res
    }

    /**
     * 查询所有的项目
     */
    @action
    findAllProject=async ()=>{
        const res = await Axios.post("/project/findAllProject")
        return res;
    }

    /**
     * 分页条件查询
     * @param value
     */
    @action
    findProjectPage=async (param)=>{
        const res = await Axios.post("/project/findProjectPage",param)
        if (res.code===0){
            this.projectList=res.data
        }
        return res;
    }

    /**
     * 通过id查询
     * @param id
     */
    @action
    findProject=async (id)=>{
        const param=new FormData();
        param.append('id',id)
        const res = await Axios.post("/project/findProject",param)
        if (res.code===0){
            this.projectData=res.data
        }
        return res;
    }

    /**
     *查询数量
     * @param  param
     */
    @action
    findProjectNum=async (userId)=>{
        const param=new FormData()
        param.append("userId",userId)
        const res = await Axios.post("/project/findProjectNum",param)
        return res
    }


    /**
     * 添加打开项目的记录管理
     * @param projectId
     * @returns {Promise<unknown>}
     */
    @action
    createRecordOpen = async (projectId) =>{
        const param={
            project:{
                id:projectId,
            },
            userId:getUser().userId,
        }
        const data = await Axios.post('/recordOpen/createRecordOpen',param)
        return data
    }

    /**
     *通过项目id 查询仓库信息
     * @param  param
     */
    @action
    findProjectRepByProjectId=async (id)=>{
        const param=new FormData()
        param.append("projectId",id)
        const res = await Axios.post("/projectRep/findProjectRepByProjectId",param)
        if (res.code!==0){
            message.error("查询报错，"+res.msg)
        }
        return res
    }
    /**
     *修改
     * @param  param
     */
    @action
    updateProjectRep=async (param)=>{
        const res = await Axios.post("/projectRep/updateProjectRep",param)
        if (res.code===0){
            this.refresh=!this.refresh
        }
        return res
    }

    /**
     *通过项目id 查询仓库信息
     * @param  param
     */
    @action
    findProjectRepByProjectId=async (id)=>{
        const param=new FormData()
        param.append("projectId",id)
        const res = await Axios.post("/projectRep/findProjectRepByProjectId",param)
        if (res.code!==0){
            message.error("查询报错，"+res.msg)
        }
        return res
    }



    /**
     *查询项目环境
     * @param  param
     */
    @action
    findProjectEnvList=async (param)=>{
        const res = await Axios.post("/projectEnv/findProjectEnvList",param)
        if (res.code!==0){
            message.error("查询报错，"+res.msg)
        }
        return res
    }

    /**
     *更新项目环境
     * @param  param
     */
    @action
    updateProjectEnv=async (param)=>{
        const res = await Axios.post("/projectEnv/updateProjectEnv",param)
        if (res.code===0){
            this.refresh=!this.refresh
        }
        return res
    }


}

export const PROJECT_STORE = "projectStore";
