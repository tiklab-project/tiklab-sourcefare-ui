/**
 * @name: SchemeDetailsOption
 * @author: limingliang
 * @date: 2023-7-19 10:30
 * @description：选择关联规则集
 * @update: 2023-07-19 10:30
 */
import React, {useState} from "react";
import {Dropdown, Input, Table, Tooltip} from "antd";
import Btn from "../../../../common/btn/Btn";
import Modal from "../../../../common/modal/Modals";
const SchemeDetailsOption = (props) => {
    const {visible,setVisible,notSchemeRuleSet,scanScheme,createScanSchemeRuleSet}=props

    const [choiceRuleSet,setChoiceRuleSet]=useState([])

    const columns = [
        {
            title: '规则集',
            dataIndex: 'ruleSetName',
            key: 'schemeName',
            width:'50%',
            ellipsis:true,
        },
        {
            title: '描述',
            dataIndex: 'describe',
            key: 'describe',
            width:'50%',
            ellipsis:true,
        },
    ]


    //取消弹窗
    const cancelDrawer = () => {
        setChoiceRuleSet([])
        setVisible(false)
    }

    const onOk = () => {
        if (choiceRuleSet.length>0){
            choiceRuleSet.map(item=>{
                createScanSchemeRuleSet({scanSchemeId:scanScheme.id,scanRuleSet:{id:item}})
            })
            cancelDrawer()
        }
    }

    //选择制品
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setChoiceRuleSet(selectedRowKeys)
        }
    };



    const modalFooter = (
        <>
            <Btn onClick={cancelDrawer} title={'取消'} isMar={true}/>
            <Btn onClick={onOk} title={'确定'} type={'primary'}/>
        </>
    )
    return(
        <Modal
            visible={visible}
            onCancel={cancelDrawer}
            closable={false}
            footer={modalFooter}
            destroyOnClose={true}
            width={600}
            title={"添加规则集"}
        >
            <div>
                <Table
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    dataSource={notSchemeRuleSet}
                    rowKey = {record => record.id}
                    columns={columns}
                    pagination={false}
                />
            </div>
        </Modal>
    )
}
export default SchemeDetailsOption
