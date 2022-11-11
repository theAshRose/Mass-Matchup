const getOwnedGameStats = async (event) => {
    event.preventDefault();
    let clickedBtn = $(event.target)
    const appId = clickedBtn.attr("ownedGameAppId")
    console.log(appId);
    if (!appId) {
        alert("please try again")
    } else {
        const response = await fetch(`/user-stats/ownedGameStats`, {
            method: 'POST',
            body: JSON.stringify({ appId }),
            headers: { 'Content-Type': 'application/json' },
        });
        console.log(response)
        if (response.ok) {
            location.replace('/user-stats/ownedGameStats');
        } else {

            alert('Search failed! Twy again UwU');
        }
    }
};


$(".ownedGameBtn").on("click", getOwnedGameStats)