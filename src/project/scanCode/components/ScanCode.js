/**
 * @name: ScanCode
 * @author: limingliang
 * @date: 2025-07-22 14:30
 * @description：扫描的代码
 * @update: 2025-07-2 14:30
 */
import React,{useState,useEffect,Fragment} from 'react';
import CodeStore from "../store/CodeStore";
import "./ScanCode.scss"
import {FileTextOutlined, FolderOutlined} from "@ant-design/icons";
import CodeDetails from "../../../common/editor/CodeDetails";
import RenderBread from "../common/RenderBread";
import CodeTree from "../common/CodeTree";
import {Col, Spin, Tooltip} from "antd";
import {observer} from "mobx-react";
import codePage from "../../../assets/images/img/code-home-page.png";
const ScanCode = (props) => {
    const {projectId,recordId,projectData}=props
    const {findCode,findCodeData,setStoreValue,choiceFile,completeTreeData,openNav,choseItem,choiceBrad}=CodeStore


    //代码list
    const [codeData,setCodeData]=useState(null)

    const [codeNavList,setCodeNavList]=useState([])

    const [findType,setFindType]=useState("folder")
    const [dataList,setDataList]=useState(null)
    const [lines, setLines] = useState([]);

    //文件夹名称
    const [folderNameList,setFolderNameList]=useState([])
    //代码统计
    const [codeStat,setCodeStat]=useState()

    const [spinState,setSpinState]=useState(false)

    useEffect(async () => {
        setStoreValue("nav",[])
        getCode(projectId)

    }, []);

    //查询代码文件
    const getCode = (path,findType) => {
        setSpinState(true)

        const param={
            projectId:projectId,
            path:path,
            recordId:recordId,
            type:"code"
        }

        //查询代码
        findCode(param,findType).then(res=>{
            if (res.code===0){
                setCodeData(res.data)
            }
            setSpinState(false)
        })

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
        setCodeNavList(data)

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

    //打开openChild
    const openChild = (value) => {
        //添加右侧导航栏
        splitFilePath(value)

        //选中代码目录
        choiceFile(value,"code")
        setFindType(value.type)
        if (value.type==='file'){
            findCodeDetails(value.path)
        }else {
            getCode(value.path,"child")
        }
    }

    //查询代码内容
    const findCodeDetails = (filePath) => {
        findCodeData(filePath).then(res=>{
            if (res.code===0){
                const lines = res.data.split("\n")
                setLines(lines)
                setDataList(res.data)
            }
        })
    }


    //跳转
    const breadJump = (index,type) => {
        setFindType("folder")
        if (type){
            setCodeNavList([])
            getCode(projectId)
        }else {
            //移除后面的数据
            const a=codeNavList.slice(0,index+1)
            setCodeNavList(a)

            const resultString = a.flatMap(item => item.split('/')).join('/');
            const path=projectId+"/"+resultString
            choiceBrad(path+"folder","code")
            getCode(path,"bread")
        }
    }

    const goCodeHome = () => {
        setCodeNavList([])
        getCode(projectId)
        choiceBrad(null,"code")
    }


    return(
        <div className='scan-code'>
            <CodeTree openChild={openChild}
                      completeTreeData={completeTreeData}
                      openNav={openNav}
                      choseItem={choseItem}
                      type={"code"}
                      goCodeHome={goCodeHome}
                      title={projectData?.name}
            />

                <div className="scan-code-page-width">
                    <Col sm={{ span: "24" }}
                         md={{ span: "24" }}
                         lg={{ span: "22"}}
                         xl={{ span: "22", offset: "1" }}
                         xxl={{ span: "20", offset: "2" }}
                    >

                            <div className='scan-code-navi'>
                                <div onClick={goCodeHome} className='scan-code-navi-icon'>
                                    <Tooltip title='回到库首页' >
                                        <img  src={codePage}  style={{width:23,height:23}}/>
                                    </Tooltip>
                                </div>
                                <RenderBread dataList={codeNavList}
                                             breadJump={breadJump}
                                             title={projectData?.name}
                                />
                                {/* {renderCodeBread() }*/}
                            </div>

                            <div className='scan-code-info'>
                                <div className='scan-code-info-nav'>
                                    文件数量
                                    <div className='scan-code-info-nav-num'>{codeData?.fileCount}</div>
                                </div>
                                <div className='scan-code-info-nav'>
                                    严重数量
                                    <div className='scan-code-num-server scan-code-info-nav-num'>{codeData?.severityCount}</div>
                                </div>
                                <div className='scan-code-info-nav'>
                                    错误问题
                                    <div className='scan-code-num-server scan-code-info-nav-num'>{codeData?.errorCount}</div>
                                </div>
                                <div className='scan-code-info-nav'>
                                    警告数量
                                    <div className='scan-code-num-notice scan-code-info-nav-num'>{codeData?.noticeCount}</div>
                                </div>
                                <div className='scan-code-info-nav'>
                                    提示数量
                                    <div className='scan-code-num-suggest scan-code-info-nav-num'>{codeData?.suggestCount}</div>
                                </div>
                            </div>

                            {
                                findType==='folder'?
                                    <Fragment>
                                        <div className='scan-code-title'>
                                            <div className='scan-code-title-name'>名称</div>
                                            <div className='scan-code-title-num'>文件数</div>
                                            <div className='scan-code-title-num'>严重问题</div>
                                            <div className='scan-code-title-num'>错误问题</div>
                                            <div className='scan-code-title-num'>警告问题</div>
                                            <div className='scan-code-title-num'>提示问题</div>
                                        </div>
                                        <Spin  spinning={spinState}>
                                            <div className='scan-code-tab'>
                                            {
                                                codeData?.codeList.length?codeData.codeList.map(item=>{
                                                    return(
                                                        <div key={item.path} className='scan-code-tab-line'>
                                                            <div className='scan-code-tab-name' onClick={()=>openChild(item)}>
                                                                {
                                                                    item.type==='folder'?
                                                                        <div><FolderOutlined/></div>:
                                                                        <div><FileTextOutlined /></div>
                                                                }
                                                                <div> {item.name}</div>
                                                            </div>
                                                            <div className='scan-code-tab-num scan-code-num'>
                                                                {
                                                                    item.type==='folder'?
                                                                        <div>{item.fileNum}</div>:
                                                                        <div>{"Non"}</div>
                                                                }
                                                            </div>
                                                            <div className={`scan-code-tab-num ${item.severityTrouble&&" scan-code-num-server"}`}>{item.severityTrouble}</div>
                                                            <div className={`scan-code-tab-num ${item.errorTrouble&&" scan-code-num-error"}`}>{item.errorTrouble}</div>
                                                            <div className={`scan-code-tab-num ${item.noticeTrouble&&" scan-code-num-notice"}`}>{item.noticeTrouble}</div>
                                                            <div className={`scan-code-tab-num ${item.suggestTrouble&&" scan-code-num-suggest"}`}>{item.suggestTrouble}</div>
                                                        </div>
                                                    )
                                                }):null
                                            }
                                        </div>
                                        </Spin>
                                    </Fragment>:
                                    <div className='scan-code-details'>
                                        <CodeDetails code={dataList}
                                                     lines={lines}
                                                     language={"javaScript"}
                                        />
                                    </div>
                            }

                    </Col>
                </div>
        </div>
    )
}
export default observer(ScanCode)
