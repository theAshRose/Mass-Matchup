

const ctx = document.getElementById('graph-box');
let myChart;

const doubleStats = async (event) => {
    event.preventDefault();

    let button;
    let clickedElement = event.target;

    if (!clickedElement.matches("button")) {
        button = clickedElement.closest('button');
    } else {
        button = clickedElement;
    }

    const appID = button.getAttribute("sharedGameAppId");

    const friendID = parseInt(document.querySelector('.compare-user-card').getAttribute('friend-id'));

    document.location.replace(`/compare/${friendID}/stats/${appID}`);
};

if (ctx !== null) {
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [' '],
            datasets: [
                {
                    label: 'You',
                    data: [0],
                    backgroundColor: [
                        'rgba(4, 217, 255, .5)',
                        //'rgba(255, 99, 132, 0.2)',
                    ],
                    borderColor: [
                        'rgba(4, 217, 255, .5)',
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
                        'rgba(255, 49, 49, .5)',
                    ],
                    borderColor: [
                        //'rgba(54, 162, 235, 1)',
                        'rgba(255, 49, 49, .5)',
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
                    ticks: {
                        color: 'yellow'
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        color: 'yellow'
                    },
                    beginAtZero: true,
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

/* 
 *  Logic for the see stats button on click. 
 *  When the see stats button is clicked we must:
 *      1. Get the id of the user we want to see the stats for.
 *      2. Redirect to the appropriate page.
 */
function seeStats(event) {
    const buttonClicked = event.target;

    /* 1. Get the id of the user we want to see the stats for. */
    const friendID = parseInt(buttonClicked.getAttribute("data-friend-id"));

    /* 2. Redirect to the appropriate page. */
    fetch(`/api/games`, {
        method: 'POST',
        body: JSON.stringify({ id: friendID }),
        headers: { 'Content-Type': 'application/json' }
    })
        .then((response) => {
            if (response.ok) {
                document.location.replace(`/friends/${friendID}/stats`);
            } else if (response.status === 403) {
                alert("This user's game data is private");
            } else {
                alert("Unknown error occured");
            }
        })
        .catch((error) => {
            console.error(error);
        })
}

function updateChartData(event) {
    event.preventDefault()
    console.log('we in')
    let clickedBtn = $(event.target);
    myChart.data.labels.splice(0, 1, clickedBtn.text())

    let userScore = parseInt(clickedBtn.attr("comparedstatsdata"))
    console.log(userScore, "user")
    const split = clickedBtn.attr("comparedstatsdata").split("")
    const flip = split.reverse()
    const finish = flip.join("")
    const goAgain = parseInt(finish)
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
$("#see-stats-button").on('click', seeStats);