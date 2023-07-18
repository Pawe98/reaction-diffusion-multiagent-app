const FragShaderSource = `

precision highp float;
uniform highp sampler2D uPrevTexture;
uniform bool isFirstFrame;
uniform highp float u_kernel[9];
uniform float u_kernelWeight;

// Passed in from the vertex shader.
varying vec2 v_texCoord;


float laplace(in vec2 coordinate, in int channel) {


  float resolutionX = 200.0;
  float resolutionY = 200.0;
  vec2 texelSize = 1.0 / vec2(resolutionX, resolutionY);


  vec2 textureAsPixelCoord0 = fract(vec2((coordinate.x + 0.5) - 1.0, (coordinate.y + 0.5) - 1.0) / vec2(resolutionX, resolutionY)); 
  vec2 textureAsPixelCoord1 = fract(vec2((coordinate.x + 0.5) + 0.0, (coordinate.y + 0.5) - 1.0) / vec2(resolutionX, resolutionY)); 
  vec2 textureAsPixelCoord2 = fract(vec2((coordinate.x + 0.5) + 1.0, (coordinate.y + 0.5) - 1.0) / vec2(resolutionX, resolutionY)); 
  vec2 textureAsPixelCoord3 = fract(vec2((coordinate.x + 0.5) - 1.0, (coordinate.y + 0.5) + 0.0) / vec2(resolutionX, resolutionY)); 
  vec2 textureAsPixelCoord4 = fract(vec2((coordinate.x + 0.5) + 0.0, (coordinate.y + 0.5) + 0.0) / vec2(resolutionX, resolutionY)); //center pixel
  vec2 textureAsPixelCoord5 = fract(vec2((coordinate.x + 0.5) + 1.0, (coordinate.y + 0.5) + 0.0) / vec2(resolutionX, resolutionY)); 
  vec2 textureAsPixelCoord6 = fract(vec2((coordinate.x + 0.5) - 1.0, (coordinate.y + 0.5) + 1.0) / vec2(resolutionX, resolutionY)); 
  vec2 textureAsPixelCoord7 = fract(vec2((coordinate.x + 0.5) + 0.0, (coordinate.y + 0.5) + 1.0) / vec2(resolutionX, resolutionY)); 
  vec2 textureAsPixelCoord8 = fract(vec2((coordinate.x + 0.5) + 1.0, (coordinate.y + 0.5) + 1.0) / vec2(resolutionX, resolutionY)); 


  vec4 colorSum = texture2D(uPrevTexture, textureAsPixelCoord0, 0.0) * vec4(u_kernel[0], u_kernel[0], u_kernel[0], 1.0) +
  texture2D(uPrevTexture, textureAsPixelCoord1, 0.0) * vec4(u_kernel[1], u_kernel[1], u_kernel[1], 1.0) +
  texture2D(uPrevTexture, textureAsPixelCoord2, 0.0) * vec4(u_kernel[2], u_kernel[2], u_kernel[2], 1.0) +
  texture2D(uPrevTexture, textureAsPixelCoord3, 0.0) * vec4(u_kernel[3], u_kernel[3], u_kernel[3], 1.0) +
  texture2D(uPrevTexture, textureAsPixelCoord4, 0.0) * vec4(u_kernel[4], u_kernel[4], u_kernel[4], 1.0) +
  texture2D(uPrevTexture, textureAsPixelCoord5, 0.0) * vec4(u_kernel[5], u_kernel[5], u_kernel[5], 1.0) +
  texture2D(uPrevTexture, textureAsPixelCoord6, 0.0) * vec4(u_kernel[6], u_kernel[6], u_kernel[6], 1.0) +
  texture2D(uPrevTexture, textureAsPixelCoord7, 0.0) * vec4(u_kernel[7], u_kernel[7], u_kernel[7], 1.0) +
  texture2D(uPrevTexture, textureAsPixelCoord8, 0.0) * vec4(u_kernel[8], u_kernel[8], u_kernel[8], 1.0);

  if(channel == 0) {
    return (colorSum).r;
  } else if(channel == 1) {
    return (colorSum).g;
  } else {
    return 1.0;
  }
  

}

float rand(vec2 co){
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {

  float dA = 1.0; //Diffusion Rate A
  float dB = 0.24; //Diffusion Rate B
  float feed = 0.055; //Feed Rate at which A is feed into
  float kill = 0.062; //Kill Rate at wich B is Removed

  float resolutionX = 200.0;
  float resolutionY = 200.0;
  
  
  if (isFirstFrame) {

    if(rand(v_texCoord + vec2(2.123, 3.321)) > 0.5) {
      gl_FragColor = vec4(0.0,rand(v_texCoord),0.0,1.0);
    } else {
      gl_FragColor = vec4(rand(v_texCoord),0.0,0.0,1.0);
    }
        

    // if(gl_FragCoord.x + 0.5 >= 70.0 && gl_FragCoord.x + 0.5 <= 130.0 && gl_FragCoord.y + 0.5 >= 70.0 && gl_FragCoord.y + 0.5 <= 130.0) {
    //   gl_FragColor = vec4(0, 1.0, 0.0, 1.0);
      
    // } else {
    //   gl_FragColor = vec4(1.0,0.0,0.0,1);
    // }
    

    
      
    } else {

      // Sample the prevTexture color
      vec2 textureCoord = v_texCoord;

      // Round down the coordinate to the nearest pixel
      vec2 pixelCoord = floor(textureCoord * vec2(resolutionX, resolutionY)); // from 0.0

      // Sample in the middle of the pixel
      vec2 textureAsPixelCoord = fract(vec2((pixelCoord.x + 0.5), (pixelCoord.y + 0.5)) / vec2(resolutionX, resolutionY));
    
      vec4 prevTextureColor = texture2D(uPrevTexture, textureAsPixelCoord, 0.0);
      
         if(mod(pixelCoord.x, 1.0) == 0.0) {
          gl_FragColor = prevTextureColor;

            gl_FragColor = vec4(prevTextureColor.r + 
             ((dA * laplace(pixelCoord, 0)) - 
             (prevTextureColor.r *  prevTextureColor.g * prevTextureColor.g) +
             (feed * (1.0 - prevTextureColor.r))) * 1.0, 
    
     
             prevTextureColor.g + 
             ((dB * laplace(pixelCoord, 1)) +
             (prevTextureColor.r * prevTextureColor.g * prevTextureColor.g) -
             ((kill + feed) * prevTextureColor.g)) * 1.0 , 0, 1);
        }
    }
    

    
    
     
  

}

`;
//TODO add x640 : y480 vars as uniforms into this frag shader
export default FragShaderSource;
