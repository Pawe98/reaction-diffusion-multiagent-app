import React from 'react'
const VertexShaderSource = `
    attribute vec2 a_position;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(a_position, 0, 1);
    }
    `
  
  export default VertexShaderSource