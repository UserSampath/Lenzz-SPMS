import React from "react";
import styles from './createTaskModal.module.css'

const CTForm = (props) => {
const errorType=()=>{
if(props.err==='true'){
 return 'Please fill this field';
}else if(props.err==='sDateLessThaneDate'){
return 'end date must be gater than start date';
}else{
  return '';
}

}
  return (


    <div className={props.err === "true" ||props.err === "sDateLessThaneDate" ? styles.invalid : styles.formControl}>
      <label htmlFor='name'>{props.label}</label>
      <input className={styles.taskInput} value={props.value} type={props.type} id={props.inputId} multiple onChange={props.onChange} placeholder={props.placeholder} style={{ height: '27px' }} accept={props.accept} />
      <span className={styles.errSpan}>{errorType()}</span>


    </div>



  );
};

export default CTForm;
