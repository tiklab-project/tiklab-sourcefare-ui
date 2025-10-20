/**
 * 渲染文件目录
 * @param name：路由截取部分，继承fileAddress
 * @returns {*}
 */
import React,{Fragment} from 'react';
import "./RenderBread.scss"
const RenderBread = (props) => {
    const {dataList,breadJump,title}=props
    return (
        <Fragment>
            <div className="bread-item-name" onClick={()=>breadJump(0,"home")}>{title}</div>
            {
                dataList.length>0 && dataList.map((item,index)=>{
                    return <Fragment key={index}>
                        <div className='render-bread-item'> > </div>
                        <div className={`${dataList.length!==index+1&&"bread-item-name"}`} onClick={()=>breadJump(index)}>
                            {item}
                        </div>
                    </Fragment>
                })
            }
        </Fragment>

    )
}
export default RenderBread
