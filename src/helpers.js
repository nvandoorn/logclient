const routes = require('./constants').routes
const axios = require('axios')

// TODO more terse
exports.getJoinedRoutes = baseRoute => {
  let joinedRoutes = {}
  Object.keys(routes).forEach(k => { joinedRoutes[k] = baseRoute + routes[k] })
  return joinedRoutes
}

exports.apiCalls = (middleware = req => req) => route => ({
  get: params => middleware(compressReq(axios.get(route, { params: params }))),
  put: body => middleware(compressReq(axios.put(route, body))),
  post: body => middleware(compressReq(axios.post(route, body))),
  del: body => middleware(compressReq(axios.delete(route, { data: body })))
})

const compressReq = req => new Promise((resolve, reject) => req.then(resp => resolve(resp.data)).catch(err => err))
