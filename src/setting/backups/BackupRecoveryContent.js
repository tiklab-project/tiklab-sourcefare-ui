import React,{useEffect} from 'react';
import {BackupRestore} from 'tiklab-security-ui';
import {inject, observer} from "mobx-react";

/**
 * 备份与恢复
 */
const BackupRecoveryContent = (props) => {

    const {projectStore} = props

    const {repositoryPath,getRepositoryPath} = projectStore


    useEffect(async ()=>{
        getRepositoryPath()
    },[])


    return (
        <BackupRestore
            {...props}
            path={repositoryPath}
        />
    )
}


export default inject('projectStore')(observer(BackupRecoveryContent))
