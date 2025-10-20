/**
 * @name: IssueStatistics
 * @author: limingliang
 * @date: 2025-08-11 14:30
 * @description：问题统计
 * @update: 2025-08-11 14:30
 */
import React,{useState,useEffect,Fragment} from 'react';
import "./Statistics.scss"
import {Select} from "antd";
import {observer} from "mobx-react";
import IssueChart from "./IssueChart";
import IssueTypeChart from "./IssueTypeChart";
const IssueStatistics = (props) => {
    const {projectId,issueStat,treeNav}=props
    const [findType,setFindType]=useState("issueType")
    const [findNum,setFindNum]=useState(7)
    //问题统计
    const [issueData,setIssueData]=useState([])


    useEffect(async() => {
        if (treeNav==='security'||treeNav==='function'||treeNav==='norm'){
            await findStatistics("issueType",findNum)
        }
        if (treeNav==='issue'){
            await findStatistics(findType,findNum)
        }
    }, [treeNav]);


    //查询问题统计
    const findStatistics = (findType,findNum) => {
        issueStat({projectId:projectId,
            findType:findType,
            findNum:findNum
        }).then(res=>{
            setIssueData(res.data)
        })
    }

    //查询问题类型
    const changeIssue = (type,data) => {
        if (type==='findNum'){
            findStatistics(findType,data.value)
            setFindNum(data.value)
        }else {
            findStatistics(data.value,findNum)
            setFindType(data.value)
        }
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
        <div className='scan-statistics-top'>
            <div className='scan-statistics-tab-nav'>
                {
                    treeNav==='issue'&&
                    <Select   onChange={(type,value)=>changeIssue("findType",value)} style={{minWidth:140}} placeholder='查询类型'>
                        <Select.Option value={"issueType"}>{"类型"}</Select.Option>
                        <Select.Option value={"issueLevel"}>{"等级"}</Select.Option>

                    </Select>
                }
                <Select
                    placeholder="查询次数"
                    style={{width:150}}
                    onChange={(type,value)=>changeIssue("findNum",value)}
                >
                    {
                        dateList && dateList.map(item => {
                            return <Select.Option value={item.value} key={item.value}>{item.title}</Select.Option>
                        })
                    }
                </Select>
            </div>
            <div className='graphics-background'>
                {
                    treeNav==='issue'?
                        <IssueChart issueData={issueData}
                                    typeData={findType}

                        />:
                        <IssueTypeChart
                            issueData={issueData}
                            treeNav={treeNav}
                        />
                }
            </div>


        </div>
    )

}
export default observer(IssueStatistics)
