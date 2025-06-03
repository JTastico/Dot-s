import React from 'react'
import styles from "./Number.module.css"

export default function Number({ number, onClick, disabled }) {
  return (
    <button 
      className={`${styles.numberContainer} ${disabled ? styles.disabled : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {number}
    </button>
  )
}