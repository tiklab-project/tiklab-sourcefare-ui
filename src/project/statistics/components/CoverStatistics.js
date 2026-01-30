/**
 * @name: DupStatistics
 * @author: limingliang
 * @date: 2025-08-11 14:30
 * @description：覆盖率统计
 * @update: 2025-08-11 14:30
 */
import React,{useState,useEffect,Fragment} from 'react';
import "./Statistics.scss"
import {Select} from "antd";
import {observer} from "mobx-react";
import CoverChart from "./CoverChart";
const DupStatistics = (props) => {
    const {projectId,coverStat}=props

    const [findNum,setFindNum]=useState(7)
    //覆盖率统计
    const [coverData,setCoverData]=useState([])


    useEffect(async() => {
        await getCoverStat(findNum)
    }, []);

    //覆盖率查询
    const getCoverStat = (findNum) => {
        coverStat({projectId:projectId,
            findNum:findNum
        }).then(res=>{
            setCoverData(res.data)
        })
    }

    //切换执行次数
    const changeExecNum = (data) => {
        setFindNum(data)
        getCoverStat(data)
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
                <CoverChart coverData={coverData}/>
            </div>
        </div>
    )

}
export default observer(DupStatistics)
