/**
 * @name: DupStatistics
 * @author: limingliang
 * @date: 2025-08-11 14:30
 * @description：重复率统计
 * @update: 2025-08-11 14:30
 */
import React,{useState,useEffect,Fragment} from 'react';
import "./Statistics.scss"
import {Select} from "antd";
import {observer} from "mobx-react";
import DupChart from "./DupChart";
const DupStatistics = (props) => {
    const {projectId,duplicatedStat}=props

    const [findNum,setFindNum]=useState(7)
    //重复率统计
    const [duplicatedData,setDuplicatedData]=useState([])


    useEffect(async() => {
        await getDuplicated(findNum)
    }, []);

    //重复率查询
    const getDuplicated = (findNum) => {
        duplicatedStat({projectId:projectId,
            findNum:findNum
        }).then(res=>{
            setDuplicatedData(res.data)
        })
    }

    //切换执行次数
    const changeExecNum = (data) => {
        setFindNum(data)
        getDuplicated(data)
    }

    const dateList = [

        {
            value: "7",
            title: "最近7次"
        },
        {
            value: "14",
            title: "最近14次"
        },
        {
            value: "30",
            title: "最近30次"
        },
        {
            value: "0",
            title: "所有"
        },
    ]
    return(
        <div className="scan-statistics-top">
            <div className='scan-statistics-tab-nav'>
                <Select
                    placeholder="查询次数"
                    style={{width:150}}
                    onChange={(value)=>changeExecNum(value)}
                    defaultValue="7"
                >
                    {
                        dateList && dateList.map(item => {
                            return <Select.Option value={item.value} key={item.value}>{item.title}</Select.Option>
                        })
                    }
                </Select>
            </div>
            <div className='graphics-background'>
                <DupChart duplicatedData={duplicatedData}/>
            </div>

        </div>
    )

}
export default observer(DupStatistics)
