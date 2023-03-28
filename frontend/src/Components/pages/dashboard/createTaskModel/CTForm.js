import React from "react";
import styles from './createTaskModal.module.css'

const CTForm = (props) => {

  return (


    <div className={props.err === "true" ? styles.invalid : styles.formControl}>
      <label htmlFor='name'>{props.label}</label>
      <input className={styles.taskInput} value={props.value} type={props.type} id={props.inputId} multiple onChange={props.onChange} placeholder={props.placeholder} style={{ height: '27px' }} accept={props.accept} />
      <span className={styles.errSpan}>{props.err === "true" ? "Please fill this field" : ""}</span>


    </div>



  );
};

export default CTForm;
