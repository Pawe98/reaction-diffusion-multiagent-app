import React, { useState } from "react";
import Canvas from "./Canvas/Canvas";
import "./App.css";
import FragShaderSource from "./shader/FragShaderSource";
import VertexShaderSource from "./shader/VertexShaderSource";


export default function App() {
  const resulution = { x: 200, y: 200 };
  const draw = (ctx, frameCount) => {
    ctx.drawArrays(ctx.TRIANGLES, 0, 6);
  };

  

  function computeKernelWeight(kernel) {
    var weight = kernel.reduce(function(prev, curr) {
        return prev + curr;
    });
    return weight <= 0 ? 1 : weight;
  }
  return (
    <div className="App"></div>
    

  );
}
