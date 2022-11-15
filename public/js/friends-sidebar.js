/* This file holds the logic for the friends sidebar buttons. */

/* 
 *  Logic for the friend request button on click.
 *  When the accept friend request button is clicked we must:
 *      1. Get the id of the friend request.
 *      2. Send a POST request to the friends route to add a new friend.
 *      3. Make a DELETE request to the friends request route to delete the friend request.
 *      4. Remove the friend request card from the sidebar HTML.
 *      5. Add the HTML of the friend on the sidebar HTML.
 *      6. If there are no more friend requests, remove the friend requests header.
 *      7. Add logic to the buttons of the created friend element.
 */
async function friendRequestAcceptButtonOnClick(event) {
    /* 1. Get the id of the friend request. */
    const buttonClicked = event.target;

    const friendRequestCard = buttonClicked.closest('.collapse');

    const friendRequestIDString = friendRequestCard.getAttribute('id');

    const friendRequestID = parseInt(friendRequestIDString.match(/\d+/g)[0]);

    const friendID = parseInt(friendRequestCard.getAttribute('data-friend-id'));

    /* 2. Send a POST request to the friends route to add a new friend. */
    const response1 = await fetch(`/friends/accept`, {
        method: 'POST',
        body: JSON.stringify({ friend: friendID }),
        headers: { 'Content-Type': 'application/json' }
    });

    let friendRelationshipID;

    await response1.json().then((response) => {
        friendRelationshipID = response.id;
    });

    /* 3. Make a DELETE request to the friends request route to delete the friend request. */
    const response2 = await fetch(`/friends/request/${friendRequestID}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

    const username = $(`#friend-req-username-${friendRequestID}`).html();

    const friendAvatar = $(`#friend-req-image-${friendRequestID}`).attr('src');

    /* 4. Remove the friend request card from the sidebar HTML. */
    const friendRequestElement = $(`#friend-request-element-${friendRequestID}`);
    friendRequestElement.remove();

    /* 5. Add the HTML of the friend on the sidebar HTML. */
    const friendsList = $('#sidebar-friends-list');

    const divToAdd = $(`<div class="card p-0 mb-1" id="friend-element-${friendRelationshipID}">`);

    divToAdd.html(`<button type="button" class="btn sidebar-button col-12 p-0 d-flex justify-content-between align-items-center"
    type="button" data-bs-toggle="collapse" data-bs-target="#sidebar-user-id-${friendID}" aria-expanded="false"
    aria-controls="collapseExample">
    <img src="${friendAvatar}"
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

    /* 6. If there are no more friend requests, remove the friend requests header. */
    const friendRequests = $('.friend-request-element');
    if (!friendRequests.length) {
        const friendRequestsHeader = $('#friend-requests-header');
        friendRequestsHeader.remove();
    }

    /* 7. Add logic to the buttons of the created friend element. */
    const createdFriendElement = $(`#friend-element-${friendRelationshipID}`);
    const removeFriendButton = createdFriendElement.find(`.remove-friend-button`);
    const createdCompareStatsButton = createdFriendElement.find(`.compare-stats-button`);
    const createdSeeStatsButton = createdFriendElement.find(`.see-stats-button`);

    removeFriendButton.on('click', removeFriendButtonOnClick);
    createdCompareStatsButton.on('click', compareStats);
    createdSeeStatsButton.on('click', seeStatsButtonOnClick);
}

/* 
 *  Logic for the friend request deny button on click. 
 *  When the friend request deny button is clicked we must:
 *      1. Get the id of the friend request.
 *      2. Make a DELETE request to delete the friend request.
 *      3. Remove the friend request element from the DOM.
 *      4. If there are no more friend requests, remove the friend request header element.
 */
async function friendRequestDenyButtonOnClick(event) {
    /* 1. Get the id of the friend request. */
    const buttonClicked = event.target;

    const friendRequestCard = buttonClicked.closest('.collapse');

    const friendRequestIDString = friendRequestCard.getAttribute('id');

    const friendRequestID = parseInt(friendRequestIDString.match(/\d+/g)[0]);

    /* 2. Make a DELETE request to delete the friend request. */
    const response = await fetch(`/friends/request/${friendRequestID}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

    /* 3. Remove the friend request element from the DOM. */
    const friendRequestElement = $(`#friend-request-element-${friendRequestID}`);
    friendRequestElement.remove();

    /* 4. If there are no more friend requests, remove the friend request header element. */
    const friendRequests = $('.friend-request-element');
    if (!friendRequests.length) {
        const friendRequestsHeader = $('#friend-requests-header');
        friendRequestsHeader.remove();
    }
}

/*
 *  Holds the logic button for the friend button on click. 
 *  On click, the friend button must:
 *      1. Get the user ID of the friend.
 *      2. Redirect the user to the proper page using the ID.
 */
function seeStatsButtonOnClick(event) {
    /* 1. Get the user ID of the friend. */
    const seeStatsButton = event.target;
    const collapseElement = seeStatsButton.closest(".collapse");
    const friendID = parseInt(collapseElement.getAttribute('id').match(/\d+/g)[0]);

    /* 2. Redirect the user to the proper page using the ID. */
    document.location.replace(`/friends/${friendID}/stats`);
}

/*
 *  Holds the logic for the remove friend button on click.
 *  When the remove friend button is clicked we must:
 *      1.  Get the ID of the friend relationship we want to remove.
 *      2.  Remove the element from the DOM.
 *      3.  Make a DELETE request to the server to delete the friend relationship.
 */
async function removeFriendButtonOnClick(event) {
    const buttonClicked = event.target;
    
    /* 1.  Get the ID of the friend relationship we want to remove. */
    const friendID = parseInt(buttonClicked.closest('.collapse').getAttribute('data-friend-id'));

    /* 2.  Remove the element from the DOM. */
    const friendElement = $(`#friend-element-${friendID}`);
    friendElement.remove();

    /* 3.  Make a DELETE request to the server to delete the friend relationship.  */
    const response = await fetch(`/friends/${friendID}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
}

///////////////////////doms work below////////
const compareStats = async (event) => {
    event.preventDefault();
    let clickedBtn = $(event.target)
    const splitMe = clickedBtn.parents().eq(1).attr("id").split("")
    const flipMe = splitMe.reverse()
    const finishMe = flipMe.join("")
    let friend = parseInt(finishMe)
   console.log(friend);
   if (!friend) {
       alert("please try again")
   } else {
       const response = await fetch('/compare', {
           method: 'POST',
           body: JSON.stringify({ friend }),
           headers: { 'Content-Type': 'application/json' },
       });
       console.log(response)
       if (response.ok) {
           const response = await fetch('/compare/sharedGames', {
               method: 'GET',
               headers: { 'Content-Type': 'application/json' },
           });
           if (response.ok) {
               window.location.replace('/compare/sharedGames')
               // alert("am i the working?")
           }
       } else {

           alert('Search failed! Twy again UwU');
       }
   }
};


///////////////////end doms work//
$(".compare-stats-button").on("click", compareStats)
$(".see-stats-button").on('click', seeStatsButtonOnClick);;


$('.friend-request-accept-button').on('click', friendRequestAcceptButtonOnClick);
$('.friend-request-deny-button').on('click ', friendRequestDenyButtonOnClick);
$('.remove-friend-button').on('click', removeFriendButtonOnClick);

export { removeFriendButtonOnClick, seeStatsButtonOnClick, compareStats }