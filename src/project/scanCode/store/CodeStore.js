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

    @observable
    collapsed=false


    //代码完整的代码树
    @observable completeTreeData=[]
    //代码打开的文件树
    @observable openNav=[]
    //代码选中
    @observable choseItem=''

    //复杂度完整的代码树
    @observable complexityTreeData=[]
    //复杂度打开的文件树
    @observable complexityOpenNav=[]
    //复杂度选中
    @observable complexityChoseItem=''


    //重复率完整的代码树
    @observable duplicatedTreeData=[]
    //重复率打开的文件树
    @observable duplicatedOpenNav=[]
    //重复率选中
    @observable duplicatedChoseItem=''


    @action
    setStoreValue=async (key,value)=>{
      switch (key){
          //代码树展开、关闭状态
          case 'collapsed':
              this.collapsed=value
              break
          case 'nav':
              this.openNav=value
              break
          case "choseItem":
              this.choseItem=value
      }
    }



    //选择
     @action
     choiceFile = (value,type) => {
        const  path=value.path;
         //代码
         if (type==='code'){
             //选中状态以路径加类型
             this.choseItem=path+value.type
             const data=this.openNav.filter(a=>a===path)
             if (data.length){
                 this.openNav=this.openNav.filter(a=>a!==path)
             }else {
                 this.openNav.push(path)
             }
         }
         //重复率
         if (type==='duplicated'){
             //选中状态以路径加类型
             this.duplicatedChoseItem=path+value.type
             const data=this.duplicatedOpenNav.filter(a=>a===path)
             if (data.length){
                 this.duplicatedOpenNav=this.duplicatedOpenNav.filter(a=>a!==path)
             }else {
                 this.duplicatedOpenNav.push(path)
             }
         }
         //复杂度
         if (type==='complexity'){
             //选中状态以路径加类型
             this.complexityChoseItem=path+value.type
             const data=this.complexityOpenNav.filter(a=>a===path)
             if (data.length){
                 this.complexityOpenNav=this.complexityOpenNav.filter(a=>a!==path)
             }else {
                 this.complexityOpenNav.push(path)
             }
         }

    }

    @action
    choiceBrad=(value,type)=>{
        switch (type){
            case "code":
                this.choseItem=value
                break
            case "duplicated":
                this.duplicatedChoseItem=value
                break
            case "complexity":
                this.complexityChoseItem=value
        }

    }

    /**
     *查询代码内容
     * @param  param
     */
    @action
    findCodeData=async (filePath)=>{
        const param=new FormData()
        param.append("filePath",filePath)
        const res = await Axios.post("/code/findCodeData",param)
        if (res.code!==0&&!res.msg.concat("ticket invalid")){
            message.error(res.msg)
        }
        return res
    }

    /**
     *查询代码
     * @param  param param
     */
    @action
    findCode=async (param,findState)=>{
        const res = await Axios.post("/code/findCode",param)
        if (res.code!==0&&!res.msg.concat("ticket invalid")){
            message.error(res.msg)
        }


        //为查询代码的时候
        if (param.type==='code'){
            if (findState==='child'){
                // 查询为代码子集时候拼接
                this.completeTreeData.push(res.data)
            }else if (findState!=='bread') {
                this.openNav=[]
                this.completeTreeData=[res.data]
            }
        }

        //为查询复杂度
        if (param.type==='complexity'){

            if (findState==='child'){
                // 查询为代码子集时候拼接
                this.complexityTreeData.push(res.data)
            }else if (findState!=='bread') {
                this.complexityOpenNav=[]
                this.complexityTreeData=[res.data]
            }
        }

        //为查询重复率
        if (param.type==='duplicated'){
            if (findState==='child'){
                // 查询为代码子集时候拼接
                this.duplicatedTreeData.push(res.data)
            }else if (findState!=='bread') {
                this.duplicatedOpenNav=[]
                this.duplicatedTreeData=[res.data]
            }
        }
        return res
    }



}
let codeStore=new CodeStore()
export default codeStore;
