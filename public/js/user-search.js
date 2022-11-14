///// /user/results
const usernameInputForm = document.getElementById('username-input-form');

const searchUsers = async (event) => {
  event.preventDefault();
    
  const username = document.querySelector("#username-input").value.trim();
  //console.log('VICTORY')
  if (username) {
    usernameInputForm.reset();
    const response = await fetch("/user/results", {
      method: "POST",
      body: JSON.stringify({ username }),
      headers: { "Content-Type": "application/json" },
    });
    //console.log(response+"victory 2");
    if (response.ok) {
      document.location.replace("/user/content");
    } else {
      alert("No results found");
    }
  }
};

/* Logic for the search all users button on click. */
function searchAllUsers(event) {
  usernameInputForm.reset();

  document.location.replace('/user/search/all');
}

const addFriend = async (event) => {
    event.preventDefault();

    let friendId = $(event.target)
    let friend1 = friendId.parent().attr('dataUserId')
 
    let friend = parseInt(friend1)

    if (friend) {
        const response = await fetch("/friends/request", {
          method: "POST",
          body: JSON.stringify({ friend }),
          headers: { "Content-Type": "application/json" },
        });
        console.log(response+"victory 2");
        if (response.ok) {
          friendId.text("Friend Request Sent!");
          friendId.off("click", addFriend);
          //document.location.replace("/user/content");
        } else {
          alert("No results found");
        }
    }
}

  $("#search-user-button").on("click", searchUsers);
  $("#search-all-users-button").on("click", searchAllUsers);
  $(".addFriendBtn").on("click", addFriend);
  $('username-input-form').on('submit', searchUsers);
  