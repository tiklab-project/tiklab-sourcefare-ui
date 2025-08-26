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
const ScanCode = (props) => {
    const {projectId,recordId,projectData}=props
    const {findCode,findCodeData}=CodeStore


    //代码list
    const [codeList,setCodeList]=useState([])

    const [codeNavList,setCodeNavList]=useState([])

    const [findType,setFindType]=useState("folder")
    const [dataList,setDataList]=useState(null)
    const [lines, setLines] = useState([]);

    useEffect(async () => {
        if (projectData){
            getCode(projectId)
        }
    }, [projectData]);

    //查询代码文件
    const getCode = (path) => {
        findCode({
            projectId:projectId,
            path:path,
            recordId:recordId,
            type:"code"
        }).then(res=>{
            if (res.code===0){
                setCodeList(res.data)
            }
        })
    }

    //添加path
    const splitFilePath = (value) => {
        setCodeNavList([...codeNavList,value])
    }

    //打开openChild
    const openChild = (value) => {
        splitFilePath(value)
        setFindType(value.type)
        if (value.type==='file'){
            findCodeDetails(value.path)
        }else {
            getCode(value.path)
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

            //添加当前选中的数据
            const data=codeNavList[index];
            getCode(data.path)
        }
    }



    /**
     * 渲染文件目录
     * @param name：路由截取部分，继承fileAddress
     * @returns {*}
     */
    const renderCodeBread = () => {
        return (
            <Fragment>
                <div className={`${codeNavList.length&&"bread-item"}`} onClick={()=>breadJump(0,"home")}>{projectData?.name}</div>
                {
                    codeNavList.length>0 && codeNavList.map((item,index)=>{
                        return <Fragment key={index}>
                            <div className='bread-item'> > </div>
                            <div className={`${codeNavList.length!==index+1&&"bread-item"}`} onClick={()=>breadJump(index)}>
                                {item.name}
                            </div>
                        </Fragment>
                    })
                }
            </Fragment>

        )
    }


    return(
        <div className='scan-code'>
            <div className='scan-code-navi'>
                <RenderBread dataList={codeNavList}
                             breadJump={breadJump}
                             title={projectData?.name}
                />
               {/* {renderCodeBread() }*/}
            </div>

            {
                findType==='folder'?
                    <Fragment>
                        <div className='scan-code-title'>
                            <div className='scan-code-title-name'>名称</div>
                            <div className='scan-code-title-num'>文件数</div>
                            <div className='scan-code-title-num'>严重问题</div>
                            <div className='scan-code-title-num'>警告问题</div>
                            <div className='scan-code-title-num'>提示问题</div>
                        </div>
                        <div className='scan-code-tab'>
                            {
                                codeList.length?codeList.map(item=>{
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
                                            <div className='scan-code-tab-num scan-code-num-server'>{item.severityTrouble}</div>
                                            <div className='scan-code-tab-num scan-code-num-notice'>{item.noticeTrouble}</div>
                                            <div className='scan-code-tab-num scan-code-num-suggest'>{item.suggestTrouble}</div>
                                        </div>
                                    )
                                }):null
                            }
                        </div>
                    </Fragment>:
                    <div className='scan-code-details'>
                        <CodeDetails code={dataList}
                                     lines={lines}
                                     language={"javaScript"}
                        />
                    </div>
            }
        </div>
    )
}
export default ScanCode
