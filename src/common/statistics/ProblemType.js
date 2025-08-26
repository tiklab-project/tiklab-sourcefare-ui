/**
 * @name: ProblemType
 * @author: limingliang
 * @date: 2025-06-18 14:30
 * @description：问题类型
 * @update: 2025-06-18 14:30
 */
import React,{useEffect,useState,useRef} from 'react';
import echarts from "./Echarts";
import {SpinLoading} from "../loading/Loading";
import {observer} from "mobx-react";
const ProblemType = (props) => {
    const {scanRecordStat}=props
    const [state,setState]=useState(false)
    const problemTypeBar = useRef();


    useEffect(() => {
        const dom = problemTypeBar.current;
        setStatisticsData(dom)
    }, [problemTypeBar.current])

    /**
     * 处理统计数据
     */
    const setStatisticsData = ( dom) => {
        let myChart = echarts.init(dom);
        let option = {
            title: {text: '问题类型分布'},
            legend: {top: '5%', left: 'center'},
            series: [
                {
                    type: 'pie',

                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },

                    labelLine: {
                        show: false
                    },
                    data: scanRecordStat?.typeList
                }
            ]
        }
        myChart.setOption(option);

        // 监听窗口大小变化
        const handleResize = () => {
            myChart.resize();
        };
        window.addEventListener('resize', handleResize);
        // 清理事件监听器
        return () => {
            window.removeEventListener('resize', handleResize);
            myChart.dispose(); // 卸载 ECharts 实例
        };
    }


    return(
        <div id="problemType" ref={problemTypeBar} style={{ height: "400px", marginTop: "15px" }} >
            {
                state&&<SpinLoading type="table"/>
            }
        </div>
    )
}
export default observer(ProblemType)
