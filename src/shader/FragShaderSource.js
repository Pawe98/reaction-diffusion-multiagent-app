import React from 'react'
const FragShaderSource = `

void main() {
    gl_FragColor = vec4(gl_FragCoord.x / 640.0, gl_FragCoord.y / 480.0, 0, 1);
  }
  
  `
  //TODO add x640 : y480 vars as uniforms into this frag shader
  export default FragShaderSource

