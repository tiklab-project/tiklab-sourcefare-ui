/**
 * @name: ProjectCollectStore
 * @author: limingliang
 * @date: 2025-7-14 10:30
 * @description：项目收藏store
 * @update: 2025-7-14 10:30
 */
import { observable, action } from "mobx";
import {Axios, getUser} from 'tiklab-core-ui';
import {message} from 'antd';
import {CodeStore} from "../../scanCode/store/CodeStore";
export class ProjectCollectStore{

    @observable
    coRefresh=false



    /**
     * 创建项目收藏
     * @param value
     */
    @action
    createProjectCollect=async (value)=>{
        const res = await Axios.post("/projectCollect/createProjectCollect",value)
        if (res.code===0){
            this.coRefresh=!this.coRefresh
            message.success("收藏成功",1)
        }
        return res;
    }


    /**
     * 删除项目收藏
     * @param projectId projectId
     * @param userId userId
     */
    @action
    deleteCollect=async (projectId,userId)=>{
        const param = new FormData();
        param.append('projectId',projectId)
        param.append('userId',userId)
        const res = await Axios.post("/projectCollect/deleteCollect",param)
        if (res.code===0){
            this.coRefresh=!this.coRefresh
            message.success("取消收藏",1)
        }else {
            message.success("取消收藏失败")
        }
        return res
    }

}

let projectCollectStore=new ProjectCollectStore()
export default projectCollectStore;
