function to_hours(min) {
  let hours = min / 60
  return Math.trunc(hours);
}

function has_friend_requests(friendRequestList) {
  return (friendRequestList.length > 0);
}

/* 
 *  Returns true if the user has selected a game, false if statistics list is undefined or is an empty set.
 *  This is used by the handlebars compare-stats template to determine whether or not to render the graph and statistics list dropdown if they are both empty.
 */
function has_selected_a_game(statisticsList) {
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

function has_stats(statsList) {
  if (statsList.length) {
    return true;
  } else {
    return false;
  }
}

function has_user_search_results(resultsList) {
  if (resultsList.length) {
    return true;
  } else {
    return false;
  }
}

/* 
 *  Takes in the global context from which this function was called (i.e. the context with the friend and friend request information),
 *  and returns a partial to render based on whether or not the current user has sent a friend request or you have sent a friend request to
 *  the user, or neither of those has happened.
 *  Basically, the logic for determining which button to render when user data is recieved in the search results.
 */
function whichUser(context) {
  //console.log(context);
  //console.log(this);

  const friendRequestRecievedAndSent = [...context._locals.friendRequests, ...context._locals.friendRequestsSent];
  //console.log(friendRequestRecievedAndSent);
  const friendRequestRecievedAndSentUsernames = friendRequestRecievedAndSent.map(user => user.username);
  //console.log(friendRequestRecievedAndSentUsernames);
  const friendRequestsRecievedUsernames = context._locals.friendRequests.map(user => user.username);
  //console.log(friendRequestsRecievedUsernames);
  const friendRequestsSentUsernames = context._locals.friendRequestsSent.map(user => user.username);
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

function newsCleanUp(noNews) {
  if (!noNews) {
    return noNews
  } else {
    //console.log(noNews)
    if (noNews.indexOf('{') == 0) {
      badNews = noNews.split(/(?<=^\S+)\s/)
      goodNews = badNews.splice(1, 1)
      //console.log(goodNews)
      return goodNews
    }
  }
  return noNews
}

/*
 *  Takes in the global context and determines which stat result header to display
 */
function whichStatResultDisplay(context) {
  //console.log(context);

  if (!context.statResultsPage) {
    return 'no-game-button-clicked';
  } else if (context.stats.length) {
    return 'stats-for-game';
  } else {
    return 'no-stats-for-game';
  }
}

function whichCompareStatDisplay() {
  //console.log(this);

  if (!this.compareStatsDisplay) {
    return 'no-game-button-clicked';
  } else if (this.finalStats.length) {
    return 'compare-stats-results';
  } else {
    return 'no-compare-stats-results';
  }
}

function whichUserSearchResultDisplay() {
  //console.log(this);

  if (!this.searchResults) {
    return 'no-search-button-clicked';
  } else if (this.userResults.length) {
    return 'user-search-results'
  } else {
    return 'no-user-search-results'
  }


}


module.exports = { to_hours, has_friend_requests, has_selected_a_game, whichUser, newsCleanUp, has_stats, whichStatResultDisplay, whichCompareStatDisplay, whichUserSearchResultDisplay };