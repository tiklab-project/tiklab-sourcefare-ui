/**
 * @name: ReportComplexity
 * @author: limingliang
 * @date: 2025-07-31 14:30
 * @description：复杂度数据
 * @update: 2025-07-31 14:30
 */
import React,{useState,useEffect,Fragment} from 'react';
import {Col, Layout, Table, Tooltip} from 'antd';
import "./ReportComplexity.scss"
import {observer} from "mobx-react";
import RenderBread from "../common/RenderBread";
import EmptyText from "../../../common/emptyText/EmptyText";
import {FileTextOutlined, FolderOutlined} from "@ant-design/icons";
import CodeStore from "../store/CodeStore";
import CodeTree from "../common/CodeTree";
import DuplicatedCode from "../common/DuplicatedCode";
import codePage from "../../../assets/images/img/code-home-page.png";
import {SpinLoading} from "../../../common/loading/Loading";
import ReportCover from "./ReportCover";
const ReportComplexity = (props) => {
    const {scanRecord,projectData,allTabType,tabType,setTabType}=props

    const {findCode,findCodeData,complexityTreeData,complexityOpenNav,complexityChoseItem,choiceFile,choiceBrad}=CodeStore

    const [complexityCode,setComplexityCode]=useState(null)
    const [breadList,setBreadList]=useState([])

    const [load,setLoad]=useState(false)
    const [findType,setFindType]=useState("folder")
    const [dataList,setDataList]=useState(null)
    const [lines, setLines] = useState([]);

    //文件夹名称
    const [folderNameList,setFolderNameList]=useState([])


    useEffect(async () => {
        if (projectData){
            getCodeComplexity(projectData.id)
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
            title: '复杂度',
            dataIndex: 'complexityNum',
            key:"complexityNum",
            width:'13%',
            render:(text,record)=>  <div className={`${text&&" complexity-num"}`}>
                {text}
            </div>
        },
    /*    {
            title: '代码行数(非空代码行)',
            dataIndex: 'codeLineNon',
            key:"codeLineNon",
            width:'13%',
            render:(text,record)=>  <div className={`${text&&" complexity-line-num"}`}>
                {text}
            </div>
        },*/
    ]


    //查询代码扫描的复杂度
    const getCodeComplexity = (path,findState) => {
        setLoad(true)
        const param={
            projectId:projectData.id,
            path:path,
            recordId:scanRecord.id,
            type:"complexity"
        }

        //查询代码
        findCode(param,findState).then(res=>{
            setLoad(false)
            if (res.code===0){
                setComplexityCode(res.data)
            }
        })
    }

    //查询代码内容
    const findCodeDetails = (value) => {
        const filePath=value.path
        findCodeData(filePath).then(res=>{
            if (res.code===0){
                const lines = res.data.split("\n")
                setLines(lines)
                setDataList(res.data)
                setComplexityCode({
                    fileCount:value?.fileNum,
                    complexityNum:value?.complexityNum
                })
            }
        })
    }

    //打开下一级
    const openDetails = (value) => {
        setTabType(tabType)
        choiceFile(value,"complexity")

        setFindType(value.type)
        splitFilePath(value)


        if (value.type==='file'){
            findCodeDetails(value)
        }else {
            getCodeComplexity(value.path,"child")
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

    //跳转
    const breadJump = (index,type) => {
        setFindType("folder")
        if (type){
            setBreadList([])
            getCodeComplexity(projectData.id)
        }else {
            //移除后面的数据
            const a=breadList.slice(0,index+1)
            setBreadList(a)


            const resultString = a.flatMap(item => item.split('/')).join('/');
            const path=projectData.id+"/"+resultString
            choiceBrad(path+"folder","complexity")
            getCodeComplexity(path,"bread")
        }
    }

    const fileIcon = (type) => {
        switch (type){
            case "folder":
                return   <FolderOutlined />
            case "file":
                return <FileTextOutlined />
        }
    }


    const goCodeHome = () => {
        setTabType(tabType)

        setFindType("folder")
        setBreadList([])
        getCodeComplexity(projectData.id)
        choiceBrad(null,"complexity")
    }
    return(
        <div className='complexity'>
            <CodeTree openChild={openDetails}
                      completeTreeData={complexityTreeData}
                      openNav={complexityOpenNav}
                      choseItem={complexityChoseItem}
                      goCodeHome={goCodeHome}
                      title={projectData?.name}
                      tabType={allTabType}
                      setTabType={setTabType}
            />
            {
                allTabType==='complexity'?
                    <div className="complexity-page-width">
                        <Col sm={{ span: "24" }}
                             md={{ span: "24" }}
                             lg={{ span: "22"}}
                             xl={{ span: "22", offset: "1" }}
                             xxl={{ span: "20", offset: "2" }}
                        >
                            {

                            }
                            <div className='complexity-data'>
                                <div className='complexity-bread'>
                                    <div onClick={goCodeHome} className='complexity-bread-icon'>
                                        <Tooltip title='回到库首页' >
                                            <img  src={codePage}  style={{width:23,height:23}}/>
                                        </Tooltip>
                                    </div>
                                    <RenderBread dataList={breadList}
                                                 breadJump={breadJump}
                                                 title={projectData?.name}
                                    />
                                </div>

                                <div className='complexity-data-info'>
                                    <div className='complexity-data-nav'>
                                        文件数量
                                        <div className='complexity-data-nav-num'>{complexityCode?.fileCount}</div>
                                    </div>
                                    <div className='complexity-data-nav'>
                                        复杂度
                                        <div className='complexity-data-nav-num complexity-num'>{complexityCode?.complexityNum}</div>
                                    </div>
                                    {/*<div className='complexity-data-nav'>
                                非空代码行
                                <div className='complexity-data-nav-num complexity-line-num'>{complexityCode?.lineNonCount}</div>
                            </div>*/}
                                </div>

                                {
                                    findType==='folder'?
                                        <Table
                                            columns={columns}
                                            dataSource={complexityCode?.codeList}
                                            rowKey={record=>record.id}
                                            pagination={false}
                                            className='scan-tab-top'
                                            locale={{emptyText:load ?
                                                    <SpinLoading type="table"/>: <EmptyText title={"暂无数据"}/>}}
                                        />:
                                        <div className='complexity-code-details'>
                                            <DuplicatedCode code={dataList}
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
export default observer(ReportComplexity)
