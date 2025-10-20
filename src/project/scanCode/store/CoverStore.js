/**
 * @name: CoverStore
 * @author: limingliang
 * @date: 2025-07-10 14:30
 * @description：覆盖率
 * @update: 2025-07-10 14:30
 */

import { observable, action } from "mobx";
import {Axios} from 'tiklab-core-ui';
import {message} from 'antd';
export class CoverStore  {

    @observable
    refresh=false


    /**
     *条件查询扫描覆盖率
     * @param  param
     */
    @action
    findProjectCoverList=async (param)=>{
        const res = await Axios.post("/projectCover/findProjectCoverList",param)
        return res
    }

    /**
     *条件分页查询扫描覆盖率
     * @param  param
     */
    @action
    findProjectCoverPage=async (param)=>{
        const res = await Axios.post("/projectCover/findProjectCoverPage",param)
        if (res.code!==0&&!res.msg.concat("ticket invalid")){
            message.error(res.msg)
        }
        return res
    }

    /**
     *条件分页查询扫描覆盖率
     * @param  param
     */
    @action
    findProjectCoverGoPage=async (param)=>{
        const res = await Axios.post("/projectCoverGo/findProjectCoverGoPage",param)
        if (res.code!==0&&!res.msg.concat("ticket invalid")){
            message.error(res.msg)
        }
        return res
    }

}
let coverStore=new CoverStore()
export default coverStore;
