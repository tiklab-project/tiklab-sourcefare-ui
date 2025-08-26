/**
 * @name: IssueStatisticsStore
 * @author: limingliang
 * @date: 2025-07-10 14:30
 * @description：统计
 * @update: 2025-07-10 14:30
 */

import { observable, action } from "mobx";
import {Axios} from 'tiklab-core-ui';
import {message} from 'antd';
export class StatisticsStore  {

    @observable
    refresh=false


    /**
     *问题统计
     * @param  param
     */
    @action
    issueStat=async (param)=>{
        const res = await Axios.post("/statistics/issueStat",param)
        return res
    }

    /**
     * 重复率统计
     * @param  param
     */
    @action
    duplicatedStat=async (param)=>{
        const res = await Axios.post("/statistics/duplicatedStat",param)
        return res
    }
    /**
     * 复杂度统计
     * @param  param
     */
    @action
    complexityStat=async (param)=>{
        const res = await Axios.post("/statistics/complexityStat",param)
        return res
    }

    /**
     * 覆盖率统计
     * @param  param
     */
    @action
    coverStat=async (param)=>{
        const res = await Axios.post("/statistics/coverStat",param)
        return res
    }

}
let statisticsStore=new StatisticsStore()
export default statisticsStore;
