import Canvas from "./Canvas/Canvas";
import "./App.css";
import FragShaderSource from "./shader/FragShaderSource";
import VertexShaderSource from "./shader/VertexShaderSource";

export default function App() {
  const resulution = { x: 640, y: 480 };
  const draw = (ctx, frameCount) => {
    ctx.drawArrays(ctx.TRIANGLES, 0, 6);
  };

  const initShader = (gl, program, frameCount) => {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        0,
        0,
        resulution.x,
        0,
        0,
        resulution.y,
        0,
        resulution.y,
        resulution.x,
        0,
        resulution.x,
        resulution.y,
      ]),
      gl.STATIC_DRAW
    );

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, VertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    console.log("Frag shader: " + FragShaderSource);
    gl.shaderSource(fragmentShader, FragShaderSource);
    gl.compileShader(fragmentShader);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    var resolutionUniformLocation = gl.getUniformLocation(
      program,
      "u_resolution"
    );
    gl.enableVertexAttribArray(positionLocation);
    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2; // 2 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      positionLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );
    gl.uniform2f(resolutionUniformLocation, resulution.x, resulution.y);

    // Bind the previous texture uniform location
    const prevTextureLocation = gl.getUniformLocation(program, "uPrevTexture");
    gl.uniform1i(prevTextureLocation, 0); // Set the texture unit to 0

    // Get the uniform location for isFirstFrame
    const isFirstFrameLocation = gl.getUniformLocation(program, "isFirstFrame");

    const isFirstFrame = frameCount === 1;

    // Set the value of the isFirstFrame uniform
    console.log(
      "Set the value of the isFirstFrame=" + isFirstFrame + "  uniform"
    );
    gl.uniform1i(isFirstFrameLocation, isFirstFrame);

    console.log(gl.getExtension("WEBGL_draw_buffers"));
    console.log("Finished Initialization of Canvas");
  };
  return (
    <div className="App">
      <Canvas
        class="canvas"
        width={resulution.x}
        height={resulution.y}
        draw={draw}
        initShader={initShader}
      ></Canvas>
    </div>
  );
}
