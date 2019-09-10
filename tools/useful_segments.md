## CSS

### input元素的不确定性

input由浏览器自动确定尺寸，如果用在flex布局之中而不指定宽度（仅指定flex:1是不够的），在一些情况下会在移动端出现bug
解决方案是将其包含在一个div中如`<div class="col-1"><input class="wrapped-in" /></div>`

## JS

### 一些dom元素的操作

* 禁止鼠标右键保存图片 `<img src=""  oncontextmenu="return false;">`
* 禁止鼠标拖动图片 `<img src="" ondragstart="return false;">`
* 文字禁止鼠标选中 `<p onselectstart="return false;">文字禁止鼠标选中</p>`
* 禁止复制文本 `<p onselect="document.selection.empty();">文字禁止鼠标选中</p>`
* 键盘输入 `ctrl+s` 不自动弹出保存网页框

```javascript
window.addEventListener('keydown', function(e) {
  if (e.key === 's' && e.ctrlKey) {
    e.preventDefault()
    ...
  }
}
```

* jquery禁止文本复制和拷贝

```javascript
$(document).bind("contextmenu copy selectstart", function() {
    return false;
});
```

* jquery禁止图片拖拽

```javascript
var img=$("img");
img.on("contextmenu",function(){return false;});
img.on("dragstart",function(){return false;});
```

### Ajax请求, 使用fetch或者XMLHttpRequest

```javascript
// 返回值是一个Obj
export default ajax(url = '', data = {}, type = 'GET', method = 'fetch') => {
	type = type.toUpperCase();
	url = (baseUrl || '') + url;

	if (type == 'GET') {
		let dataStr = ''; //数据拼接字符串
		Object.keys(data).forEach(key => {
			dataStr += key + '=' + data[key] + '&';
		})

		if (dataStr !== '') {
			dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
			url = url + '?' + dataStr;
		}
	}

	if (window.fetch && method == 'fetch') {
		let requestConfig = {
			credentials: 'include',
			method: type,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			mode: "cors",
			cache: "force-cache"
		}

		if (type == 'POST') {
			Object.defineProperty(requestConfig, 'body', {
				value: JSON.stringify(data)
			})
		}
		
		try {
			const response = await fetch(url, requestConfig);
			const responseJson = await response.json();
			return responseJson
		} catch (error) {
			throw new Error(error)
		}
	} else {
		return new Promise((resolve, reject) => {
			let requestObj;
			if (window.XMLHttpRequest) {
				requestObj = new XMLHttpRequest();
			} else {
				requestObj = new ActiveXObject;
			}

			let sendData = '';
			if (type == 'POST') {
				sendData = JSON.stringify(data);
			}

			requestObj.open(type, url, true);
			requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			requestObj.send(sendData);

			requestObj.onreadystatechange = () => {
				if (requestObj.readyState == 4) {
					if (requestObj.status == 200) {
						let obj = requestObj.response
						if (typeof obj !== 'object') {
							obj = JSON.parse(obj);
						}
						resolve(obj)
					} else {
						reject(requestObj)
					}
				}
			}
		})
	}
}
```

### 高度

* height + padding = clientHeight;
* border + clientHeight = offsetHeight;
* 子的margin + 子到父距离 + 父的padding = offsetTop;

### 滚动

* H5使用 `document.documentElement.scrollTop`
* 微信使用 `document.body.scrollTop`
* 内容高度 `document.documentElement.scrollHeight`和`document.body.scrollHeight`均可


