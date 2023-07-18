import React from 'react'

import WheelComponent from 'react-wheel-of-prizes'
import './index.css'
import pak from '../src/Pakistan.png'
import ind from '../src/India.png'
import uk from '../src/uk.png'
import ve from '../src/ve.jpg'
import tel from '../src/telegram.png'
import suc from '../src/Success.png'
import zero from '../src/0.png'
import first from '../src/1.png'
import second from '../src/2.png'
import third from '../src/3.png'
import fourtt from '../src/4.png'
import five from '../src/5.png'


const App = () => {
  const segments = [{
    name: 'better luck next time',
    image : pak
  },
  {
    name: 'won 70',
    image : ind
  },
  {
    name: 'won 90',
    image : uk
  },
  {
    name: 'won 120',
    image : ve
  },
  {
    name: 'won 150',
    image : tel
  },
  {
    name: 'won 150',
    image : suc
  },

  ]
  const segColors = [
    '#F9AA1F',
    '#F0CF50',
    '#F9AA1F',
    '#F0CF50',
    '#F9AA1F',
    '#F0CF50',
    '#F9AA1F',
    '#F0CF50',
   
  ]
  const onFinished = (winner) => {
    console.log(winner)
  }

  return (
    <React.Fragment>
      {console.log('segments',segments)}
      <WheelComponent
        segments={segments}
        segColors={segColors}
        winningSegment={segments[3]}
        onFinished={(winner) => onFinished(winner)}
        primaryColor='black'
        contrastColor='white'
        buttonText='QUAY'
        isOnlyOnce={false}
        size={290}
        upDuration={100}
        downDuration={1000}
      />
    </React.Fragment>
  )
}

export default App
