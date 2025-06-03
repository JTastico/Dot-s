import React from 'react'
import styles from "./Board.module.css"
import Card from '../Card/Card'
import Number from '../Number/Number'
import Pictogram from '../PictogramList/Pictogram'

export default function Board({ 
  topPictogram = null,
  onPictogramRemove,
  centerCards = [], 
  onCardRemove, 
  bottomNumber = null, 
  onNumberRemove 
}) {
  return (
    <div className={styles.boardContainer}>
      <div className={styles.elementsContainer}>
        {topPictogram === null ? (
          <div className={styles.redBox}></div>
        ) : (
          <div className={styles.pictogramContainer}>
            <Pictogram
              src={topPictogram.src}
              onClick={onPictogramRemove}
            />
          </div>
        )}

        <div className={styles.centerCardsContainer}>
          {centerCards.map((color, index) => (
            <Card
              key={index}
              cardColor={color}
              onClick={() => onCardRemove(index)}
            />
          ))}
        </div>

        {bottomNumber === null ? (
          <div className={styles.redBox}></div>
        ) : (
          <div className={styles.numberContainer}>
            <Number
              number={bottomNumber}
              onClick={onNumberRemove}
            />
          </div>
        )}
      </div>
    </div>
  )
}
