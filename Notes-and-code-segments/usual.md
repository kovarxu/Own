### Cookie的处理

delCookie, getCookie, setCookie

### 浏览器信息

```javascript
let browser = {
	versions: function () {
		let u = navigator.userAgent;
		return {
			trident: u.indexOf('Trident') > -1, //IE内核
			presto: u.indexOf('Presto') > -1, //opera内核
			webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
			gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
			mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
			ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
			iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
			iPad: u.indexOf('iPad') > -1, //是否iPad
			webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
            qq: u.match(/\sQQ/i) == " qq" //是否QQ
		};
	}(),
	language: (navigator.browserLanguage || navigator.language).toLowerCase()
}
```

### 判定

* 判断电话号码 规则：11位、第二位不是0 
`/^1[1-9]\d{9}$/`
* 判断邮箱 规则：以\w构成、以不是_的字符开头、@之前不是.和_、最后的.后来跟2-3位域名
`/^([a-zA-Z0-9]+[_\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_\.]?)*[a-zA-Z0-9]+\.{a-zA-Z}{2,3}$/`
* 身份证号验证
```
function checkIndetification (str, type) {
  
}
```