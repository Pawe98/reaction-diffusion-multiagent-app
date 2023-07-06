import React, { useRef, useEffect  } from 'react'
const Canvas = props => {
    const { draw, initShader, ...rest  } = props
    

    const useCanvas = draw => {
      
      const canvasRef = useRef(null)
      
      useEffect(() => {
        
        const canvas = canvasRef.current
        const context = canvas.getContext('experimental-webgl')
        let frameCount = 0
        let animationFrameId

        initShader(context)
        
        const render = () => {
          frameCount++
          draw(context, frameCount)
          animationFrameId = window.requestAnimationFrame(render)
        }
        render()
        
        return () => {
          window.cancelAnimationFrame(animationFrameId)
        }
      }, [draw])
      
      return canvasRef
    }

    const canvasRef = useCanvas(draw)
    return <canvas ref={canvasRef} {...rest}/>
  }
  
  export default Canvas