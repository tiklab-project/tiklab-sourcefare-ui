/**
 * @name: IssueStatisticsStore
 * @author: limingliang
 * @date: 2025-07-10 14:30
 * @description：问题统计
 * @update: 2025-07-10 14:30
 */

import { observable, action } from "mobx";
import {Axios} from 'tiklab-core-ui';
import {message} from 'antd';
export class IssueStatisticsStore {

    @observable
    refresh=false


    /**
     *问题统计
     * @param  param
     */
    @action
    findIssueStatisticPage=async (param)=>{
        const res = await Axios.post("/issueStatistic/findIssueStatisticPage",param)
        return res
    }

    /**
     *问题统计数量
     * @param  param
     */
    @action
    findIssueStatisticCount=async (param)=>{
        const res = await Axios.post("/issueStatistic/findIssueStatisticCount",param)
        return res
    }

}
let issueStatisticsStore=new IssueStatisticsStore()
export default issueStatisticsStore;
