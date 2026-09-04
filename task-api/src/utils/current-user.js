function getCurrentUser(req) {
  return req.user || null;
}

module.exports = {
  getCurrentUser
};
