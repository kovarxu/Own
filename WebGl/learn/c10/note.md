### animation

use `requestAnimationFrame` to create a frame animation is very easy

but why `requestAnimationFrame`, not `setTimeout & setInterval` ??

1. They aren't synced to when the browser is going to draw a new frame and so can be **out of sync with the user's machine**.

2. The browser has no idea why you're using setInterval or setTimeout. So for example, even when your page is not visible, like when it's not the front tab, the browser **still has to execute your code**
