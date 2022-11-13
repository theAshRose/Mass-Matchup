const doubleStats = async (event) => {
     event.preventDefault();
     event.preventDefault();
     let clickedBtn = $(event.target)
     const appId = clickedBtn.attr("sharedGameAppId")
     console.log(appId);
     if (!appId) {
         alert("please try again")
     } else {
         const response = await fetch(`/compare/sharedGames/${appId}`, {
             method: 'GET',
            //  params: JSON.stringify({ appId }),
             headers: { 'Content-Type': 'application/json' },
         });
         console.log(response)
         if (response.ok) {
            console.log("response OK")
              window.location.replace(`/compare/sharedGames/${appId}`)
            //  const response = await fetch('/user-stats/ownedGameStats', {
            //      method: 'GET',
            //      headers: { 'Content-Type': 'application/json' },
            //  });
            //  if (response.ok) {
                //  window.location.replace(`/user-stats/ownedGameStats/`)
            //      // alert("am i the working?")
            //  }
         } else {
             alert('Search failed! Twy again UwU');
         }
     }
 };


$(".sharedGameBtn").on("click", doubleStats)