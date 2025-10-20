/**
 * @name: IssueChart
 * @author: limingliang
 * @date: 2025-08-11 14:30
 * @description：问题统计图表
 * @update: 2025-08-11 14:30
 */
import React,{useEffect,useState,useRef} from 'react';
import echarts from "../../../common/statistics/Echarts";
import {SpinLoading} from "../../../common/loading/Loading";
import {observer} from "mobx-react";
const  IssueChart = (props) => {
    const {issueData,typeData}=props
    const [state,setState]=useState(false)
    const levelBar = useRef();
    useEffect(() => {
        const dom = levelBar.current;
        setStatisticsData(dom)
    }, [levelBar.current,typeData,issueData])

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
                data: typeData==='issueLevel'?levelData:typesData
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
                data: issueData.time
            },
            yAxis: {
                type: 'value'
            },
            series: typeData==='issueLevel'?levelSeries:typeSeries
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

    const levelData = ['严重问题', '警告问题', '建议问题']
    const typesData = ['安全', '功能', '规范']

    const levelSeries=[
        {
            name: '严重问题',
            type: 'line',
            stack: 'Total',
            data: issueData.severity
        },
        {
            name: '警告问题',
            type: 'line',
            stack: 'Total',
            data: issueData.notice
        },
        {
            name: '建议问题',
            type: 'line',
            stack: 'Total',
            data: issueData.suggest
        }
    ]

    const typeSeries=[
        {
            name: '安全',
            type: 'line',
            stack: 'Total',
            data: issueData.security
        },
        {
            name: '功能',
            type: 'line',
            stack: 'Total',
            data: issueData.function
        },
        {
            name: '规范',
            type: 'line',
            stack: 'Total',
            data: issueData.norm
        }
    ]


    return(
        <div id="problemLevel" ref={levelBar} style={{ height: "400px", marginTop: "15px" }} >
            {
                state&&<SpinLoading type="table"/>
            }
        </div>
    )
}
export default observer(IssueChart)
