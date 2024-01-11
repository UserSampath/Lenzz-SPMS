import React, { useState } from 'react'
import axios from 'axios';
import { connect } from "react-redux";
import { renameList } from "../../../../actions";
import styles from './renameListModal.module.css'

import { useRef, useEffect } from 'react';
const RenameListModel = (props) => {
    const [listTitle, setListTitle] = useState(" ")
    const inputRef = useRef(null);
    const [isEmpty, setIsEmpty] = useState(false)

    useEffect(() => {
        inputRef.current.focus();
        setListTitle(props.title);
    }, [props.title]);

    const handleRename = async () => {
        try {
            if (listTitle !== "") {
                const response = await axios.put(`http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:4000/renameProgressStage/${props.listID}`, { title: listTitle });
                
                const data = { listId: props.listID, listTitle }
                props.dispatch(renameList(data));
                props.toggleRenameListModal();
            }
        } catch (err) {
            console.error(err);
        }
    };
    const handleCancel = () => {
        props.toggleRenameListModal();
    };
    const listTitleHandler = (event) => {
        setListTitle(event.target.value);
        if (event.target.value === "") {
            setIsEmpty(true);
        } else {
            setIsEmpty(false);
        }

    }
    return (
        <div className={styles.modal}>
            <div onClick={props.toggleRenameListModal} className={styles.overlay}></div>
            <div className={styles.modalContent}>
                <div style={{ marginBottom: '10px' }}>
                    <label className={styles.label}>Progress stage name:</label>
                    <input type="text" value={listTitle} onChange={listTitleHandler} ref={inputRef}
                        className={styles.input} />
                    <div className={styles.buttonsContainer}>
                        <button onClick={handleRename} className={styles.button} style={{ backgroundColor: '#007bff', marginRight: '10px' }}>Rename</button>
                        <button onClick={handleCancel} className={styles.button} style={{ backgroundColor: '#dc3545' }}>Cancel</button>
                    </div >
                    {isEmpty && (
                        <div className={styles.empty} >
                            <p className={styles.errMsg}>Progress stage can not be empty.</p>
                        </div>)}
                </div>
            </div>
        </div>
    )
}

export default connect()(RenameListModel)