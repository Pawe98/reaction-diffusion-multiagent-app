const FragShaderSource = `

precision highp float;
uniform highp sampler2D uPrevTexture;
uniform bool isFirstFrame;
uniform highp float u_kernel[9];
uniform float u_kernelWeight;


float laplace(in vec2 texCoord, in int channel) {
  vec2 texelSize = 1.0 / vec2(640.0, 480.0);
  
  //todo: seems to be good, but maybe something wrong with sampling
  // all colors at the same time.

  vec4 colorSum = texture2D(uPrevTexture, texCoord - (texelSize * vec2(-1.0, -1.0))) * vec4(u_kernel[0], u_kernel[0], u_kernel[0], 1.0) +
  texture2D(uPrevTexture, texCoord - (texelSize * vec2(0, -1))) * vec4(u_kernel[1], u_kernel[1], u_kernel[1], 1.0) +
  texture2D(uPrevTexture, texCoord - (texelSize * vec2(1, -1))) * vec4(u_kernel[2], u_kernel[2], u_kernel[2], 1.0) +
  texture2D(uPrevTexture, texCoord - (texelSize * vec2(-1, 0))) * vec4(u_kernel[3], u_kernel[3], u_kernel[3], 1.0) +
  texture2D(uPrevTexture, texCoord - (texelSize * vec2(0, 0))) * vec4(u_kernel[4], u_kernel[4], u_kernel[4], 1.0) +
  texture2D(uPrevTexture, texCoord - (texelSize * vec2(1, 0))) * vec4(u_kernel[5], u_kernel[5], u_kernel[5], 1.0) +
  texture2D(uPrevTexture, texCoord - (texelSize * vec2(-1, 1))) * vec4(u_kernel[6], u_kernel[6], u_kernel[6], 1.0) +
  texture2D(uPrevTexture, texCoord - (texelSize * vec2(0, 1))) * vec4(u_kernel[7], u_kernel[7], u_kernel[7], 1.0) +
  texture2D(uPrevTexture, texCoord - (texelSize * vec2(1, 1))) * vec4(u_kernel[8], u_kernel[8], u_kernel[8], 1.0);

  if(channel == 0) {
    return (colorSum).r;
  } else if(channel == 1) {
    return (colorSum).g;
  } else {
    return 1.0;
  }
  

}

void main() {

  float dA = 0.1; //Diffusion Rate A
  float dB = 0.5; //Diffusion Rate B
  float feed = 0.055 ;//Feed Rate at which A is feed into
  float kill = 0.062; //Kill Rate at wich B is Removed

  vec2 texCoord = vec2(gl_FragCoord.x / 640.0, gl_FragCoord.y / 480.0);
  
  // Sample the prevTexture color
  vec4 prevTextureColor;
  if (isFirstFrame) {
    if(gl_FragCoord.x > 20.0 && gl_FragCoord.x < 410.0 && gl_FragCoord.y > 20.0 && gl_FragCoord.y < 110.0) {
      gl_FragColor = vec4(0, 1.0, 0.0, 1.0);
      
    } else {
      
      gl_FragColor = vec4(1.0, 0, 0.0, 1.0);
    }
    
  } else {
    prevTextureColor = texture2D(uPrevTexture, texCoord);
    // gl_FragColor = vec4(laplace(texCoord, 0), laplace(texCoord, 1), 0.0, 1.0);
    if(gl_FragCoord.x > 10.0 && gl_FragCoord.x < 630.0 && gl_FragCoord.y > 10.0 && gl_FragCoord.y < 470.0) {
      gl_FragColor = vec4(prevTextureColor.r + 
        (dA * laplace(texCoord, 0)) - 
        (prevTextureColor.r *  prevTextureColor.g * prevTextureColor.g) +
        (feed * (1.0 - prevTextureColor.r)), 


        prevTextureColor.g + 
        (dB * laplace(texCoord, 1)) +
        (prevTextureColor.r * prevTextureColor.g * prevTextureColor.g) -
        ((kill + feed) * prevTextureColor.g) , 0, 1);
    } else {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1);
    }
     
  }

}

`;
//TODO add x640 : y480 vars as uniforms into this frag shader
export default FragShaderSource;
