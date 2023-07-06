import Canvas from './Canvas/Canvas';
import './App.css';
import FragShaderSource from './shader/FragShaderSource';
import VertexShaderSource from './shader/VertexShaderSource';


export default function App() {
  const resulution = {x:640,y:480}
  const draw = (ctx, frameCount) => {


    ctx.drawArrays(ctx.TRIANGLES, 0, 6);
  }

  const initShader = (ctx) => {
    

    const buffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer);
    ctx.bufferData(
      ctx.ARRAY_BUFFER, 
      new Float32Array([
        0, 0, 
        resulution.x, 0, 
        0, resulution.y, 
        0, resulution.y, 
        resulution.x, 0, 
        resulution.x, resulution.y]), 
         ctx.STATIC_DRAW
    );

    const vertexShader = ctx.createShader(ctx.VERTEX_SHADER)
    ctx.shaderSource(vertexShader, VertexShaderSource)
    ctx.compileShader(vertexShader)

    const fragmentShader = ctx.createShader(ctx.FRAGMENT_SHADER)
    console.log("Frag shader: " + FragShaderSource)
    ctx.shaderSource(fragmentShader, FragShaderSource)
    ctx.compileShader(fragmentShader)

    ctx.viewport(0, 0, ctx.canvas.width, ctx.canvas.height);
    const program = ctx.createProgram();
    ctx.attachShader(program, vertexShader);
    ctx.attachShader(program, fragmentShader);
    ctx.linkProgram(program);	
    ctx.useProgram(program);

    
    const positionLocation = ctx.getAttribLocation(program, "a_position");
    var resolutionUniformLocation = ctx.getUniformLocation(program, "u_resolution");
    ctx.enableVertexAttribArray(positionLocation);
     // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2;          // 2 components per iteration
  var type = ctx.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  ctx.vertexAttribPointer(
      positionLocation, size, type, normalize, stride, offset);
    ctx.uniform2f(resolutionUniformLocation, resulution.x, resulution.y);
    
    
    
      console.log("Finished Initialization of Canvas")

  }
  return (
    <div className="App">
      <Canvas class="canvas" width={resulution.x} height={resulution.y} draw={draw} initShader={initShader}></Canvas>
    </div>
  );
}