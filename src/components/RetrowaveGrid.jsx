import { useEffect, useRef } from 'react'

const RetrowaveGrid = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let animationId
    let time = 0

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const gridSize = 180
      const perspective = 0.8
      const horizon = canvas.height * 0.6
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, 'rgba(128, 0, 255, 0.1)')
      gradient.addColorStop(0.5, 'rgba(255, 0, 255, 0.05)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)')
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw perspective grid
      ctx.strokeStyle = '#ff00ff'
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.3

      // Vertical lines
      for (let x = -canvas.width; x < canvas.width * 2; x += gridSize) {
        const startX = x + Math.sin(time * 0.001) * 20
        const endX = canvas.width / 2 + (startX - canvas.width / 2) * perspective
        
        ctx.beginPath()
        ctx.moveTo(startX, horizon)
        ctx.lineTo(endX, canvas.height)
        ctx.stroke()
      }

      // Horizontal lines with perspective
      for (let y = horizon; y < canvas.height; y += gridSize / 2) {
        const perspectiveY = y + Math.sin(time * 0.002 + y * 0.01) * 5
        const width = (perspectiveY - horizon) / (canvas.height - horizon) * canvas.width
        
        ctx.globalAlpha = 0.3 - (perspectiveY - horizon) / (canvas.height - horizon) * 0.2
        
        ctx.beginPath()
        ctx.moveTo(canvas.width / 2 - width / 2, perspectiveY)
        ctx.lineTo(canvas.width / 2 + width / 2, perspectiveY)
        ctx.stroke()
      }

      // Add glow effect
      ctx.globalAlpha = 0.1
      ctx.strokeStyle = '#00ffff'
      ctx.lineWidth = 3
      
      // Redraw some lines with glow
      for (let x = 0; x < canvas.width; x += gridSize * 4) {
        const startX = x + Math.sin(time * 0.001) * 20
        const endX = canvas.width / 2 + (startX - canvas.width / 2) * perspective
        
        ctx.beginPath()
        ctx.moveTo(startX, horizon)
        ctx.lineTo(endX, canvas.height)
        ctx.stroke()
      }

      time += 10
      animationId = requestAnimationFrame(drawGrid)
    }

    drawGrid()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}

export default RetrowaveGrid