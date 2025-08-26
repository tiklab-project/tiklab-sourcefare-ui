/**
 * @name: DupChart
 * @author: limingliang
 * @date: 2025-08-11 14:30
 * @description：覆盖率统计图表
 * @update: 2025-08-11 14:30
 */
import React,{useEffect,useState,useRef} from 'react';
import echarts from "../../../common/statistics/Echarts";
import {SpinLoading} from "../../../common/loading/Loading";
import {observer} from "mobx-react";
const  DupChart = (props) => {
    const {coverData}=props
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
                data: ['指令覆盖', '分支覆盖','复杂度覆盖', '行覆盖','方法覆盖','类覆盖']
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
                data: coverData?.time
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '指令覆盖',
                    type: 'line',
                    stack: 'Total',
                    data: coverData?.instructions
                },
                {
                    name: '分支覆盖',
                    type: 'line',
                    stack: 'Total',
                    data: coverData?.branch
                },
                {
                    name: '复杂度覆盖',
                    type: 'line',
                    stack: 'Total',
                    data: coverData?.complexity
                },
                {
                    name: '行覆盖',
                    type: 'line',
                    stack: 'Total',
                    data: coverData?.line
                },
                {
                    name: '方法覆盖',
                    type: 'line',
                    stack: 'Total',
                    data: coverData?.method
                },
                {
                    name: '类覆盖',
                    type: 'line',
                    stack: 'Total',
                    data: coverData?.class
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
