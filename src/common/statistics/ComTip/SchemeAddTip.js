/**
 * @Description:
 * @Author: gaomengyuan
 * @Date: 2025/8/8
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/8/8
 */
import React from "react";
import "./SchemeAddTip.scss";
import {applySubscription,disableFunction} from "tiklab-core-ui";
const SchemeAddTip = (props) => {

    const {title,data} = props;

    const disable = disableFunction();

    return disable && (
        <div className="arbess-enhance-entrance-modal">
            <div className='enhance-entrance-modal'>
                <div className='enhance-entrance-modal-content'>
                    <div className='enhance-popup-container'>
                        <div className="enhance-title">
                            {title}
                        </div>
                        <div className='enhance-desc'>企业版专属功能</div>
                        <div className='enhance-desc-text'>{data}</div>
                        <div className='enhance-button'>
                            <div className='enhance-button-contact'  onClick={()=>window.open('https://tiklab.net/contactus')}>
                                咨询购买
                            </div>
                            <div className='enhance-button-update'   onClick={()=>applySubscription('hadess')}>
                                立即购买
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SchemeAddTip
