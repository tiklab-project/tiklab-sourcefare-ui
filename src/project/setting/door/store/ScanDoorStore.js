/**
 * @name: ScanDoorStore
 * @author: liminliang
 * @date: 2025-07-21 15:00
 * @description：扫描门禁store
 * @update: 2025-07-21 15:00
 */

import { observable, action } from "mobx";
import {Axios} from 'tiklab-core-ui';
import {message} from 'antd';
export class ScanDoorStore  {

    @observable
    refresh=false


    /**
     *  通过项目id查询扫描门禁
     * @param  projectId projectId
     */
    @action
    findScanDoorByProjectId=async (projectId)=>{
        const param=new FormData()
        param.append("projectId",projectId)
        const res = await Axios.post("/scanDoor/findScanDoorByProjectId",param)
        if (res.code!==0){
            message.error(res.msg)
        }
        return res
    }

    /**
     * 添加扫描门禁
     * @param  param param
     */
    @action
    createScanDoor=async (param)=>{
        const res = await Axios.post("/scanDoor/createScanDoor",param)
        if (res.code===0){
           this.refresh=!this.refresh
        }else {
            message.error(res.msg)
        }
        return res
    }

    /**
     * 更新扫描门禁
     * @param  param param
     */
    @action
    updateScanDoor=async (param)=>{
        const res = await Axios.post("/scanDoor/updateScanDoor",param)
        if (res.code===0){
            this.refresh=!this.refresh
        }else {
            message.error(res.msg)
        }
        return res
    }

}
let scanDoorStore=new ScanDoorStore()
export default scanDoorStore;
