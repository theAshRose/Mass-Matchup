/* This file holds the logic for the friends sidebar buttons. */

/* 
 *  Logic for the friend request button on click.
 *  When the accept friend request button is clicked we must:
 *      1. Get the id of the friend request.
 *      2. Send a POST request to the friends route to add a new friend.
 *      3. Make a DELETE request to the friends request route to delete the friend request.
 */
function friendRequestAcceptButtonOnClick(event) {
    console.log('TEST');

    const buttonClicked = event;
}

$('.friend-request-accept-button').on('click', friendRequestAcceptButtonOnClick);