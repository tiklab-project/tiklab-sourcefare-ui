
/**
 * @name: ProblemLevel
 * @author: limingliang
 * @date: 2025-06-18 14:30
 * @description：覆盖数量
 * @update: 2025-06-18 14:30
 */
import React,{useEffect,useState,useRef} from 'react';
import echarts from "./Echarts";
import {SpinLoading} from "../loading/Loading";
import {observer} from "mobx-react";
const  CoverNum = (props) => {
    const {cover}=props
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
                text: '覆盖数量'
            },
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
                data:["指令覆盖","分支覆盖","复杂度","覆盖行","覆盖方法","覆盖类",],
                axisLabel: {
                    formatter: function(value) {
                        return value.length > 8 ? value.substring(0, 8) + '...' : value;
                    },
                    /*   rotate: 30 // 可选，旋转标签以便更好地显示*/
                }
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data:[cover?.instructionsCover,cover?.branchCover,
                        cover?.complexityCover,cover?.lineCover,cover?.methodsCover,cover?.classesCover],
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
export default observer(CoverNum)
