

const ctx = document.getElementById('graph-box');


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
             headers: { 'Content-Type': 'application/json' },
         });
         console.log(response)
         if (response.ok) {
            console.log("response OK")
              window.location.replace(`/compare/sharedGames/${appId}`)
         } else {
             alert('Search failed! Twy again UwU');
         }
     }
 };


 const myChart = new Chart(ctx, {
     type: 'bar',
     data: {
         labels: [' '],
         datasets: [
         {
             label: 'You',
             data: [0],
             backgroundColor: [
                 'rgba(54, 162, 235, 0.2)',
                 //'rgba(255, 99, 132, 0.2)',
             ],
             borderColor: [
                 'rgba(54, 162, 235, 1)',
                 //'rgba(255, 99, 132, 1)',
             ],
             borderWidth: 1,
             maxBarThickness: 150
         },
         {
             label: 'Your Friend',
             data: [0],
             backgroundColor: [
                 //'rgba(54, 162, 235, 0.2)',
                 'rgba(255, 99, 132, 0.2)',
             ],
             borderColor: [
                 //'rgba(54, 162, 235, 1)',
                 'rgba(255, 99, 132, 1)',
             ],
             borderWidth: 1,
             maxBarThickness: 150
         }]
     },
     options: {
         plugins: {
 
         },
         scales: {
             x: {
                 grid: {
                     display: false
                 }
             },
             y: {
                 beginAtZero: true,
                 grid: {
                     display: false
                 }
             }
         }
     }
 });


 function updateChartData(event) {
    event.preventDefault()
    console.log('we in')
    let clickedBtn = $(event.target);
    myChart.data.labels.splice(0, 1, clickedBtn.text())

    let userScore = parseInt(clickedBtn.attr("comparedstatsdata"))
    console.log(userScore, "user")
    const splitMe = clickedBtn.attr("comparedstatsdata").split("")
    const flipMe = splitMe.reverse()
    const finishMe = flipMe.join("")
    const goAgain = parseInt(finishMe)
    const stringUp = goAgain.toString()
    const splitAgain = stringUp.split("")
    const flipAgain = splitAgain.reverse()
    const onceMoreWithFeeling = flipAgain.join("")
    const friendScore = parseInt(onceMoreWithFeeling)
    console.log(friendScore, "friend")

    myChart.data.datasets[0].data.splice(0, 1, userScore)
    myChart.data.datasets[1].data.splice(0, 1, friendScore)

    myChart.update();
}


$(".comparedStat").on("click", updateChartData)






$(".sharedGameBtn").on("click", doubleStats)