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
 */
async function friendRequestAcceptButtonOnClick(event) {
    /* 1. Get the id of the friend request. */
    const buttonClicked = event.target;

    const friendRequestCard = buttonClicked.closest('.collapse');

    const friendRequestIDString = friendRequestCard.getAttribute('id');

    const friendRequestID = parseInt(friendRequestIDString.match(/\d+/g)[0]);

    const friendID = parseInt(friendRequestCard.getAttribute('data-friend-id'));

    /* 2. Send a POST request to the friends route to add a new friend. */
    const response1 = await fetch(`friends/accept`, {
        method: 'POST',
        body: JSON.stringify({ friend: friendID }),
        headers: { 'Content-Type': 'application/json' }
    });

    console.log(response1);

    /* 3. Make a DELETE request to the friends request route to delete the friend request. */
    const response2 = await fetch(`friends/request/${friendRequestID}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

    console.log(response2);

    
    const username = $(`#friend-req-username-${friendRequestID}`).html();

    const friendAvatar = $(`#friend-req-image-${friendRequestID}`).attr('src');

    /* 4. Remove the friend request card from the sidebar HTML. */
    const friendRequestElement = $(`#friend-request-element-${friendRequestID}`);
    friendRequestElement.remove();

    /* 5. Add the HTML of the friend on the sidebar HTML. */
    const friendsList = $('#sidebar-friends-list');

    const divToAdd = $('<div class="card p-0 mb-1">');

    divToAdd.html(`<button type="button" class="btn btn-outline-primary col-12 p-0 d-flex justify-content-between align-items-center"
    type="button" data-bs-toggle="collapse" data-bs-target="#sidebar-user-id-${friendID}" aria-expanded="false"
    aria-controls="collapseExample">
    <img src="${friendAvatar}"
        class="img-fluid sidebar-user-image rounded p-0 me-3" alt="..." />
    <p class="me-2 card-text friend-text">${username}</p>
</button>
<div class="collapse" id="sidebar-user-id-${friendID}">
    <div class="card-body p-1 pt-2 d-flex justify-content-between">
        <button type="button" class="btn btn-primary btn-sm">See stats</button>
        <button type="button" class="btn btn-success btn-sm">Compare stats</button>
        <button type="button" class="btn btn-danger btn-sm">Remove Friend</button>
    </div>
</div>`);

    friendsList.append(divToAdd);

    /* 6. If there are no more friend requests, remove the friend requests header. */
    const friendRequests = $('.friend-request-element');
    if (!friendRequests.length) {
        const friendRequestsHeader = $('#friend-requests-header');
        friendRequestsHeader.remove();
    }
}

$('.friend-request-accept-button').on('click', friendRequestAcceptButtonOnClick);