import React, { useState } from 'react'
import styles from "./Card.module.css"

export default function Card({ cardColor, onClick, inHand }) {

  return (
    <button
      className={`${styles.card} ${inHand ? styles.handCard : ''}`}
      style={{ backgroundColor: cardColor }}
      onClick={onClick}
    >
    </button>
  )
}
