import React, {useEffect, useState} from "react";
import "./NavigationImage.scss"

import repository_white from "../../assets/images/img/repository-white.png";
import repository_black from "../../assets/images/img/repository-black.png";


import more_black from "../../assets/images/img/more-black.png"
import more_white from "../../assets/images/img/more-white.png"

import {observer} from "mobx-react";
const NavigationImage = (props) => {
    const {theme,icon,type}=props

    const [imgPath,setImagPath]=useState()
    useEffect(()=> {
        if (theme==='gray'||theme==='default'){
            switch (icon){
                case "project":
                    setImagPath(repository_black)
                    break
                case "more":
                    setImagPath(more_black)
                    break
            }

        }else {
            switch (icon){
                case "project":
                    setImagPath(repository_white)
                    break
                case "more":
                    setImagPath(more_white)
                    break
            }
        }
    }, [theme])





    return(
        <img  src={imgPath}  className={`${type}-size`}/>
    )

}
export default observer(NavigationImage)
