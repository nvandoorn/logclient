const joinUrlParams = (url, params) => `${url}?${Object.keys(params).map(k => `${k}=${params[k]}`).join('&')}`;

// TODO handle failure case
function httpReq(type, url, body){
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(type, url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(body));
    xhr.onreadystatechange = function(){
      if(this.readyState === 4 && this.status === 200) {
        const data = JSON.parse(this.responseText);
        resolve(data);
      }
    };
  });
}

export const httpGetJson = (url, params) => httpReq('GET', joinUrlParams(url, params));
export const httpPutJson = (url, body) => httpReq('PUT', url, body);
