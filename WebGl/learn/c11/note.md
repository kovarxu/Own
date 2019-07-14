### apply texture

we apply textures in these steps: 

1. change vertex shader, create a varying to pass v_textureCoord to fragment shader

2. in fragment shader, use an uniform variable to get texture2D

3. in gl program:

Create and Bind Texture -->> fill texture with a kind of color or an image -->> use that texture

We can use textures directly, even though we never have gotten the texture2D uniform variable specified in the fragment shader.

left, top corner of the texture is (u, v) = (0, 0)

```javascript 
function initTexture () {
  // create and bind a texture
  let texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  
  // fill the texture with a default color
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]))

  // async load an image
  let image = new Image()
  image.src = 'http://127.0.0.1:9000/img/tx_bet.png'
  image.crossOrigin = 'anonymous'
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    gl.generateMipmap(gl.TEXTURE_2D)
  }
}
```

### image cors

we should set `Access-Control-Allow-Origin: "*"` in the back end.

we need specify `image.crossOrigin = 'anonymous'`, or a DOMException may raise.
(we not only take this image for watch, but we need its pixel information, that need crossorigin)

### generateMipmap

`gl.generateMipmap(gl.TEXTURE_2D)` we gen bitmap for the texture, that need 1/3 more memory space (it create 1*1, 2*2, 4*4, 8*8, ..., sqrt(a)*sqrt(a)) but it's more smooth if we encounter a big image.

### texture atalas

we merge some small pictures in a big image, and can get then through texture coordinate.

