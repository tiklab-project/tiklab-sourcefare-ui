/**
 * @name: ServerGitPukStore
 * @author: liminliang
 * @date: 2023-11-1 15:00
 * @description：gitpuk服务store
 * @update: 2023-11-1 15:00
 */

import { observable, action } from "mobx";
import {Axios} from 'tiklab-core-ui';
import {message} from 'antd';
export class ServerGitPukStore  {

    @observable
    refresh=false

    /**
     * 查询仓库列表
     */
    @action
    findRepositoryList = async (param) =>{
        const data = await Axios.post('/serverGitPuk/findRepositoryList',param)
        if (data.code!==0){
            message.error(data.msg)
        }
        return data
    }

    /**
     * 查询仓库分支
     * @param  repServerId repServerId
     */
    @action
    findRepositoryBranchList=async (repId,repServerId)=>{
        const param =new FormData()
        param.append("repId",repId)
        param.append("repServerId",repServerId)
        const data = await Axios.post("/serverGitPuk/findRepositoryBranchList",param)
        if (data.code!==0&&!res.msg.concat("ticket invalid")){
            message.error(data.msg)
        }
        return data
    }



}
let serverGitPukStore=new ServerGitPukStore()
export default serverGitPukStore;
