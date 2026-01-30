import {observer} from "mobx-react";

import "./NavigationImage"
import React, {useEffect, useState} from "react";
import maven from "../../assets/images/img/maven.png"
import node from "../../assets/images/img/node.png"
import jdk from "../../assets/images/img/jdk.png"
import go from "../../assets/images/img/go.png"
import python from "../../assets/images/img/python.png"
import net from "../../assets/images/img/net.png"
import gitpuk from "../../assets/images/img/gitPuk.png"
import gitee from "../../assets/images/img/gitee.png"
import gitlab from "../../assets/images/img/gitlab.png"
import gitea from "../../assets/images/img/gitea.png"
import url from "../../assets/images/img/url.png"
import enterprise from "../../assets/images/img/enterprise.png"
const Images = (props) => {
    const {type,width,height}=props
    const [imgPath,setImagPath]=useState()

    useEffect(()=> {
        switch (type){
            case "maven":
                setImagPath(maven)
                break
            case "jdk":
                setImagPath(jdk)
                break
            case "node":
                setImagPath(node)
                break
            case "go":
                setImagPath(go)
                break
            case "python":
                setImagPath(python)
                break
            case "net":
                setImagPath(net)
                break
            case "gitpuk":
                setImagPath(gitpuk)
                break
            case "gitee":
                setImagPath(gitee)
                break
            case "gitlab":
                setImagPath(gitlab)
                break
            case "url":
                setImagPath(url)
                break
            case "gitea":
                setImagPath(gitea)
                break
            case "enter":
                setImagPath(enterprise)
                break

        }
    }, [type])

    return(
        <img  src={imgPath}  style={{width:width,height:height}}/>
    )

}
export default observer(Images)
