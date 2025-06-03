import React from 'react'
import styles from "./Pictogram.module.css"

export default function Pictogram({ src, onClick, disabled }) {
  return (
    <button 
      className={`${styles.pictogramButton} ${disabled ? styles.disabled : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <img src={src} alt="Pictogram" className={styles.pictogramImage} />
    </button>
  )
}