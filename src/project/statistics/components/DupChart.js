/**
 * @name: DupChart
 * @author: limingliang
 * @date: 2025-08-11 14:30
 * @description：重复率统计图表
 * @update: 2025-08-11 14:30
 */
import React,{useEffect,useState,useRef} from 'react';
import echarts from "../../../common/statistics/Echarts";
import {SpinLoading} from "../../../common/loading/Loading";
import {observer} from "mobx-react";
const  DupChart = (props) => {
    const {duplicatedData}=props
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
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['重复行', '重复文件']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: duplicatedData?.time
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '重复行',
                    type: 'line',
                    stack: 'Total',
                    data: duplicatedData?.lines
                },
                {
                    name: '重复文件',
                    type: 'line',
                    stack: 'Total',
                    data: duplicatedData?.files
                },
            ]
        };
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
export default observer(DupChart)
