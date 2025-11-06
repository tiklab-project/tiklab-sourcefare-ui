import React from "react";
import "./ModalContentTip.scss"
import { applySubscription, disableFunction } from "tiklab-core-ui";
const ModalContentTip = (props) => {
    const {config}=props
    return(
        <div className="enhance-popup-container" /*ref={contentRef}*/>
            <div className="enhance-title">{config?.title}</div>
            <div className="enhance-fea">企业版专属功能</div>
            <div className="enhance-desc">{config?.desc}</div>
            <div className="enhance-button">
                <button
                    className="enhance-button-contact"
                    onClick={() => window.open('https://tiklab.net/contactus')}
                >
                    联系客服
                </button>
                <button
                    className="enhance-button-update"
                    onClick={() => applySubscription('sourcefare')}
                >
                    升级版本
                </button>
            </div>
        </div>
    )

}
export default ModalContentTip
