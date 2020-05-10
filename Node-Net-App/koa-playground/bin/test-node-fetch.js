const fetch = require('node-fetch')

// const http = require('http');
// const https = require('https');

// const httpAgent = new http.Agent({
// 	keepAlive: true
// });
// const httpsAgent = new https.Agent({
// 	keepAlive: true
// });

// const options = {
// 	agent: function(_parsedURL) {
// 		if (_parsedURL.protocol == 'http:') {
// 			return httpAgent;
// 		} else {
// 			return httpsAgent;
// 		}
// 	}
// };

fetch('https://www.xiaoyusan.com')
  .then(checkStatus)
	.then(res => {
    console.log(res.headers.raw())
    return res.text()
  })
  .then(body => console.log(body))
  .catch(err => console.error(err))

function checkStatus(res) {
  if (res.ok) {
    // res.status >= 200 && res.status < 300
    return res;
  } else {
    throw new Error(res.statusText);
  }
}
