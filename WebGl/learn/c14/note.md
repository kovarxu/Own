### draw texture to another texture

steps:

(initTextures)

createTexture1 (a real texture contains data) -> activate -> bindTexture1 -> initTexture1 -> 

createTexture2 (data = null) -> bindTexture2 -> initTexture2 -> 

(initFramebuffer)

createFramebuffer -> bindFramebuffer -> 

attach the `texture` as the first color attachment (`gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, targetTexture, level)`) ->

attach a `render buffer` for depth test -> (`gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,renderBuffer)`)

(when draw)
bindFramebuffer -> bind texture and renderbuffer  -> draw (on framebuffer) ->
bind framebuffer to null -> bindTexture1 -> draw

attention:

we must set `gl.viewport` and `aspect for perspective` each time we draw on framebuffer, because their sizes are different.

`function bindFrambufferAndSetViewport(fb, width, height) {
   gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
   gl.viewport(0, 0, width, height);
}`

### frameBuffer

A framebuffer is just a `collection of attachments`. Attachments are either textures or renderbuffers. 

Attachments include color, depth, stencil and so on.

Renderbuffers are very similar to textures but they support formats and options that textures don't support. Also, unlike a texture you can't directly use a renderbuffer as input to a shader.


