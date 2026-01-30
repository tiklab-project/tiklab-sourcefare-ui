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
import CodeTree from "../common/CodeTree";
import codePage from "../../../assets/images/img/code-home-page.png";
import {SpinLoading} from "../../../common/loading/Loading";
import ReportCover from "./ReportCover";
const RecordDuplicated = (props) => {
    const {scanRecord,projectData,setTabType,tabType,allTabType}=props

    const {findCode,findCodeData,duplicatedTreeData,duplicatedOpenNav,duplicatedChoseItem,choiceFile,choiceBrad}=CodeStore
    const {findRecordDuplicatedList}=ScanRecordStore
    const [load,setLoad]=useState(false)

    //重复度代码list
    const [duplicatedCode,setDuplicatedCode]=useState(null);
    const [breadList,setBreadList]=useState([])

    //重复度数据list
    const [duplicatedList,setDuplicatedList]=useState([])

    const [findType,setFindType]=useState("folder")
    const [dataList,setDataList]=useState(null)
    const [lines, setLines] = useState([]);

    //文件夹名称
    const [folderNameList,setFolderNameList]=useState([])
    //代码统计
    const [codeStat,setCodeStat]=useState()

    useEffect(async () => {
        if (projectData){
            getCodeDuplicated(projectData.id)
        }
    }, [projectData]);



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
            render:(text,record)=>  <div className={`${text&&" duplicated-class-num"}`}>
                {text}
            </div>
        },
        {
            title: '重复行',
            dataIndex: 'duplicatedLines',
            key:"duplicatedLines",
            width:'13%',
            render:(text,record)=>  <div className={`${text&&" duplicated-line-num"}`}>
                {text}
            </div>
        },
    ]

    //查询重复率
    const getCodeDuplicated = (path,findState) => {
        setLoad(true)
        const param={
            projectId:projectData.id,
            path:path,
            recordId:scanRecord.id,
            type:"duplicated"
        }

        //查询代码
        findCode(param,findState).then(res=>{
            setLoad(false)
            if (res.code===0){
                setDuplicatedCode(res.data)
            }
        })
    }

    //查询代码内容
    const findCodeDetails = (value) => {
        const filePath=value.path
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
                setDuplicatedCode({
                    fileCount:value?.fileNum,
                    duplicatedClass:value?.duplicatedClass,
                    duplicatedLine:value?.duplicatedLines
                })
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
            choiceBrad(data.path+"folder","duplicated")

            const resultString = a.flatMap(item => item.split('/')).join('/');
            const path=projectData.id+"/"+resultString
            choiceBrad(path+"folder","duplicated")
            getCodeDuplicated(path,"bread")
        }
    }

    const goCodeHome = () => {
        setTabType(tabType)

        setFindType("folder")
        setBreadList([])
        getCodeDuplicated(projectData.id)

        choiceBrad(null,"duplicated")
    }

    //打开下一级
    const openDetails = (value) => {
        setTabType(tabType)

        //添加右侧导航栏
        splitFilePath(value)

        choiceFile(value,"duplicated")
        setFindType(value.type)
        if (value.type==='file'){
            findCodeDetails(value)
        }else {
            getCodeDuplicated(value.path,"child")
        }
    }

    //添加path
    const splitFilePath = (value) => {
        const filePath=value.path

        let folderList=folderNameList
        if (value.name.includes("/")){
            if (folderNameList.length){
                folderList= [...folderNameList,value.name]
            }else {
                folderList= [value.name]
            }
        }

        let data;
        const result = filePath.split('/').slice(1).join('/');
        if (folderList.length){
            const patternRegex = new RegExp(
                `(${folderList.map(p => p.replace(/\//g, '\\/')).join('|')})(?=\\/|$)|[^\\/]+`,
                'g'
            );
            data=result.match(patternRegex) || [];
        }else {
            data=result.split("/")
        }

        //添加
        setBreadList(data)

        //为文件夹时候往FolderNameList 添加数据
        if (value.type!=='file'){
            const name= value.name.includes("/")
            if (name){
                const folderNames=folderNameList.filter(a=>a===value.name)
                if (!folderNames.length){
                    if (folderNameList.length){
                        setFolderNameList([...folderNameList,value.name])
                    }else {
                        setFolderNameList([value.name])
                    }
                }}}
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
            <CodeTree openChild={openDetails}
                      completeTreeData={duplicatedTreeData}
                      openNav={duplicatedOpenNav}
                      choseItem={duplicatedChoseItem}
                      goCodeHome={goCodeHome}
                      title={projectData?.name}
                      tabType={allTabType}
                      setTabType={setTabType}
            />

            {
                allTabType==='duplicated'?
                    <div className="duplicated-page-width">
                        <Col sm={{ span: "24" }}
                             md={{ span: "24" }}
                             lg={{ span: "22"}}
                             xl={{ span: "22", offset: "1" }}
                             xxl={{ span: "20", offset: "2" }}
                        >
                            <div className='duplicated-data'>
                                <div className='duplicated-bread'>
                                    <div onClick={goCodeHome} className='duplicated-bread-icon'>
                                        <Tooltip title='回到库首页' >
                                            <img  src={codePage}  style={{width:23,height:23}}/>
                                        </Tooltip>
                                    </div>
                                    <RenderBread dataList={breadList}
                                                 breadJump={breadJump}
                                                 title={projectData?.name}
                                    />
                                </div>
                                <div className='duplicated-data-info'>
                                    <div className='duplicated-data-nav'>
                                        文件数量
                                        <div className='duplicated-data-nav-num'>{duplicatedCode?.fileCount}</div>
                                    </div>
                                    <div className='duplicated-data-nav'>
                                        重复类
                                        <div className='duplicated-data-nav-num duplicated-class-num'>{duplicatedCode?.duplicatedClass}</div>
                                    </div>
                                    <div className='duplicated-data-nav'>
                                        重复行
                                        <div className='duplicated-data-nav-num duplicated-line-num'>{duplicatedCode?.duplicatedLine}</div>
                                    </div>
                                </div>


                                {
                                    findType==='folder'?
                                        <Table
                                            columns={columns}
                                            dataSource={duplicatedCode?.codeList}
                                            rowKey={record=>record.id}
                                            pagination={false}
                                            className='scan-tab-top'
                                            locale={{emptyText:load ?
                                                    <SpinLoading type="table"/>: <EmptyText title={"暂无数据"}/>}}
                                        />:
                                        <div className='duplicated-code-details'>
                                            <DuplicatedCode code={dataList}
                                                            data={duplicatedList}
                                                            lines={lines}

                                            />
                                        </div>
                                }
                            </div>
                        </Col>
                    </div>:
                    <ReportCover recordId={scanRecord?.id} />
            }

        </div>

    )

}
export default observer(RecordDuplicated)
