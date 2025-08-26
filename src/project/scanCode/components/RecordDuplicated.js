/**
 * @name: RecordDuplicated
 * @author: limingliang
 * @date: 2025-07-31 14:30
 * @description：重复数据
 * @update: 2025-07-31 14:30
 */
import React,{useState,useEffect,Fragment} from 'react';
import {Col, Layout, Table, Tooltip} from 'antd';
import {observer} from "mobx-react";
import "./RecordDuplicated.scss"
import RenderBread from "../common/RenderBread";
import EmptyText from "../../../common/emptyText/EmptyText";
import CodeStore from "../store/CodeStore";
import {FileTextOutlined, FolderOutlined} from "@ant-design/icons";
import CodeDetails from "../../../common/editor/CodeDetails";
import ScanRecordStore from "../store/ScanRecordStore";
import DuplicatedCode from "../common/DuplicatedCode";
const RecordDuplicated = (props) => {
    const {scanRecord,projectData}=props

    const {findCode,findCodeData}=CodeStore
    const {findRecordDuplicatedList}=ScanRecordStore

    //重复度代码list
    const [duplicatedCodeList,setDuplicatedCodeList]=useState([])
    const [breadList,setBreadList]=useState([])

    //重复度数据list
    const [duplicatedList,setDuplicatedList]=useState([])

    const [findType,setFindType]=useState("folder")
    const [dataList,setDataList]=useState(null)
    const [lines, setLines] = useState([]);

    useEffect(async () => {
        if (projectData){
            getCodeDuplicated(projectData.id)
        }
    }, []);

    const columns =[
        {
            title: '名称',
            dataIndex: 'name',
            key:"name",
            width:'30%',
            ellipsis:true,
            render:(text,record)=>  <div className='cover-nav opt-cover-nav' onClick={()=>openDetails(record)}>
                <div>{fileIcon(record?.type)}</div>
                {text}
            </div>
        },
        {
            title: '重复class',
            dataIndex: 'duplicatedClass',
            key:"duplicatedClass",
            width:'13%',
           /* render:(text,record)=>  <div>
                {text?text:"non"}
            </div>*/
        },
        {
            title: '重复行',
            dataIndex: 'duplicatedLines',
            key:"duplicatedLines",
            width:'13%',
        },
    ]

    //查询重复率
    const getCodeDuplicated = (path) => {
        findCode({
            projectId:projectData.id,
            path:path,
            recordId:scanRecord.id,
            type:"duplicated"
        }).then(res=>{
            if (res.code===0){
                setDuplicatedCodeList(res.data)
            }
        })
    }

    //查询代码内容
    const findCodeDetails = (filePath) => {
        findRecordDuplicatedList({path:filePath}).then(res=>{
            if (res.code===0){
                setDuplicatedList(res.data)
            }
        })

        findCodeData(filePath).then(res=>{
            if (res.code===0){
                const lines = res.data.split("\n")
                setLines(lines)
                setDataList(res.data)
            }
        })
    }



    const breadJump = (index,type) => {
        setFindType("folder")
        if (type){
            setBreadList([])
            getCodeDuplicated(projectData.id)
        }else {
            //移除后面的数据
            const a=breadList.slice(0,index+1)
            setBreadList(a)

            //添加当前选中的数据
            const data=breadList[index];
            getCodeDuplicated(data.path)
        }
    }


    //打开下一级
    const openDetails = (value) => {
        splitFilePath(value)
        setFindType(value.type)
        if (value.type==='file'){
            findCodeDetails(value.path)
        }else {
            getCodeDuplicated(value.path)
        }
    }

    //添加path
    const splitFilePath = (value) => {
        setBreadList([...breadList,value])
    }


    const fileIcon = (type) => {
        switch (type){
            case "folder":
                return   <FolderOutlined />
            case "file":
                return <FileTextOutlined />
        }
    }

    return(
        <div className='duplicated'>
            <div className='duplicated-bread'>
                <RenderBread dataList={breadList}
                             breadJump={breadJump}
                             title={projectData.name}
                />
            </div>
            {
                findType==='folder'?
                    <Table
                        columns={columns}
                        dataSource={duplicatedCodeList}
                        rowKey={record=>record.id}
                        pagination={false}
                        className='scan-tab-top'
                        locale={{emptyText: <EmptyText title={"暂无数据"}/>}}
                    />:
                    <div className='duplicated-code-details'>
                        <DuplicatedCode code={dataList}
                                     data={duplicatedList}
                                     lines={lines}

                        />
                    </div>
            }

        </div>
    )

}
export default observer(RecordDuplicated)
