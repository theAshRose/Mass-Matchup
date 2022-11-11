
const withAuth = (req, res, next) => {
    if (!req.session.LoggedIn) {
      res.redirect('/login');
    } else {
      next();
    }
  };

  function to_hours (min) {
    let hours = min / 60
    return Math.trunc(hours);
  }

  function has_friend_requests (friendRequestList) {
    return (friendRequestList.length > 0);
  }
  
  module.exports = {to_hours, withAuth, has_friend_requests};