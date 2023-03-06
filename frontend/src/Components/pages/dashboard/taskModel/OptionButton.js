import React from 'react'
import styles from './Modal.module.css'
export const OptionButton = (props) => {
  return (
    <div>
            <label>{props.text}</label>
      <select onChange={props.onChange} value={props.value} className={props.err === "true" ?styles.selectError:""}>
        <option value="default" disabled >Select an option</option>
              {props.options &&
              props.options.map((option,index)=>
                <option key={index} value={option.name}>{option.name}</option>
              )}
      </select>
      <div className={styles.errSpan}>{props.err === "true" ? "Please select" : ""}</div>

          </div>
  )
}

export default OptionButton;