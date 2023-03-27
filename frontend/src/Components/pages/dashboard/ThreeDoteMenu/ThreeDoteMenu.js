import React from 'react';
import styles from './ThreeDoteMenu.module.css';
const ThreeDoteMenu = (props) => {
    const renameHandler = () => {
        props.renameListHandler()
}
    return (
        <div className={styles.buttonContainerTDM}
            style={{
                top: props.modelPosition.y,
                left: props.modelPosition.x,
                opacity:"1"
            }}>
            <div>
                <button className={styles.buttonGroupTDM} style={{
                    backgroundColor: '#4CAF50',
                }}
                    onClick={renameHandler}>Rename</button>
                <button className={styles.buttonGroupTDM} style={{
                    backgroundColor: '#f44336',
                }}
                    onClick={props.deleteListHandler}>Delete</button>
                <button className={styles.buttonGroupTDM} style={{
                    backgroundColor: '#828282',
                }} onClick={() => {
                    props.toggleThreeDoteOpen();
                }}>Cancel</button>
            </div>
        </div>
    );
}

export default ThreeDoteMenu;