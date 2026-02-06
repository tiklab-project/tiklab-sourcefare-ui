
/**
 * @name: compChart
 * @author: limingliang
 * @date: 2025-06-18 14:30
 * @description：复杂度
 * @update: 2025-06-18 14:30
 */
import React,{useEffect,useState,useRef} from 'react';
import echarts from "../../../common/statistics/Echarts";
import {SpinLoading} from "../../../common/loading/Loading";
import {observer} from "mobx-react";
const  compChart = (props) => {
    const {complexityData}=props
    const [state,setState]=useState(false)
    const levelBar = useRef();
    useEffect(() => {
        const dom = levelBar.current;
        setStatisticsData(dom)
    }, [levelBar.current,complexityData])


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
                data: ["exec"]
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
                data:complexityData?.time,
               /* axisLabel: {
                    formatter: function(value) {
                        return value.length > 8 ? value.substring(0, 8) + '...' : value;
                    },
                }*/
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data:complexityData?.size,
                    type:"bar"

                }
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
export default observer(compChart)
