import React from "react";
import "./ModalContentTip.scss"
import { applySubscription, disableFunction } from "tiklab-core-ui";
const ModalContentTip = (props) => {
    const {config,applySystem,closeVisible}=props
    return(
        <div className="enhance-popup-container" /*ref={contentRef}*/>
            <div className="enhance-title">{config?.title}</div>
            <div className="enhance-fea">企业版专属功能</div>
            <div className="enhance-desc">{config?.desc}</div>
            {
                applySystem?.status===1&&
                <div className='enhance-desc-ex'>
                    {`免费体验中(剩余:${applySystem?.remainingTime})`}
                </div>
            }
            <div className="enhance-button">
                {
                    applySystem?.status===1?
                        <button
                            className="enhance-button-contact"
                            onClick={closeVisible}
                        >
                            确认
                        </button>:
                        <button
                            className="enhance-button-contact"
                            onClick={() => window.open('https://tiklab.net/contactus')}
                        >
                            免费体验
                        </button>
                }
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
