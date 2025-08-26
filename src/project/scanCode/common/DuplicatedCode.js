/**
 * 渲染文件目录
 * @param props
 * @returns {*}
 */
import React,{ useEffect ,useRef,useState} from 'react';
import "./DuplicatedCode.scss"
const DuplicatedCode = (props) => {
    const {language,code,lines,data} = props

    return(
        <pre>
            {lines.map((line, index) => (
                <div>
                    <div className='duplicated-code'>
                        <div key={`line-number-${index}`} className='code-line-num'>{index + 1}</div>
                        <code
                            key={index}
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
export default DuplicatedCode
