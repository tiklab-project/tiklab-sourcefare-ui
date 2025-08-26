/**
 * 代码详情
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
import React,{ useEffect ,useRef,useState} from 'react';
import  hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github.css';
import javascript from 'highlight.js/lib/languages/javascript'
import {observer} from "mobx-react";
import "./CodeDetails.scss"

// 注册语言
hljs.registerLanguage('javascript', javascript);
const CodeDetails = (props) => {
    const {language,code,lines,data} = props
    const codeRef = useRef([]);

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



    return(
        <pre>
             {lines.map((line, index) => (
                 <div >
                     <div className='code-line'>
                         <div key={`line-number-${index}`} className='code-line-num'>{index + 1}</div>
                         <code
                             key={index}
                             ref={(el) => (codeRef.current[index] = el)} // 将每行代码的引用存储到数组中
                             className={`language-${language} code-line-text`}
                         >
                             {line}
                         </code>
                     </div>
                 </div>
             ))}
        </pre>
    )
}
export default observer(CodeDetails)
