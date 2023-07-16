const FragShaderSource = `

precision highp float;
uniform highp sampler2D uPrevTexture;
uniform bool isFirstFrame;
uniform highp float u_kernel[9];
uniform float u_kernelWeight;


float laplace(in vec2 coordinate, in int channel) {


  float resolutionX = 100.0;
  float resolutionY = 100.0;
  vec2 texelSize = 1.0 / vec2(resolutionX, resolutionY);


  vec2 textureAsPixelCoord0 = vec2((coordinate.x + 0.5) - 1.0, (coordinate.y + 0.5) - 1.0) / vec2(resolutionX, resolutionY); 
  vec2 textureAsPixelCoord1 = vec2((coordinate.x + 0.5) + 0.0, (coordinate.y + 0.5) - 1.0) / vec2(resolutionX, resolutionY); 
  vec2 textureAsPixelCoord2 = vec2((coordinate.x + 0.5) + 1.0, (coordinate.y + 0.5) - 1.0) / vec2(resolutionX, resolutionY); 
  vec2 textureAsPixelCoord3 = vec2((coordinate.x + 0.5) - 1.0, (coordinate.y + 0.5) + 0.0) / vec2(resolutionX, resolutionY); 
  vec2 textureAsPixelCoord4 = vec2((coordinate.x + 0.5) + 0.0, (coordinate.y + 0.5) + 0.0) / vec2(resolutionX, resolutionY); //center pixel
  vec2 textureAsPixelCoord5 = vec2((coordinate.x + 0.5) + 1.0, (coordinate.y + 0.5) + 0.0) / vec2(resolutionX, resolutionY); 
  vec2 textureAsPixelCoord6 = vec2((coordinate.x + 0.5) - 1.0, (coordinate.y + 0.5) + 1.0) / vec2(resolutionX, resolutionY); 
  vec2 textureAsPixelCoord7 = vec2((coordinate.x + 0.5) + 0.0, (coordinate.y + 0.5) + 1.0) / vec2(resolutionX, resolutionY); 
  vec2 textureAsPixelCoord8 = vec2((coordinate.x + 0.5) + 1.0, (coordinate.y + 0.5) + 1.0) / vec2(resolutionX, resolutionY); 


  vec4 colorSum = texture2D(uPrevTexture, textureAsPixelCoord0) * vec4(u_kernel[0], u_kernel[0], u_kernel[0], 1.0) +
  texture2D(uPrevTexture, textureAsPixelCoord1) * vec4(u_kernel[1], u_kernel[1], u_kernel[1], 1.0) +
  texture2D(uPrevTexture, textureAsPixelCoord2) * vec4(u_kernel[2], u_kernel[2], u_kernel[2], 1.0) +
  texture2D(uPrevTexture, textureAsPixelCoord3) * vec4(u_kernel[3], u_kernel[3], u_kernel[3], 1.0) +
  texture2D(uPrevTexture, textureAsPixelCoord4) * vec4(u_kernel[4], u_kernel[4], u_kernel[4], 1.0) +
  texture2D(uPrevTexture, textureAsPixelCoord5) * vec4(u_kernel[5], u_kernel[5], u_kernel[5], 1.0) +
  texture2D(uPrevTexture, textureAsPixelCoord6) * vec4(u_kernel[6], u_kernel[6], u_kernel[6], 1.0) +
  texture2D(uPrevTexture, textureAsPixelCoord7) * vec4(u_kernel[7], u_kernel[7], u_kernel[7], 1.0) +
  texture2D(uPrevTexture, textureAsPixelCoord8) * vec4(u_kernel[8], u_kernel[8], u_kernel[8], 1.0);

  if(channel == 0) {
    return (colorSum).r;
  } else if(channel == 1) {
    return (colorSum).g;
  } else {
    return 1.0;
  }
  

}

void main() {

  float dA = 1.0; //Diffusion Rate A
  float dB = 0.22; //Diffusion Rate B
  float feed = 0.055; //Feed Rate at which A is feed into
  float kill = 0.062; //Kill Rate at wich B is Removed

  float resolutionX = 100.0;
  float resolutionY = 100.0;
  
  
  if (isFirstFrame) {

    

    if(gl_FragCoord.x + 0.5 >= 50.0 && gl_FragCoord.x + 0.5 <= 55.0 && gl_FragCoord.y + 0.5 >= 50.0 && gl_FragCoord.y + 0.5 <= 55.0) {
      gl_FragColor = vec4(0, 1.0, 0.0, 1.0);
      
    } else {
      
      gl_FragColor = vec4(1.0, 0, 0.0, 1.0);
    }
      
    } else {

      // Sample the prevTexture color
      vec2 textureCoord = vec2((gl_FragCoord.x), (gl_FragCoord.y)) / vec2(resolutionX, resolutionY);

      // Round down the coordinate to the nearest pixel
      vec2 pixelCoord = floor(textureCoord * vec2(resolutionX, resolutionY));

      // Sample in the middle of the pixel
      vec2 textureAsPixelCoord = vec2((pixelCoord.x + 0.5), (pixelCoord.y + 0.5)) / vec2(resolutionX, resolutionY);
    
      vec4 prevTextureColor = texture2D(uPrevTexture, textureAsPixelCoord);
      
      //gl_FragColor = prevTextureColor;

        gl_FragColor = vec4(prevTextureColor.r + 
         (dA * laplace(pixelCoord, 0)) - 
         (prevTextureColor.r *  prevTextureColor.g * prevTextureColor.g) +
         (feed * (1.0 - prevTextureColor.r)), 


         prevTextureColor.g + 
         (dB * laplace(pixelCoord, 1)) +
         (prevTextureColor.r * prevTextureColor.g * prevTextureColor.g) -
         ((kill + feed) * prevTextureColor.g) , 0, 1);
     
    }
    

    
    
     
  

}

`;
//TODO add x640 : y480 vars as uniforms into this frag shader
export default FragShaderSource;
