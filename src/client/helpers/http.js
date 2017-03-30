const joinUrlParams = (url, params) => `${url}?${Object.keys(params).map(k => `${k}=${params[k]}`).join('&')}`;

// TODO handle failure case
function httpReq(type, url, body){
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(type, url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(body));
    xhr.onreadystatechange = function(){
      if(this.readyState === 4){
        if(this.status === 200) resolve(JSON.parse(this.responseText));
        else reject(new Error(`HTTP request failed with code: ${this.status}`));
      }
    };
  });
}

exports.get = (url, params) => httpReq('GET', joinUrlParams(url, params));
exports.put = (url, body) => httpReq('PUT', url, body);
exports.post = (url, body) => httpReq('POST', url, body);
