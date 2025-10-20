/**
 * @name: InstanceStore
 * @author: liminliang
 * @date: 2025-06-18 15:00
 * @description：扫描实例动态store
 * @update:  2025-06-18 15:00
 */

import { observable, action } from "mobx";
import {Axios} from 'tiklab-core-ui';
import {message} from 'antd';
export class InstanceStore  {

    @observable
    refresh=false

    /**
     * 通过id查询扫描记录实例
     * @param  id id
     */
    @action
    findScanRecordInstance=async (id)=>{
        const param=new FormData()
        param.append("id",id)
        const res = await Axios.post("/recordInstance/findScanRecordInstance",param)
        return res
    }

    /**
     *更新扫描实例
     * @param  param
     */
    @action
    updateScanRecordInstance=async (param)=>{
        const res = await Axios.post("/recordInstance/updateScanRecordInstance",param)
        if (res.code===0){
            this.refresh=!this.refresh
        }
        return res
    }


    /**
     *通过计划分页查询扫描记录实例
     * @param  param
     */
    @action
    findRecordInstancePageByPlay=async (param)=>{
        const res = await Axios.post("/recordInstance/findRecordInstancePageByPlay",param)
        return res
    }


    /**
     *通过项目id分页查询扫描记录实例
     * @param  param
     */
    @action
    findScanRecordInstancePage=async (param)=>{
        const res = await Axios.post("/recordInstance/findScanRecordInstancePage",param)
        if (res.code!==0&&!res.msg.concat("ticket invalid")){
            message.error(res.msg)
            return
        }
        return res
    }

    /**
     * 条件分页查询项目总的扫描记录
     * @param  param
     */
    @action
    findProjectInstancePage=async (param)=>{
        const res = await Axios.post("/recordInstance/findProjectInstancePage",param)
        if (res.code!==0&&!res.msg.concat("ticket invalid")){
            message.error(res.msg)
            return
        }
        return res
    }
    /**
     * 查询项目扫描问题数量
     * @param  param
     */
    @action
    findProjectInstanceNum=async (param)=>{
        const res = await Axios.post("/recordInstance/findProjectInstanceNum",param)
        if (res.code!==0&&!res.msg.concat("ticket invalid")){
            message.error(res.msg)
            return
        }
        return res
    }

    /**
     * 创建扫描记录实例的动态
     * @param  param
     */
    @action
    createRecordInstanceCond=async (param)=>{
        const res = await Axios.post("/recordInstanceCond/createRecordInstanceCond",param)
        if (res.code!==0&&!res.msg.concat("ticket invalid")){
            message.error(res.msg)
            return
        }
        return res
    }

    /**
     * 条件查询扫描记录实例的动态
     * @param  param
     */
    @action
    findRecordInstanceCondList=async (param)=>{
        const res = await Axios.post("/recordInstanceCond/findRecordInstanceCondList",param)
        if (res.code!==0&&!res.msg.concat("ticket invalid")){
            message.error(res.msg)
        }
        return res
    }

    /**
     * 条件查询问题类型数量
     * @param  recordId
     */
    @action
    findIssueTypeStatisticCount=async (recordId)=>{
        const param=new FormData()
        param.append('recordId',recordId)
        const res = await Axios.post("/issueStatistic/findIssueTypeStatisticCount",param)
        return res
    }


}
let instanceStore=new InstanceStore()
export default instanceStore;
