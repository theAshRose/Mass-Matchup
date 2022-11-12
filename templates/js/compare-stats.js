const ctx = document.getElementById('graph-box');

const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Stat.shotgun_spas.Head.Total'],
        datasets: [
        {
            label: 'davinchi',
            data: [19],
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
            label: 'david44',
            data: [12],
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

