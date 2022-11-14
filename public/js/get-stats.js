const getOwnedGameStats = async (event) => {
    event.preventDefault();

    let button;
    let clickedElement = event.target;

    if (!clickedElement.matches("button")) {
        button = clickedElement.closest('button');
    } else {
        button = clickedElement;
    }

    const appId = button.getAttribute("ownedGameAppId");
    console.log(appId);
    if (!appId) {
        alert("please try again")
    } else {
        const response = await fetch('/user-stats/ownedGameStats', {
            method: 'POST',
            body: JSON.stringify({ appId }),
            headers: { 'Content-Type': 'application/json' },
        });
        console.log(response)
        if (response.ok) {
            const response = await fetch('/user-stats/ownedGameStats', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                window.location.replace('/user-stats/ownedGameStats')
                // alert("am i the working?")
            }
        } else {
            window.location.replace('/403')
            alert('Search failed! Twy again UwU');
        }
    }
};


$(".ownedGameBtn").on("click", getOwnedGameStats)