const routes = require('./constants').routes

// TODO more terse
exports.getJoinedRoutes = baseRoute => {
  let joinedRoutes = {}
  Object.keys(routes).forEach(k => { joinedRoutes[k] = baseRoute + routes[k] })
  return joinedRoutes
}
