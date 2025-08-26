import {observable,action} from 'mobx';
import {message} from 'antd';
import {Axios, getUser} from 'tiklab-core-ui';

export class RepositoryServerStore {

    // 刷新
    @observable
    fresh = false


    /**
     * 创建仓库服务
     * @param value
     * @returns {Promise<void>}
     */
    @action
    createRepositoryServer = async value =>{
        const data = await Axios.post('/RepositoryServer/createRepositoryServer',value)
        if(data.code===0){
            message.info('创建成功',0.5)
            this.fresh = !this.fresh
        }
        return data
    }

    /**
     * 更新仓库服务
     * @param value
     * @returns {Promise<void>}
     */
    @action
    updateRepositoryServer = async value =>{
        const data = await Axios.post('/RepositoryServer/updateRepositoryServer',value)
        if(data.code===0){
            message.info('更新成功',0.5)
            this.fresh = !this.fresh
        }
        return data
    }

    /**
     * 删除仓库服务
     * @param value
     * @returns {Promise<void>}
     */
    @action
    deleteRepositoryServer = async value =>{
        const param=new FormData()
        param.append("id",value)
        const data = await Axios.post('/RepositoryServer/deleteRepositoryServer',param)
        if(data.code===0){
            message.info('删除成功',0.5)
            this.fresh = !this.fresh
        }
    }



    /**
     * 条件分页查询
     * @param value
     * @returns {Promise<void>}
     */
    @action
    findRepositoryServerPage = async param =>{
        const data = await Axios.post('/RepositoryServer/findRepositoryServerPage',param)

        return data
    }

    /**
     * 查询所有
     */
    @action
    findAllRepositoryServer = async () =>{
        const data = await Axios.post('/RepositoryServer/findAllRepositoryServer')

        return data
    }


}

const repositoryServerStore=new RepositoryServerStore()
export default  repositoryServerStore
