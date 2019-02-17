let imgBlob = null;
let reader = new FileReader();

canvas.ondragover = function (e) {
  e.preventDefault();
}

canvas.ondrop = function (e) {
  // 读取拖拽对象
  imgBlob = e.dataTransfer.files[0];
  // 校验是否是图片元素
  if (! checkIsImgBlob(imgBlob)) {
    return ;
  }
  // reader的读取是异步操作
  reader.readAsDataURL(imgBlob);
  e.preventDefault();
}

function checkIsImgBlob (fileBlob) {
  try {
    if (fileBlob.type.startsWith('image/')) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    notice();
    return false;
  }
}

// 提示拖拽的元素不是图片
function notice () {
  console.log('type of the dragged element is not image blob.')
}

document.body.ondrop = function (e) {
  e.stopPropagation();
  e.preventDefault();
}

reader.addEventListener('loadend', (e) => {
  console.log('file loadend');
  addNewImage(reader.result);
})

function addNewImage (src) {
  let newImg = new Image();
  newImg.addEventListener('load', (e) => {
    console.log('newImg loaded');
    drawOnCanvas(newImg)
  })
  newImg.src = src;
}
