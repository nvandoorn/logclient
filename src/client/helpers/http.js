const HTTP = { OK: 200, NO_MOD: 304, SERVER_ERR: 500 }

const joinUrlParams = (url, params) => `${url}?${Object.keys(params).map(k => `${k}=${params[k]}`).join('&')}`

function httpReq (type, url, body) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest() // eslint-disable-line
    xhr.open(type, url)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(body))
    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE) { // eslint-disable-line
        if (this.status === HTTP.OK || this.status === HTTP.NO_MOD) {
          try {
            resolve(JSON.parse(this.responseText))
          } catch (err) {
            reject(new Error(`Failed to parse JSON: ${err.message}`))
          }
        } else reject(new Error(`HTTP request failed with code: ${this.status}`))
      }
    }
  })
}

exports.get = (url, params) => httpReq('GET', joinUrlParams(url, params))
exports.put = (url, body) => httpReq('PUT', url, body)
exports.post = (url, body) => httpReq('POST', url, body)
