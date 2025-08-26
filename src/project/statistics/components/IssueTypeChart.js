/**
 * @name: IssueTypeChart
 * @author: limingliang
 * @date: 2025-08-11 14:30
 * @description：问题统计图表
 * @update: 2025-08-11 14:30
 */
import React,{useEffect,useState,useRef} from 'react';
import echarts from "../../../common/statistics/Echarts";
import {SpinLoading} from "../../../common/loading/Loading";
import {observer} from "mobx-react";
const  IssueTypeChart = (props) => {
    const {issueData,treeNav}=props
    const [state,setState]=useState(false)
    const levelBar = useRef();
    useEffect(() => {
        const dom = levelBar.current;
        setStatisticsData(dom)
    }, [levelBar.current,issueData])

    /**
     * 处理统计数据
     */
    const setStatisticsData = ( dom) => {
        let myChart = echarts.init(dom);
        let option = {
            tooltip: {
                trigger: 'axis'
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
            series: treeNav==='security'&&securitySeries||treeNav==='reliability'&&reliabilitySeries||treeNav==='maintain'&&maintainSeries
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

    const securitySeries=[  {
        name: '安全',
        type: 'line',
        stack: 'Total',
        data: issueData.security
    }]
    const reliabilitySeries=[{
        name: '可靠性',
        type: 'line',
        stack: 'Total',
        data: issueData.reliability
    }]

    const maintainSeries=[  {
        name: '可维护性',
        type: 'line',
        stack: 'Total',
        data: issueData.maintain
    }]


    return(
        <div id="problemLevel" ref={levelBar} style={{ height: "400px", marginTop: "15px" }} >
            {
                state&&<SpinLoading type="table"/>
            }
        </div>
    )
}
export default observer(IssueTypeChart)
