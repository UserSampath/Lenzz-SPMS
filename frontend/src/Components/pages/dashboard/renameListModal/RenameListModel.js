import React, { useState } from 'react'
import axios from 'axios';
import { connect } from "react-redux";
import { renameList } from "../../../../actions";

// import "./renameListModal.css"
import { useRef, useEffect } from 'react';
const RenameListModel = (props) => {
    const [listTitle, setListTitle] = useState(" ")
    const inputRef = useRef(null);
    const [isEmpty, setIsEmpty] = useState(false)

    useEffect(() => {
        inputRef.current.focus();
        setListTitle(props.title);
    }, []);

    const handleRename = async () => {
        try {
            if (listTitle !== "") {
                const response = await axios.put(`http://localhost:4000/renameProgressStage/${props.listID}`, { title: listTitle });
                console.log(response.data);
                // dispatch(addCard(res.data));
                const data = { listId: props.listID, listTitle }
                props.dispatch(renameList(data));

                props.toggleRenameListModal();
            }
        } catch (err) {
            console.error(err); // handle error response
        }

    };

    const handleCancel = () => {
        props.toggleRenameListModal();
    };
    const listTitleHandler = (event) => {
        setListTitle(event.target.value);
        console.log(listTitle)
        if (event.target.value === "") {
            setIsEmpty(true);
        } else {
            setIsEmpty(false);

        }

    }
    return (
        <div className="modal">
            <div onClick={props.toggleRenameListModal} className="overlay"></div>
            <div className="modal-content">
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '16px', fontWeight: 'bold' }}>Progress stage name:</label>
                    <input type="text" value={listTitle} onChange={listTitleHandler} ref={inputRef} style={{ padding: '10px', fontSize: '16px', borderRadius: '3px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }} />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
                        <button onClick={handleRename} style={{ padding: '10px 15px', fontSize: '16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '10px' }}>Rename</button>
                        <button onClick={handleCancel} style={{ padding: '10px 15px', fontSize: '16px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Cancel</button>

                    </div >
                    {isEmpty && (
                        <div className="aa" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f2dede', color: 'red', marginTop: '10px', padding: '10px', borderRadius: '3px', border: '1px solid #ebccd1' }}>

                            <p style={{ margin: '0', fontSize: '16px' }}>Progress stage can not be empty.</p>

                        </div>)}
                </div>
            </div>
        </div>
    )
}

export default connect()(RenameListModel)