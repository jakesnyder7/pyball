import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import './ComparisonChart.css';

export function ComparisonChart({player1, player2}) {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );
    
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
                boxWidth: 10,
            },
          },
          title: {
            display: true,
            text: 'PPR Fantasy Points per Week in 2021 Season',
            font: {
                size: 15
            }
          },
        },  
        scales: {
            xAxes: {
                title: {
                    display: true,
                    text: 'Week',
                    font: {
                        size: 15
                    }
                },
            },
            yAxes: {
                title: {
                    display: true,
                    text: 'Fantasy Points (PPR)',
                    font: {
                        size: 15
                    }
                }
            }
        },
        backgroundColor: 'blue',    
      };
    
    const labels = Array.from({length: 22}, (_, i) => i + 1);
    
    const p1Data = [];
    let j = 0;
    for(let i = 0; i < labels.length; i++) {
        if(labels[i] === player1.week[j]) {
            p1Data.push(player1.fantasy_points_ppr[j++]);
        } else {
            p1Data.push(0);
        }
    }

    const p2Data = [];
    let k = 0;
    for(let i = 0; i < labels.length; i++) {
        if(labels[i] === player2.week[k]) {
            p2Data.push(player2.fantasy_points_ppr[k++]);
        } else {
            p2Data.push(0);
        }
    }

    const data = {
        labels,
        datasets: [
          {
            label: player1.full_name,
            data: p1Data,
            borderColor: player1.team_color,
            backgroundColor: player1.team_color2,
          },
          {
            label: player2.full_name,
            data:  p2Data,
            borderColor: player2.team_color2,
            backgroundColor: player2.team_color,
          },
        ],
      };
    return (
        <div className='Chart' >
            <Line options={options} data={data} />
        </div>
    );
}