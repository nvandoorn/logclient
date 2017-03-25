const request = require('request');

const push = function(method){
  return function(route, body){
    return new Promise(function(resolve, reject) {
      request({
        url: route,
        method: method,
        json: body
      }, function(err, response, body){
        if(err) reject(err);
        resolve(body);
      });
    });
  }
}

exports.get = function(route, params){
  return new Promise(function(resolve, reject){
    request({
      url: route,
      method: 'GET',
      qs: params
    }, function(err, response, body){
      if(err) reject(err);
      resolve(JSON.parse(body))
    });
  });
};

exports.put = push('PUT');
exports.post = push('POST');
