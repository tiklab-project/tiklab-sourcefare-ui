/**
 * @name: ProblemLevel
 * @author: limingliang
 * @date: 2025-06-18 14:30
 * @description：问题等级图表
 * @update: 2025-06-18 14:30
 */
import React,{useEffect,useState,useRef} from 'react';
import echarts from "./Echarts";
import {SpinLoading} from "../loading/Loading";
import {observer} from "mobx-react";
const  ProblemLevel = (props) => {
    const {scanRecordStat}=props
    const [state,setState]=useState(false)
    const levelBar = useRef();
    useEffect(() => {
        const dom = levelBar.current;
        setStatisticsData(dom)
    }, [levelBar.current])


    /**
     * 处理统计数据
     */
    const setStatisticsData = ( dom) => {
        let myChart = echarts.init(dom);
        let option = {
             title: {
                 text: '问题严重等级分布'
             },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ["level"]
            },

            xAxis: {
                type: 'value',
            },
            yAxis: {
                type: 'category',
                data: ['严重问题', '警告问题', '建议问题']
            },
            series: [
                {
                    type: 'bar',
                    data: [scanRecordStat?.severityTrouble, scanRecordStat?.noticeTrouble, scanRecordStat?.suggestTrouble]
                },
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
        <div id="problemLevel" ref={levelBar} style={{ height: "400px", marginTop: "15px" }} >
            {
                state&&<SpinLoading type="table"/>
            }
        </div>
    )
}
export default observer(ProblemLevel)
