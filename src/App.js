import Canvas from './Canvas/Canvas';
import './App.css';
import FragShaderSource from './shader/FragShaderSource';
import VertexShaderSource from './shader/VertexShaderSource';


export default function App() {

  const draw = (ctx, frameCount) => {


    ctx.drawArrays(ctx.TRIANGLES, 0, 6);
  }

  const initShader = (ctx) => {


    const buffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer);
    ctx.bufferData(
      ctx.ARRAY_BUFFER, 
      new Float32Array([
        -1.0, -1.0, 
         1.0, -1.0, 
        -1.0,  1.0, 
        -1.0,  1.0, 
         1.0, -1.0, 
         1.0,  1.0]), 
         ctx.STATIC_DRAW
    );

    const vertexShader = ctx.createShader(ctx.VERTEX_SHADER)
    ctx.shaderSource(vertexShader, VertexShaderSource)
    ctx.compileShader(vertexShader)

    const fragmentShader = ctx.createShader(ctx.FRAGMENT_SHADER)
    console.log("Frag shader: " + FragShaderSource)
    ctx.shaderSource(fragmentShader, FragShaderSource)
    ctx.compileShader(fragmentShader)

    const program = ctx.createProgram();
    ctx.attachShader(program, vertexShader);
    ctx.attachShader(program, fragmentShader);
    ctx.linkProgram(program);	
    ctx.useProgram(program);

    
    const positionLocation = ctx.getAttribLocation(program, "a_position");
    ctx.enableVertexAttribArray(positionLocation);
    ctx.vertexAttribPointer(positionLocation, 2, ctx.FLOAT, false, 0, 0);

    console.log("Finished Initialization of Canvas")

  }
  return (
    <div className="App">
      <Canvas width={640} height={480} draw={draw} initShader={initShader}></Canvas>
    </div>
  );
}