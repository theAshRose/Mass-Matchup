import { removeFriendButtonOnClick, seeStatsButtonOnClick, compareStats } from './home.js';

///// /user/results
const usernameInputForm = document.getElementById('username-input-form');

/* 
 *  Holds logic for the accept friend button on the user search page on click. 
 *  When the accept friend request button is hit we must:
 *    1. Get the ID of the friend request.
 *    2. Get the user ID of the friend to add.
 *    3. Get the username and steam avatar to create the sidebar element later.
 *    4. Remove the result card from the DOM.
 *    5. Make a POST request to the server to add new friend relationship.
 *    6. Make a DELETE request to the server to remove the friend request.
 *    7. Render the friend in the friends sidebar.
 *    8. Remove the friend request in the sidebar from the DOM.
 *    9. If there's no more friend requests, remove the header.
 *    10. Add the event listeners to the newly created buttons.
 */
async function acceptFriendRequest(event) {
  /* 1. Get the ID of the friend request. */
  const buttonClicked = $(event.target);

  const friendReqID = parseInt(buttonClicked.parent().attr('friend-req-id'));

  /* 2. Get the user ID of the friend to add. */
  const friendID = parseInt(buttonClicked.parent().attr('data-user-id'));

  /* 3. Get the username and steam avatar to create the sidebar element later. */
  const steamAvatar = buttonClicked.parent().find('img').attr('src');

  const username = buttonClicked.parent().find('.card-body').children().eq(1).html();

  /* 4. Remove the result card from the DOM. */
  const divToRemove = buttonClicked.parent().parent();
  divToRemove.remove();

  /* 5. Make a POST request to the server to add new friend relationship. */
  const response1 = await fetch(`/friends/accept`, {
    method: 'POST',
    body: JSON.stringify({ friend: friendID }),
    headers: { 'Content-Type': 'application/json' }
  });

  let friendRelationshipID;

  await response1.json().then((response) => {
    friendRelationshipID = response.id;
  });

  console.log(friendRelationshipID);

  /* 6. Make a DELETE request to the server to remove the friend request. */
  const response2 = await fetch(`/friends/request/${friendReqID}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });

  /* 7. Render the friend in the friends sidebar. */
  const friendsList = $('#sidebar-friends-list');

  const divToAdd = $(`<div class="card p-0 mb-1" id="friend-element-${friendRelationshipID}">`);

  divToAdd.html(`<button type="button" class="btn sidebar-button col-12 p-0 d-flex justify-content-between align-items-center"
  type="button" data-bs-toggle="collapse" data-bs-target="#sidebar-user-id-${friendID}" aria-expanded="false"
  aria-controls="collapseExample">
  <img src="${steamAvatar}"
      class="img-fluid sidebar-user-image rounded p-0 me-3" alt="..." />
  <p class="me-2 card-text friend-text">${username}</p>
</button>
<div class="collapse" id="sidebar-user-id-${friendID}" data-friend-id="${friendRelationshipID}">
  <div class="card-body p-1 pt-2 d-flex justify-content-between">
      <button type="button" class="btn blue-glow-btn btn-sm see-stats-button">See stats</button>
      <button type="button" class="btn green-glow-btn btn-sm compare-stats-button">Compare stats</button>
      <button type="button" class="btn red-glow-btn btn-sm remove-friend-button">Remove Friend</button>
  </div>
</div>`);

  friendsList.append(divToAdd);

  /* 8. Remove the friend request in the sidebar from the DOM. */
  const friendRequestElement = $(`#friend-request-element-${friendReqID}`);
  friendRequestElement.remove();

  /* 9. If there's no more friend requests, remove the header. */
  const friendRequests = $('.friend-request-element');
  if (!friendRequests.length) {
    const friendRequestsHeader = $('#friend-requests-header');
    friendRequestsHeader.remove();
  }

  /* 10. Add the event listeners to the newly created buttons. */
  const createdFriendElement = $(`#friend-element-${friendRelationshipID}`);
  const removeFriendButton = createdFriendElement.find(`.remove-friend-button`);
  const createdCompareStatsButton = createdFriendElement.find(`.compare-stats-button`);
  const createdSeeStatsButton = createdFriendElement.find(`.see-stats-button`);

  removeFriendButton.on('click', removeFriendButtonOnClick);
  createdCompareStatsButton.on('click', compareStats);
  createdSeeStatsButton.on('click', seeStatsButtonOnClick);
}


/* 
 *  Logic for the deny friend request button on click. 
 *  When the deny friend request button is clicked we must:
 *    1. Get the friend request ID of the request to deny.
 *    2. Remove the element from the user search page.
 *    3. Remove the request from the friends sidebar.
 *    4. If there are no more friend requests, remove the header.
 *    5. Send a DELETE request to the server to delete the friend request.
 */
async function denyFriendRequest(event) {
  const buttonClicked = $(event.target);

  /* 1. Get the friend request ID of the request to deny. */
  const friendRequestID = parseInt(buttonClicked.parent().attr('friend-req-id'));
  console.log(friendRequestID);

  /* 2. Remove the element from the user search page. */
  buttonClicked.parent().parent().remove();

  /* 3. Remove the request from the friends sidebar. */
  const friendRequestElement = $(`#friend-request-element-${friendRequestID}`);
  friendRequestElement.remove();

  /* 4. If there are no more friend requests, remove the header. */
  const friendRequests = $('.friend-request-element');
  if (!friendRequests.length) {
    const friendRequestsHeader = $('#friend-requests-header');
    friendRequestsHeader.remove();
  }

  /* 5. Send a DELETE request to the server to delete the friend request. */
  const response = await fetch(`/friends/request/${friendRequestID}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
}

const searchUsers = async (event) => {
  event.preventDefault();

  const username = document.querySelector("#username-input").value.trim();
  //console.log('VICTORY')
  if (username) {
    usernameInputForm.reset();

    document.location.replace(`/user/search?name=${username}`);
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
    console.log(response + "victory 2");
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
$('#username-input-form').on('submit', searchUsers);
$('.acceptFriendRequestBtn').on('click', acceptFriendRequest);
$('.denyFriendRequestBtn').on('click', denyFriendRequest);
