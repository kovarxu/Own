问题集合：

1. transition, animation, box-shadow
2. 选择器优先级
3. 三角形、梯形、正方形等
4. GPU加速
5. 垂直居中
6. flex:n

问题解答：

#### transition, animation, box-shadow

* transition: {property} + {duration} + {timing func} + {delay}
* box-shadow: {inset} + {offsetX} + {offsetY} + {blurRadius} + {color}
* animation: {duration} + {timing func} + {delay} + {iteration} + {direction} + {fill-mode} + {play-state} + {name}
  iteration: infinity, 也可以是小数
  direction: normal, alternate, reverse, alternate-reverse
  fill-mode: none, forwards, backwards, both
  play-state: running paused (实验中的属性)
  nane: 关键帧名字

#### 选择器优先级

* 直接加style属性 {1000}
* id {100}
* class, 伪类选择器 {10}
* element, 伪元素选择器 {1}

#### GPU加速？层级提升...

* will-change: transform;
* opacity: 0.99;
* position: relative; z-index: 1;
* transform: translateZ(0);
* perspective, filter, mix-blend-mode

#### perspective

* perspective: 200px;
* perspective-origin: 150% 150%;
* transform
* backface-visibility: visible;
* transform-style: preserve-3d;

#### 不定宽高垂直居中

* position: absolute; top: 50%; translate: -50%;
* table-cell + vertical-align: middle
* flex
* inline-block和高度100%的伪元素撑高盒子（适合父元素知道高度的情况）

#### flex:n

flex-grow: n; flex-shrink: 1; flex-base: 0%;
