/*
 *  Holds the logic for the recent game button on click.
 *  When the recent game button is clicked we must:
 *      1. Make sure we get the button element on click because of event delegation.
 *      2. Get the appid of the game that was clicked.
 *      3. Use Dom's function in get-stats.js to get the owned game stats because I can't easily determine how he set it up at a quick glance.
 */
async function recentGameButtonOnClick(event) {
    const clickedElement = event.target;
    let button;

    /* 1. Make sure we get the button element on click because of event delegation. */
    if (!clickedElement.matches("button")) {
        button = clickedElement.closest('button');
    } else {
        button = clickedElement;
    }

    /* 2. Get the appid of the game that was clicked. */
    const appID = parseInt(button.getAttribute('app-id'));

    /* 3. Use Dom's function in get-stats.js to get the owned game stats because I can't easily determine how he set it up at a quick glance. */
    if (!appID) {
        alert("please try again")
    } else {
        fetch('/user-stats/ownedGameStats', {
            method: 'POST',
            body: JSON.stringify({ appId: appID }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then((response) => {
                if (response.ok) {
                    document.location.replace('/user-stats/ownedGameStats');
                } else {
                    alert("response was not okay");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

}


$('.recent-game-button').on('click', recentGameButtonOnClick);