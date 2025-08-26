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
                             <pre className='code-line-error'  ref={sectionRef}>
                                 <div>
                                     {
                                         reqDetails?.problemLevel===1&&
                                         <div className='line-error-leve-1'>严重</div>||
                                         reqDetails?.problemLevel===2&&
                                         <div className='line-error-leve-2'>警告</div>||
                                         reqDetails?.problemLevel===3&&
                                         <div className='line-error-leve-2'>提示</div>
                                     }
                                 </div>
                                 <div> { reqDetails?.problemDesc}</div>
                                  <div className='error-line' id={"error"} >错误行{reqDetails?.problemLine}</div>
                             </pre>
                         }
                     </div>
                 </div>


             ))}
           {/*  <code ref={codeRef} className={` language-${language} `}>
                {code}
            </code>*/}

        </pre>
    );
}

export default observer(Highlighter)
