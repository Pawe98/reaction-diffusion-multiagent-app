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

    // Define several convolution kernels
    var kernels = {
      normal: [0, 0, 0, 0, 1, 0, 0, 0, 0],
      gaussianBlur: [
        0.045, 0.122, 0.045, 0.122, 0.332, 0.122, 0.045, 0.122, 0.045,
      ],
      gaussianBlur2: [1, 2, 1, 2, 4, 2, 1, 2, 1],
      gaussianBlur3: [0, 1, 0, 1, 1, 1, 0, 1, 0],
      unsharpen: [-1, -1, -1, -1, 9, -1, -1, -1, -1],
      sharpness: [0, -1, 0, -1, 5, -1, 0, -1, 0],
      sharpen: [-1, -1, -1, -1, 16, -1, -1, -1, -1],
      edgeDetect: [
        -0.125, -0.125, -0.125, -0.125, 1, -0.125, -0.125, -0.125, -0.125,
      ],
      edgeDetect2: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
      edgeDetect3: [-5, 0, 0, 0, 0, 0, 0, 0, 5],
      edgeDetect4: [-1, -1, -1, 0, 0, 0, 1, 1, 1],
      edgeDetect5: [-1, -1, -1, 2, 2, 2, -1, -1, -1],
      edgeDetect6: [-5, -5, -5, -5, 39, -5, -5, -5, -5],
      sobelHorizontal: [1, 2, 1, 0, 0, 0, -1, -2, -1],
      sobelVertical: [1, 0, -1, 2, 0, -2, 1, 0, -1],
      previtHorizontal: [1, 1, 1, 0, 0, 0, -1, -1, -1],
      previtVertical: [1, 0, -1, 1, 0, -1, 1, 0, -1],
      boxBlur: [0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111],
      triangleBlur: [
        0.0625, 0.125, 0.0625, 0.125, 0.25, 0.125, 0.0625, 0.125, 0.0625,
      ],
      emboss: [-2, -1, 0, -1, 1, 1, 0, 1, 2],
      diffusion:  [0.05, 0.2, 0.05, 0.2, -1.0, 0.2, 0.05, 0.2 , 0.05],
      test:       [0.250, 0.5, 0.250, 0.5, -1.0, 0.5, 0.250, 0.5 , 0.250]
    };
    var initialSelection = "diffusion";
    
    //Bind the post processing kernels
    var kernelLocation = gl.getUniformLocation(program, "u_kernel[0]");
     // set the kernel and it's weight
     gl.uniform1fv(kernelLocation, kernels[initialSelection]);
     var kernelWeightLocation = gl.getUniformLocation(program, "u_kernelWeight");
     gl.uniform1f(kernelWeightLocation, computeKernelWeight(kernels[initialSelection]));

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

  function computeKernelWeight(kernel) {
    var weight = kernel.reduce(function(prev, curr) {
        return prev + curr;
    });
    return weight <= 0 ? 1 : weight;
  }
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
