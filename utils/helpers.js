const withAuth = (req, res, next) => {
    if (!req.session.LoggedIn) {
      res.redirect('/login');
    } else {
      next();
    }
  };

  function to_hours (min) {
    let hours = min / 60
    return Math.trunc(hour);
  }
  
  module.exports = {to_hours, withAuth};