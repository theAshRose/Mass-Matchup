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

    document.location.replace(`/user-stats/ownedGameStats/${appId}`);
};

$(".ownedGameBtn").on("click", getOwnedGameStats)