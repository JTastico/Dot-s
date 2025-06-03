import React from 'react'
import styles from "./PictogramList.module.css"
import Pictogram from './Pictogram'
import botella from "../../../assets/images/pictograms/botella.svg"
import calavera from "../../../assets/images/pictograms/calavera.svg"
import corrosivo from "../../../assets/images/pictograms/corrosivo.svg"
import explosivo from "../../../assets/images/pictograms/explosivo.svg"
import fuego from "../../../assets/images/pictograms/fuego.svg"
import oxidante from "../../../assets/images/pictograms/oxidante.svg"
import baterias from "../../../assets/images/pictograms/baterias.svg"
import riesgoBiologico from "../../../assets/images/pictograms/riesgo-biologico.svg"
import radioactivo from "../../../assets/images/pictograms/radioactivo.svg"
import triangulo from "../../../assets/images/pictograms/triangulo.png"

const PICTOGRAMS = [
  { id: 'botella', src: botella },
  { id: 'calavera', src: calavera },
  { id: 'corrosivo', src: corrosivo },
  { id: 'explosivo', src: explosivo },
  { id: 'fuego', src: fuego },
  { id: 'oxidante', src: oxidante },
  { id: 'baterias', src: baterias },
  { id: 'riesgoBiologico', src: riesgoBiologico },
  { id: 'radioactivo', src: radioactivo },
  { id: 'triangulo', src: triangulo}
];

export default function PictogramList({ onPictogramSelect, selectedPictogram }) {
  return (
    <div className={styles.pictogramList}>
      {PICTOGRAMS.map((pictogram) => (
        <Pictogram
          key={pictogram.id}
          src={pictogram.src}
          onClick={() => onPictogramSelect(pictogram)}
          disabled={selectedPictogram !== null}
        />
      ))}
    </div>
  )
}

