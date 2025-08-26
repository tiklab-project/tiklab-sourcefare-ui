/**
 * @name: ScanPlayExec
 * @author: limingliang
 * @date: 2025-06-18 14:30
 * @description：扫描计划执行时间统计
 * @update: 2025-06-18 14:30
 */
import React,{useEffect,useState,useRef} from 'react';
import echarts from "./Echarts";
import {SpinLoading} from "../loading/Loading";
import {observer} from "mobx-react";
const ScanPlayExecTime = (props) => {
    const {scanPlayStat}=props
    const playExecTime = useRef();

    useEffect(() => {
        const dom = playExecTime.current;
        setStatisticsData(dom)
    }, [playExecTime.current])

    const setStatisticsData = (dom) => {
        echarts.dispose(dom)
        let myChart = echarts.init(dom);
        let option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ["execTime"]
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
                data:scanPlayStat?.timeList,
               /* axisLabel: {
                    formatter: function(value) {
                        return value.length > 8 ? value.substring(0, 8) + '...' : value;
                    },
                    /!*   rotate: 30 // 可选，旋转标签以便更好地显示*!/
                }*/
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data:scanPlayStat?.timeNumList,
                    type:"line"

                }
            ]
        };
        myChart.setOption(option);
    }

    return(
        <div id="playExecTime" ref={playExecTime} style={{ height: "400px", marginTop: "15px" }} >
            <SpinLoading type="table"/>
        </div>
    )

}
export default observer(ScanPlayExecTime)
