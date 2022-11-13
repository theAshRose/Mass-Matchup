
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

  /* 
   *  Returns true if the user has selected a game, false if statistics list is undefined or is an empty set.
   *  This is used by the handlebars compare-stats template to determine whether or not to render the graph and statistics list dropdown if they are both empty.
   */
  function has_selected_a_game (statisticsList) {
    if (!statisticsList) {
      return false;
    } else {
      if (statisticsList.length) {
        return false;
      } else {
        return true;
      }
    }
  }
  
  module.exports = {to_hours, withAuth, has_friend_requests, has_selected_a_game};