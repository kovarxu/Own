### draw texture to another texture

steps:

    (initTextures)
    createTexture1 -> activate -> bindTexture1 -> initTexture1 -> createTexture2 -> bindTexture2 -> initTexture2 -> 
    (initFramebuffer)
    createFramebuffer -> bindFramebuffer -> connect texture with framebuffer  
    (when draw)
    bindFramebuffer -> bindTexture -> draw // if we are not draw on a framebuffer, we should let it bind to null

attention:

we must set `gl.viewport` and `aspect for perspective` each time we draw on framebuffer, because their sizes are different.

`function bindFrambufferAndSetViewport(fb, width, height) {
   gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
   gl.viewport(0, 0, width, height);
}`