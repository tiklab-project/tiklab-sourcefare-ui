import React from 'react';
import './Tabs.scss';

/**
 * 标签
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const Tabs = props =>{

    const {tabLis,type,onClick,dataNum,findType} = props

    //查询项目数量
    const findProjectNum = (value) => {
      return(
          <>
              {value==='viewable'&&
              <span className='xcode-tab-num'>{dataNum?.allNum}</span>||
                  value==='oneself'&&
                  <span className='xcode-tab-num'>{dataNum?.createNum}</span>||
                  value==='collect'&&
                  <span className='xcode-tab-num'>{dataNum?.colletNum}</span>
              }
          </>
      )
    }

    //查询问题统计数量
    const findIssueNum = (value) => {
        return(
            <>
                {value===2&&
                    <span className='xcode-tab-num'>{dataNum?.allNum}</span>||
                    value===0&&
                    <span className='xcode-tab-num'>{dataNum?.unSolveNum}</span>||
                    value===1&&
                    <span className='xcode-tab-num'>{dataNum?.solveNum}</span>
                }
            </>
        )
    }


    return (
        <div className='xcode-tabs'>
            {
                tabLis.map(item=>(
                    <div key={item.id}
                         className={`xcode-tab ${type===item.id?'xcode-active-tab':null}`}
                         onClick={()=>onClick(item)}
                    >
                        {item.title}
                        {

                            findType==="project"&& findProjectNum(item.id)||
                            findType==="issue"&&findIssueNum(item.id)
                        }

                    </div>
                ))
            }
        </div>
    )
}

export default Tabs
