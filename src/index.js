import React, { useEffect, useState } from 'react'

const WheelComponent = ({
  segments,
  segColors,
  winningSegment,
  onFinished,
  primaryColor = 'black',
  contrastColor = 'white',
  buttonText = 'QUAY',
  isOnlyOnce = true,
  size = 290,
  upDuration = 100,
  downDuration = 1000,
  fontFamily = 'proxima-nova'
}) => {
  let currentSegment = ''
  let isStarted = false
  const [isFinished, setFinished] = useState(false)
  let timerHandle = 0
  const timerDelay = segments.length
  let angleCurrent = 0
  let angleDelta = 0
  let canvasContext = null
  let maxSpeed = Math.PI / `${segments.length}`
  const upTime = segments.length * upDuration
  const downTime = segments.length * downDuration
  let spinStart = 0
  let frames = 0
  const centerX = 300
  const centerY = 300
  useEffect(() => {
    wheelInit()
    setTimeout(() => {
      window.scrollTo(0, 1)
    }, 0)
  }, [])
  const wheelInit = () => {
    initCanvas()
    wheelDraw()
  }

  const initCanvas = () => {
    let canvas = document.getElementById('canvas')
    console.log(navigator)
    if (navigator.userAgent.indexOf('MSIE') !== -1) {
      canvas = document.createElement('canvas')
      canvas.setAttribute('width', 1000)
      canvas.setAttribute('height', 600)
      canvas.setAttribute('id', 'canvas')
      document.getElementById('wheel').appendChild(canvas)
    }
    canvas.addEventListener('click', spin, false)
    canvasContext = canvas.getContext('2d')
  }
  const spin = () => {
    isStarted = true
    if (timerHandle === 0) {
      spinStart = new Date().getTime()
      // maxSpeed = Math.PI / ((segments.length*2) + Math.random())
      maxSpeed = Math.PI / segments.length
      frames = 0
      timerHandle = setInterval(onTimerTick, timerDelay)
    }
  }
  const onTimerTick = () => {
    frames++
    draw()
    const duration = new Date().getTime() - spinStart
    let progress = 0
    let finished = false
    if (duration < upTime) {
      progress = duration / upTime
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2)
    } else {
      if (winningSegment) {
        if (currentSegment === winningSegment && frames > segments.length) {
          progress = duration / upTime
          angleDelta =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2)
          progress = 1
        } else {
          progress = duration / downTime
          angleDelta =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2)
        }
      } else {
        progress = duration / downTime
        angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2)
      }
      if (progress >= 1) finished = true
    }

    angleCurrent += angleDelta
    while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2
    if (finished) {
      setFinished(true)
      onFinished(currentSegment)
      clearInterval(timerHandle)
      timerHandle = 0
      angleDelta = 0
    }
  }

  const wheelDraw = () => {
    clear()
    drawWheel()
    drawNeedle()
  }

  const draw = () => {
    clear()
    drawWheel()
    drawNeedle()
  }


const drawWheel = () => {
  const ctx = canvasContext;
  let lastAngle = angleCurrent;
  const len = segments.length;
  const PI2 = Math.PI * 2;
  const bigSize = size + 15; // Increase size by 10 (you can adjust the value according to your needs)
  ctx.lineWidth = 1;
  ctx.strokeStyle = primaryColor;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.font = '1em ' + fontFamily;

  // Function to draw a single segment
  const drawSegment = (key, lastAngle, angle) => {
    const segmentColor = segColors[key];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, size, lastAngle, angle, false);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fillStyle = segmentColor;
    ctx.fill();
    ctx.strokeStyle = primaryColor;
    ctx.stroke();

    ctx.save();
    const segmentAngle = (lastAngle + angle) / 2;
  const textRadius = size / 2; // Distance from the center to the text position
  const textX = centerX + textRadius * Math.cos(segmentAngle);
  const textY = centerY + textRadius * Math.sin(segmentAngle);

  ctx.translate(textX, textY);
  ctx.rotate(segmentAngle + Math.PI / 2); // Rotate the text to make it horizontal
  // Draw the image at the top of the text
  const imageWidth = 80;
  const imageHeight = 80;
  const imageX = -imageWidth / 2; // Center the image horizontally
  const imageY = -textRadius - imageHeight; // Position the image above the text

  const image = new Image();
  image.src = segments[key].image;
  console.log('image is' , image )
  
  image.onload = () => {
    ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight);
  };
  // Change the text position here (translate along x and y axes)
  const textPositionX = 0;
  const textPositionY = 0;

  ctx.fillStyle = contrastColor;
  ctx.font = 'bold 1em ' + fontFamily;
  const value = segments[key].name;
  ctx.fillText(value.substr(0, 21), textPositionX, textPositionY);

    ctx.restore();
  };

  // Draw outer circle (original size)
  ctx.beginPath();
  ctx.arc(centerX, centerY, size, 0, PI2, false);
  ctx.closePath();
  ctx.stroke();

  // Save the current context state
  ctx.save();

  // Create a clipping region using the bigger circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, bigSize, 0, PI2, false);
  ctx.clip();

  // Draw the clipped area with the red color
  ctx.fillStyle = '#B0081C';
  ctx.fillRect(centerX - bigSize, centerY - bigSize, 2 * bigSize, 2 * bigSize);

  // Restore the previous context state (remove the clipping region)
  ctx.restore();

  // Function to draw small white circles
  const drawWhiteCircle = (x, y, radius) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, PI2, false);
    ctx.closePath();
    ctx.fillStyle = 'white';
    ctx.fill();
  };

  // Number of small white circles you want to draw
  const numWhiteCircles = 50;

  // Calculate the distance between the center of the red area and the small white circles
  const distance = (bigSize + size) / 2;

  for (let i = 0; i < numWhiteCircles; i++) {
    const angle = angleCurrent + (i / numWhiteCircles) * PI2;
    const x = centerX + distance * Math.cos(angle);
    const y = centerY + distance * Math.sin(angle);
    drawWhiteCircle(x, y, 5); // Adjust the size of the small white circles as needed
  }

  for (let i = 1; i <= len; i++) {
    const angle = PI2 * (i / len) + angleCurrent;
    drawSegment(i - 1, lastAngle, angle);
    lastAngle = angle;
  }

  // Draw a center circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, 50, 0, PI2, false);
  ctx.closePath();
  ctx.fillStyle = '#7d220a';
  ctx.lineWidth = 10;
  ctx.strokeStyle = contrastColor;
  ctx.fill();
  ctx.font = 'bold 1em ' + fontFamily;
  ctx.fillStyle = contrastColor;
  ctx.textAlign = 'center';
  ctx.fillText(buttonText, centerX, centerY + 3);
  ctx.stroke();
};






  const drawNeedle = () => {
    const ctx = canvasContext
    ctx.lineWidth = 1
    ctx.strokeStyle = 'red'
    // ctx.fillStyle = contrastColor
    ctx.fillStyle  = '#4682B4';

    ctx.beginPath()
    ctx.moveTo(centerX + 10, centerY - 50)
    ctx.lineTo(centerX - 10, centerY - 50)
    ctx.lineTo(centerX, centerY - 120)
    ctx.fillStyle =  '#4682B4';

    ctx.closePath()
    ctx.fill()
    const change = angleCurrent + Math.PI / 2
    let i =
      segments.length -
      Math.floor((change / (Math.PI * 2)) * segments.length) -
      1
    if (i < 0) i = i + segments.length
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#4682B4';
    ctx.font = 'bold 1.5em ' + fontFamily
    
    currentSegment = segments[i]
    isStarted && ctx.fillText(currentSegment, centerX + 10, centerY + size + 50)
  }
  const clear = () => {
    const ctx = canvasContext
    ctx.clearRect(0, 0, 1000, 800)
  }
  return (
    <div id='wheel'>
      <canvas
        id='canvas'
        width='1000'
        height='800'
        style={{
          pointerEvents: isFinished && isOnlyOnce ? 'none' : 'auto'
        }}
      />
    </div>
  )
}
export default WheelComponent


