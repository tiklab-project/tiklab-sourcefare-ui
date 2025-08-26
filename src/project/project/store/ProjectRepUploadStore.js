/**
 * @name: ProjectRepUploadStore
 * @author: limingliang
 * @date: 2025-7-21 10:30
 * @description：项目上传代码的信息
 * @update: 2025-7-21 10:30
 */
import { observable, action } from "mobx";
import {Axios, getUser} from 'tiklab-core-ui';
import {message} from 'antd';
import {CodeStore} from "../../scanCode/store/CodeStore";
export class ProjectRepUploadStore{

    @observable
    upRefresh=false



    /**
     * 创建扫描项目上传代码信息
     * @param value
     */
    @action
    createProjectRepUpload=async (value)=>{
        const res = await Axios.post("/projectRepUpload/createProjectRepUpload",value)
        if (res.code===0){
            this.upRefresh=!this.upRefresh
            message.success("上传成功",1)
        }
        return res;
    }


    /**
     * 查询扫描项目上传代码的信息
     * @param value
     */
    @action
    findProjectRepUploadByRepId=async (projectId)=>{
        const param=new FormData()
        param.append("projectId",projectId)
        const res = await Axios.post("/projectRepUpload/findProjectRepUploadByRepId",param)
        if (res.code!==0){
            message.error("查询失败:",res.msg)
        }
        return res;
    }


}

let projectRepUploadStore=new ProjectRepUploadStore()
export default projectRepUploadStore;
