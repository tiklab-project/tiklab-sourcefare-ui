import {observable,action} from 'mobx';
import {message} from 'antd';
import {Axios} from 'tiklab-core-ui';

export class StatisticsStore {


    @observable
    projectState=false



    /**
     * 查询项目的统计
     * @param value
     * @returns {Promise<*>}
     */
    @action
    findProjectStat = async () =>{
        const data = await Axios.post('/projectStat/findProjectStat')
        this.projectState=false
        if(data.code!==0){
            message.error(data.msg)
            return
        }
        return data
    }














}
const statisticsEeStore=new StatisticsStore()
export default statisticsEeStore

