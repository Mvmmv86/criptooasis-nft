import { useEffect, useRef } from 'react'

const NeonSun = ({ className = "" }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    canvas.width = 300
    canvas.height = 300
    
    let animationId
    let time = 0

    const drawSun = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = 80
      
      // Create radial gradient for sun
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 2)
      gradient.addColorStop(0, '#ffff00')
      gradient.addColorStop(0.3, '#ff8000')
      gradient.addColorStop(0.6, '#ff00ff')
      gradient.addColorStop(1, 'transparent')
      
      // Draw outer glow
      ctx.save()
      ctx.globalAlpha = 0.3 + Math.sin(time * 0.003) * 0.2
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
      
      // Draw sun body
      const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
      sunGradient.addColorStop(0, '#ffff00')
      sunGradient.addColorStop(0.7, '#ff8000')
      sunGradient.addColorStop(1, '#ff00ff')
      
      ctx.fillStyle = sunGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fill()
      
      // Draw horizontal lines across the sun
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 2
      ctx.globalAlpha = 0.8
      
      for (let i = 0; i < 8; i++) {
        const y = centerY - radius + (i * radius * 2 / 7)
        const lineWidth = Math.sqrt(radius * radius - Math.pow(y - centerY, 2)) * 2
        
        ctx.beginPath()
        ctx.moveTo(centerX - lineWidth / 2, y)
        ctx.lineTo(centerX + lineWidth / 2, y)
        ctx.stroke()
      }
      
      // Add pulsing effect
      ctx.globalAlpha = 0.5 + Math.sin(time * 0.005) * 0.3
      ctx.strokeStyle = '#ffff00'
      ctx.lineWidth = 3
      ctx.shadowBlur = 20
      ctx.shadowColor = '#ffff00'
      
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius + 5, 0, Math.PI * 2)
      ctx.stroke()
      
      time += 16
      animationId = requestAnimationFrame(drawSun)
    }

    drawSun()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`${className}`}
      width={300}
      height={300}
    />
  )
}

export default NeonSun