
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

  /* 
   *  Takes in the global context from which this function was called (i.e. the context with the friend and friend request information),
   *  and returns a partial to render based on whether or not the current user has sent a friend request or you have sent a friend request to
   *  the user, or neither of those has happened.
   *  Basically, the logic for determining which button to render when user data is recieved in the search results.
   */
  function whichUser (context) {
    //console.log(context);
    //console.log(this);

    const friendRequestRecievedAndSent = [...context.friendRequests, ...context.friendRequestsSent];
    //console.log(friendRequestRecievedAndSent);
    const friendRequestRecievedAndSentUsernames = friendRequestRecievedAndSent.map(user => user.username);
    //console.log(friendRequestRecievedAndSentUsernames);
    const friendRequestsRecievedUsernames = context.friendRequests.map(user => user.username);
    //console.log(friendRequestsRecievedUsernames);
    const friendRequestsSentUsernames = context.friendRequestsSent.map(user => user.username);
    //console.log(friendRequestsSentUsernames);

    if (!friendRequestRecievedAndSentUsernames.includes(this.username)) {
      //console.log('NO FRIEND REQUESTS');
      return 'user-search-result';
    } else if (friendRequestsRecievedUsernames.includes(this.username)) {
      //console.log(this);
      return 'user-search-result-friend-request-recieved'
    } else {
      //console.log("FRIEND REQUEST SENT");
      return 'user-search-result-friend-request-sent';
    }
  }
  
  module.exports = {to_hours, withAuth, has_friend_requests, has_selected_a_game, whichUser};