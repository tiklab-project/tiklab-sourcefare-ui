/**
 * @name: OverviewStore
 * @author: liminliang
 * @date: 2023-11-1 15:00
 * @description：扫描概览 store
 * @update: 2023-11-1 15:00
 */

import { observable, action } from "mobx";
import {Axios} from 'tiklab-core-ui';
import {message} from 'antd';
export class OverviewStore  {

    @observable
    refresh=false


    /**
     * 通过扫描记录id查询扫描覆盖率统计
     * @param  recordId
     */
    @action
    findProjectCoverStat=async (recordId)=>{
        const param=new FormData()
        param.append("recordId",recordId)
        const res = await Axios.post("/overview/findProjectCoverStat",param)
        return res
    }

    /**
     *扫描结果统计
     * @param  id
     */
    @action
    findScanRecordStat=async (id)=>{
        const param=new FormData()
        param.append("recordId",id)
        const res = await Axios.post("/overview/findScanRecordStat",param)
        if (res.code!==0&&!res.msg.concat("ticket")){
            message.error("查询报错，"+res.msg)
        }
        return res
    }

    /**
     *扫描重复度统计、复杂度统计
     * @param  recordId
     * @param  projectId
     */
    @action
    findMetricStat=async (projectId,recordId)=>{
        const param=new FormData()
        param.append("projectId",projectId)
        param.append("recordId",recordId)
        const res = await Axios.post("/overview/findMetricStat",param)
        if (res.code!==0&&!res.msg.concat("ticket")){
            message.error("查询报错，"+res.msg)
        }
        return res
    }

}
let overviewStore=new OverviewStore()
export default overviewStore;
