---
layout: post
title: "Activation Energy"
mathjax: true

permalink: /activation
redirect_from:
  - activation-energy
---

Doing activities requires will power, addictions and procrastination require negative will power, while positive habits, especially new ones require high will power. Here's a model for these things.

<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.6.2/chart.min.js" integrity="sha512-tMabqarPtykgDtdtSqCL3uLVM0gS1ZkUAVhRFu1vSEFgvB73niFQWJuvviDyBGBH22Lcau4rHB5p2K2T0Xvr6Q==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/chartjs-plugin-annotation/1.2.1/chartjs-plugin-annotation.min.js" integrity="sha512-ooJBPaW5ClG2gzDFT6KIKVeA8Pcie6InrV/gFP+RH6P2hrCJNVjaggZrxT/CeBakKwOlSUwHEwMCa5iny0uJtw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

### Activation Energy

To begin an activity, we need to stop the current activity, and start the new one. E.g.

<p>
$$
\text{Energy}_{\text{activation}}
   = \text{Energy}_{\text{Stop}}\!\left(\text{Activity}_{\text{current}}\right)
   + \text{Energy}_{\text{Start}}\!\left(\text{Activity}_{\text{new}}\right)
$$

</p>

### Starting Energy

The amount of energy required to begin an activity. Addictions are negative, habits are neutral, and new positive habits are positive. Things you are avoiding, your mental quick sand, can be very high positive.

<canvas id="chart-starting-energy"></canvas>

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
                'rgba(0, 200, 0, 0.6)',      // Green for TikTok (easy/addictive)
                'rgba(100, 180, 0, 0.6)',     // Light green for Going to Work
                'rgba(255, 206, 86, 0.6)',    // Yellow for Existing Habit (neutral)
                'rgba(255, 140, 0, 0.6)',     // Orange for Meditating
                'rgba(255, 0, 0, 0.6)',       // Red for Thing being avoided (hard)
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

The amount of energy required to stop an activity. This usually varies over time. Movies have a natural drop in stopping energy at the end of the movie, but the magic of TikTok and Casinos is they are designed so their stopping energy never declines.

<canvas id="chart-stopping-over-time"></canvas>

<script>
defer(() => {
  const ctx = "chart-stopping-over-time";

const myChart = new Chart(ctx, {
"type": "line",
"data": {
"labels": ["00h30", "01h00", "01h30", "02h00", "02h30"],
"datasets": [
{
"label": "TikTok",
"data": [40, 30, 28, 27, 26],
"borderColor": "rgba(255, 0, 0, 0.8)",      // Red - hard to stop
"backgroundColor": "rgba(255, 0, 0, 0.2)",
      tension: 0.4,
},
{
"label": "Movie",
"data": [35, 40, 40, 35, 10],
"borderColor": "rgba(0, 200, 0, 0.8)",      // Green - easier to stop (natural ending)
"backgroundColor": "rgba(0, 200, 0, 0.2)",
      tension: 0.4,
},
]
},
"options": {
"plugins": {
"title": {
"display": true,
"text": "Stopping Energy over time in hours"
},
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

<canvas id="chart-willpower-over-time"></canvas>

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
      "yValue": 50,
      "content": ["Why I never go to the", " gym after work"]
    },
    "l2": {
      // Indicates the type of annotation
      "type": "point",
      "xValue": 2.5,
      "yValue": 35,
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
"borderColor": "rgba(255, 140, 0, 0.8)",    // Orange - moderate/default state
"backgroundColor": "rgba(255, 140, 0, 0.2)",
tension: 0.4,
},
{
"label": "With Morning Habits",
"data": [80, 90, 30, 15],
"borderColor": "rgba(0, 200, 0, 0.8)",      // Green - improved/energized state
"backgroundColor": "rgba(0, 200, 0, 0.2)",
tension:0.4,
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

### Habits and addicitions

[Habits](/habits) are tools to help us reduce the starting energy for things we want to do, and increase the starting energy (and decrease the stopping energy) for our [addictions](/addiction).

### Choices and Excuses

In the moment choices are very bad for achieving desired results, each time there is a choice the [resistance](/resistance) gets another chance, and it's already very strong.

### We become the average of our peers.

We become the average of our peers, your peers pull you towards them, and you pull them towards you. If your peers are sitting around doing nothing so will you, and if they're all super busy, you'll either become busy too, or find new peers.

- Are you becoming your peers, or are they choosing you?
- Peers give us a chance to latch on to each others will power (or lack thereof)

### Schedules

The calendar is a simple tool to reduce stopping and starting energy. If you think about going to the gym, but then need to think about when to go the gym, there's an excellent change you won't go. However, if you know you go to the gym after your morning coffee, the come home and take the kids to school - it's way easier to get it done.

### Sleep and activation Energy

Sleep is something we need to activate every day, and has a huge impact on our mental health, so it's important to know how to [optimize for this](/insomnia). First, decrease the starting energy by making consistent bed time a habit, and reducing caffeine intake. Also, don't engage in high stopping energy activities before bed. TikTok will keep you up, but reading a boring book will get you down for the count.

Quoting [Brian Johnson](/blueprint) a good night's sleep is like putting life into "easy mode".
