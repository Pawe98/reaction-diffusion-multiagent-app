import React, { useRef, useEffect, useState } from "react";
import WebGLDebugUtils from "../webgl-debug";
import "./Canvas.css";


const Canvas = (props) => {
  const { draw, initShader, ...rest } = props;

  const [animationIsRunning, setAnimationIsRunning] = useState(false);

  // ...

  // Step 4: Create a toggleAnimation function
  const toggleAnimation = () => {
    console.log("Button clicked!: " + !animationIsRunning); // Add this line
    setAnimationIsRunning(!animationIsRunning);
  };

  const useCanvas = (draw) => {
    const canvasRef = useRef(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      const gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl"));
      let frameCount = 0;
      let animationFrameId;

      // create two textures for ping-pong rendering
      const textureWidth = 200;
      const textureHeight = 200;
      const textures = [];
      for (let i = 0; i < 2; i++) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          textureWidth,
          textureHeight,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          null
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        textures.push(texture);
      }

      // Create and bind the framebuffer
      const fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      // Attach the textures to the framebuffer
      for (let i = 0; i < 2; i++) {
        gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          gl.COLOR_ATTACHMENT0,
          gl.TEXTURE_2D,
          textures[i],
          0
        );
      }
      const program = gl.createProgram();
      initShader(gl, program, frameCount + 1);

      const render = () => {
        frameCount++;

        // Get the uniform location for isFirstFrame
        const isFirstFrameLocation = gl.getUniformLocation(
          program,
          "isFirstFrame"
        );

        const isFirstFrame = frameCount < 100;

        // Set the value of the isFirstFrame uniform
        console.log(
          "Set the value of the isFirstFrame=" + animationIsRunning + "  uniform"
        );
        gl.uniform1i(isFirstFrameLocation, !animationIsRunning);

        // Render to the framebuffer using the current texture as input
        //The code block prepares the framebuffer and the current texture for rendering.
        //It ensures that subsequent rendering operations will be directed to
        //the framebuffer using the current texture as the color buffer.
        const currentTexture = textures[frameCount % 2]; //Important: we always render to currentTexture,
        //but in the next frame it switches to the other array position, so the currentTexture automatically
        //becomes the prev texture in the next frame.
        const prevTexture = textures[(frameCount + 1) % 2];
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          gl.COLOR_ATTACHMENT0,
          gl.TEXTURE_2D,
          currentTexture,
          0
        );

        // Render the scene with the previous frame's texture
        gl.bindTexture(gl.TEXTURE_2D, prevTexture);
        gl.viewport(0, 0, textureWidth, textureHeight);
        gl.clearColor(0, 0, 1, 1); // clear to blue
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        draw(gl, frameCount);

        // Render to the canvas using the current texture
        gl.bindFramebuffer(gl.FRAMEBUFFER, null); //this will make it render to canvas
        gl.bindTexture(gl.TEXTURE_2D, prevTexture);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(1, 1, 1, 1); // clear to white
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        draw(gl, frameCount);

        animationFrameId = window.requestAnimationFrame(render);
      };
      render();

      return () => {
        window.cancelAnimationFrame(animationFrameId);
      };
    }, [draw, animationIsRunning]);

    return canvasRef;
  };

  const canvasRef = useCanvas(draw);
  return (
    <div>
  <canvas ref={canvasRef} {...rest} />
  <button onClick={toggleAnimation}>
        {animationIsRunning ? "Stop Animation" : "Start Animation"}
      </button>
      </div>
      );
};

export default Canvas;
