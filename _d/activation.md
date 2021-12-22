---
layout: post
title: "Activation Energy"

permalink: /activation
redirect_from:
  - activation-energy
---

Doing activities requires will power, addictions and procrastination require negative will power, while positive habits, especially new ones require high will power. Here's a model for these things.

<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.6.2/chart.min.js" integrity="sha512-tMabqarPtykgDtdtSqCL3uLVM0gS1ZkUAVhRFu1vSEFgvB73niFQWJuvviDyBGBH22Lcau4rHB5p2K2T0Xvr6Q==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/chartjs-plugin-annotation/1.2.1/chartjs-plugin-annotation.min.js" integrity="sha512-ooJBPaW5ClG2gzDFT6KIKVeA8Pcie6InrV/gFP+RH6P2hrCJNVjaggZrxT/CeBakKwOlSUwHEwMCa5iny0uJtw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

### Activation Energy

To activiate an activity, we need to stop the current activty, and start the new one.

<p>
$$ Activation(NewActivity) = Stopping(CurrentActivity) + StartingEnergy(NewActivity)$$
</p>

### Starting Energy

The amount of energy required to being an activity. Addictions are negative, habits are neutral, and new positive habits are positive. Things you are avoiding, your mental quick sand, can be every high positive.

<p>
<canvas id="chart-starting-energy"></canvas>
</p>
<script>
defer (()=>  {
const ctx = "chart-starting-energy"
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['TikTok','Going to Work' ,  'Existing Habit', 'Meditating',  'Thing being avoided', ],
        datasets: [{
            label:"",
            data: [-50, -10, 5, 20, 80 ],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
            ],
        }]
    },
    options: {
        plugins: {
            autocolors:true,
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Starting Energy By Activity'
       }
        },

        scales: {
                y: {
                    beginAtZero: true
                }
            }
    }

});
console.log(ctx,myChart)
})
</script>

### Stopping Energy

The amount of energy required to stop an activity. This usually varies over time. Movies have a natural drop in stopping energy at the end of the movie, but the magic of TikTok and Casinos is they are designed to never reduce in stopping energy

<canvas id="chart-stopping-over-time">canvas>

</p>
<script>
defer(() => {
  const ctx = "chart-stopping-over-time";
  annotations = {
    /*
        line1:{
            // Indicates the type of annotation
            type: 'line',
            ymin: 80,
            ymax: 80,
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
        }
*/
    "l1": {
      // Indicates the type of annotation
      "type": "label",
      "xValue": 2.5,
      "yValue": 30,
      "content": ["Why I never go to the", " gym after work"]
    },
    "l2": {
      // Indicates the type of annotation
      "type": "point",
      "xValue": 2,
      "yValue": 20,
      "backgroundColor": "rgb(0, 128, 0)",
      "label": {
        "enabled": true,
        "content": "I wish I was here"
      }
    },
    "vline": {
      "type": "line",
        borderDash: [6, 6],
      "value": 40,
      scaleID:"y",
      "label": {
        "enabled": true,
        "content": "Gym Starting Energy"
      }
    }
  };
  annotations={}

const myChart = new Chart(ctx, {
"type": "line",
"data": {
"labels": ["00h30", "01h00", "01h30", "02h00", "02h30"],
"datasets": [
{
"label": "Movie",
"data": [70, 80, 80, 80, 10],
"borderColor": "rgba(0, 155, 132, 0.2)"
},
{
"label": "TikTok",
"data": [80, 90, 90, 80, 75],
"borderColor": "rgba(255, 99, 132, 0.2)"
}
]
},
"options": {
"plugins": {
"title": {
"display": true,
"text": "Stopping Energy over time in hours"
},
"annotation": {
"annotations": annotations
}
},

      "scales": {
        "y": {
          "beginAtZero": true
        }
      },
      "elements": {
        "point": {
          "radius": 0
        }
      }
    }

});
console.log(ctx, myChart);
})
</script>

### Will Power

For me, will power is very strong in the morning, but drops over time. Doing my morning habits really charges up my will power, but you can see why I can never get to the gym after work, my gym starting energy exceeds my remaining will power.

<canvas id="chart-willpower-over-time">canvas>

</p>
<script>
defer(() => {
  const ctx = "chart-willpower-over-time";
  annotations = {
    /*
        line1:{
            // Indicates the type of annotation
            type: 'line',
            ymin: 80,
            ymax: 80,
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
        }
*/
    "l1": {
      // Indicates the type of annotation
      "type": "label",
      "xValue": 2.5,
      "yValue": 30,
      "content": ["Why I never go to the", " gym after work"]
    },
    "l2": {
      // Indicates the type of annotation
      "type": "point",
      "xValue": 2,
      "yValue": 20,
      "backgroundColor": "rgb(0, 128, 0)",
      "label": {
        "enabled": true,
        "content": "I wish I was here"
      }
    },
    "vline": {
      "type": "line",
        borderDash: [6, 6],
      "value": 40,
      scaleID:"y",
      "label": {
        "enabled": true,
        "content": "Gym Starting Energy"
      }
    }
  };

const myChart = new Chart(ctx, {
"type": "line",
"data": {
"labels": ["5:00", "8:00", "15:00", "20:00"],
"datasets": [
{
"label": "Default",
"data": [80, 70, 20, 10],
"borderColor": "rgba(0, 155, 132, 0.2)"
},
{
"label": "With Morning Habits",
"data": [80, 90, 30, 15],
"borderColor": "rgba(255, 99, 132, 0.2)"
}
]
},
"options": {
"plugins": {
"title": {
"display": true,
"text": "Will Power over Time"
},
"annotation": {
"annotations": annotations
}
},

      "scales": {
        "y": {
          "beginAtZero": true
        }
      },
      "elements": {
        "point": {
          "radius": 0
        }
      }
    }

});
console.log(ctx, myChart);
})
</script>
