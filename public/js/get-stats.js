const getOwnedGameStats = async (event) => {
    event.preventDefault();
    let clickedBtn = $(event.target)
    const appId = clickedBtn.attr("ownedGameAppId")
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

            alert('Search failed! Twy again UwU');
        }
    }
};


$(".ownedGameBtn").on("click", getOwnedGameStats)