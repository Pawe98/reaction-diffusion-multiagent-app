const FragShaderSource = `

precision mediump float;
uniform sampler2D uPrevTexture;
uniform bool isFirstFrame;


void main() {
  vec2 texCoord = vec2(gl_FragCoord.x / 640.0, gl_FragCoord.y / 480.0);
  
  // Sample the prevTexture color
  vec4 prevTextureColor;
  if (isFirstFrame) {
    gl_FragColor = vec4(gl_FragCoord.x / 640.0, gl_FragCoord.y / 480.0, 0, 1);
  } else {
    prevTextureColor = texture2D(uPrevTexture, texCoord);
    gl_FragColor = vec4(prevTextureColor.r, prevTextureColor.g, prevTextureColor.b + 0.005, 1);
  }

}

`;
//TODO add x640 : y480 vars as uniforms into this frag shader
export default FragShaderSource;
