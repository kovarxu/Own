Some Css Problems

1px 边框问题
-------------
Retina屏幕有window.devicePixelRatio属性，1个css像素等于x个设备像素

    鉴定: if (window.devicePixelRatio && window.devicePixelRatio >= 2) {
      <!-- do something -->
    }

    1. 通过viewport + rem实现
    修改meta标签
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scaleable=no">
    修改rem基准值

    2. 通过伪元素实现
    如下代码可以实现效果
    .pixel-1 {
      position: relative;
      height: 20px;
      border: none;
    }

    .pixel-1:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      transform: scaleY(0.5);
      -webkit-transform: scaleY(0.5);
      transform-origin: 0 0;
      -webkit-transform-origin: 0 0;
      background-color: cornflowerblue;
    }

    3. 通过1px的图片实现
    

