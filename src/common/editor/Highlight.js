import React,{ useEffect ,useRef,useState} from 'react';
import  hljs from 'highlight.js/lib/core';
//import 'highlight.js/styles/default.css';
import 'highlight.js/styles/github.css';
import "./Highlight.scss"

import javascript from 'highlight.js/lib/languages/javascript'
import {observer} from "mobx-react";


// 注册语言
hljs.registerLanguage('javascript', javascript);
const Highlighter = props => {

    const {language,code,lines,reqDetails,visible} = props
    const codeRef = useRef([]);
    const sectionRef = useRef(null); // 创建一个引用，用于定位目标位置


    useEffect(() => {
        if (code){
            if (codeRef.current) {
                codeRef.current.forEach((block) => {
                    if (block) {
                        hljs.highlightElement(block);
                    }
                });
            }
        }
    }, [code,codeRef.current]);


    useEffect(() => {
        if (visible){
            changeAnchor()
        }
    }, [visible,sectionRef.current]);

    const changeAnchor = () =>{
        const scrollTop= sectionRef.current
        if (scrollTop){
            sectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    return (
        <pre>
           {lines.map((line, index) => (
                    <div>
                        <div className='code-line'>
                            <div key={`line-number-${index}`}>{index + 1}</div>
                            <code
                                key={index}
                                ref={(el) => (codeRef.current[index] = el)} // 将每行代码的引用存储到数组中
                                className={`language-${language} code-line-text`}
                            >
                                {line}
                            </code>
                        </div>
                        <div>
                            {
                                index+1===reqDetails?.problemLine&&
                                <div className='code-line-error'  ref={sectionRef}>
                                    <div className='code-line-error-lin code-line-error-top'>
                                        <div className='code-line-error-title'>{"问题等级:"}</div>
                                        {
                                            reqDetails?.problemLevel===1&&
                                            <div className='line-error-leve-1'>严重</div>||
                                            reqDetails?.problemLevel===2&&
                                            <div className='line-error-leve-2'>错误</div>||
                                            reqDetails?.problemLevel===3&&
                                            <div className='line-error-leve-3'>警告</div>||
                                            reqDetails?.problemLevel===4&&
                                            <div className='line-error-leve-4'>提示</div>
                                        }
                                    </div>
                                    <div className='code-line-error-lin code-line-error-top'>
                                        <div className='code-line-error-title'>{"错误行: "}</div>
                                        <div>{reqDetails?.problemLine}</div>
                                    </div>
                                    <div className='code-line-error-lin code-line-error-top'>
                                        <div className='code-line-error-title'>{"问题描述: "}</div>
                                        <pre>
                                       <code>{reqDetails?.problemDesc?.trimStart()}</code>
                                   </pre>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                ))}
        </pre>
    );
}

export default observer(Highlighter)
