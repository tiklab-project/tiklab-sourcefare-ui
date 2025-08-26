/**
 * @name: CodeScanStore
 * @author: liminliang
 * @date: 2023-11-1 15:00
 * @description：代码store
 * @update: 2023-11-1 15:00
 */

import { observable, action } from "mobx";
import {Axios} from 'tiklab-core-ui';
import {message} from 'antd';
export class CodeStore  {

    @observable
    refresh=false


    /**
     *查询代码内容
     * @param  param
     */
    @action
    findCodeData=async (filePath)=>{
        const param=new FormData()
        param.append("filePath",filePath)
        const res = await Axios.post("/code/findCodeData",param)
        if (res.code!==0){
            message.error(res.msg)
        }
        return res
    }

    /**
     *查询代码
     * @param  param param
     */
    @action
    findCode=async (param)=>{
        const res = await Axios.post("/code/findCode",param)
        if (res.code!==0){
            message.error(res.msg)
        }
        return res
    }

}
let codeStore=new CodeStore()
export default codeStore;
