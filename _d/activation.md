---
layout: post
title: "Activation Energy"
mathjax: true
chart_zoom: true

permalink: /activation
redirect_from:
  - activation-energy
  - willpower
  - will-power
imagefeatureblob: blog/raccoon-activation.webp
---

Doing activities requires will power, addictions and procrastination require negative will power, while positive habits, especially new ones require high will power. Here's a model for these things.

{% include alert.html content="Note: All 'units' of willpower in this post are illustrative and not based on scientific measurement. They're meant to give a sense of relative magnitude and direction." style="info" %}

{% include blob_image_float_right.html src="blog/raccoon-activation.webp" %}

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

<canvas id="chart-starting-energy" class="chart-zoom-enabled"></canvas>

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

<canvas id="chart-stopping-over-time" class="chart-zoom-enabled"></canvas>

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

<canvas id="chart-willpower-over-time" class="chart-zoom-enabled"></canvas>

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

### Habits and addictions

[Habits](/habits) are tools to help us reduce the starting energy for things we want to do, and increase the starting energy (and decrease the stopping energy) for our [addictions](/addiction).

### Choices, Excuses and Energy Leaks

In the moment choices are very bad for achieving desired results, each time there is a choice the [resistance](/resistance) gets another chance, and it's already very strong.

In strength training there is a notion of energy leaks, places where you're unstable where you "leak energy", I think choices might be like that, they are chances to leak will power

### Willpower as a bunch of guys lifting a log

Imagine a group of people trying to lift a heavy log together. When everyone lifts in sync, the log rises easily. But when one person drops out, the remaining lifters must strain harder. If another quits from the extra strain, the rest face an even greater burden. Eventually, the remaining lifters can't hold the weight and the log crashes down.

This is exactly how muscle fibers work in strength training - multiple fibers must fire together to lift a heavy weight. No single fiber can lift the load alone - they must work in coordination. Willpower works the same way: it's not a single reservoir that depletes, but a distributed system across all your life roles, each contributing their own "muscle fiber" to help you overcome activation energy.

Think of each role in your life as a muscle fiber contributing to your total willpower:

**Professional Fiber**

- Provides structure, deadlines, external accountability
- Includes traditional work, skill building, creativity, and helping others
- Strongest during productive hours, depletes by evening
- When missing (weekends, vacation, gap year), total capacity drops dramatically
- Vacations can go two ways: vegetating weakens this fiber, but professional development and creative projects strengthen it (see [/timeoff](/timeoff))
- Doing a poor job at work also drastically weakens it

**Physical Health Fiber**

- Provides raw energy, endorphins, self-efficacy
- When weak, even basic movement becomes difficult, pain increases, fatigue dominates
- Creates brain fog that impairs all other fibers
- Morning workouts can boost this fiber for the entire day
- The foundation - without physical energy, nothing else functions

**Emotional Health Fiber**

- Provides resilience, emotional regulation, inner peace
- When depleted, anxiety and rumination drain other fibers
- Can turn negative when overwhelmed, actively subtracting from total willpower

**Family Fiber**

- Provides purpose, love-based motivation, emotional grounding
- Varies based on relationship state and family needs
- Strong family connections make hard things feel worthwhile
- Conflict or guilt here can drain all other fibers

**Creative Fiber**

- Provides flow states, intrinsic motivation, identity beyond roles
- Strongest during unstructured time
- Needs regular feeding through creative expression
- When neglected, you lose access to your deepest energy wells

**Total Willpower = Sum of All Active Fibers**

When all fibers are healthy and aligned, you might have 85+ units of willpower - easily clearing the 40-unit activation energy for the gym. But remove your professional fiber (gap year), and suddenly you're down to 45-50 units. Now the gym feels impossible, not because you're lazy, but because you've lost a major muscle group.

Each fiber also builds its own "memory bank" - repeated success in a role creates identity-level strength that persists even during temporary weakness. When you shift from just doing tasks to embodying an identity ("I am a runner" vs "I run"), that fiber gains reserve strength it can draw upon during difficult times.

#### Danger Zone and Death Spirals

When one fiber weakens, the damage compounds:

1. **Redistribution Stress**: Remaining fibers must work harder to compensate, accelerating their depletion
2. **Misalignment Waste**: Without professional structure, fibers pull in different directions, wasting energy
3. **Cascade Failure**: Weak physical health → less emotional regulation → family stress → less creative energy → professional struggles
4. **Activation Threshold Crisis**: Eventually, even low-energy activities (reading, walking) exceed available willpower

This is why a "lazy Sunday" can spiral into a "lost week" or even a "lost year" - once multiple fibers weaken, the system struggles to recover. (See [/gap-year-igor](/gap-year-igor) for how these death spirals threaten major life transitions.)

**The Addiction Doom Loop** is a special type of death spiral. Addictions attack multiple fibers simultaneously:

- **TikTok at 2am** → Poor sleep → Weakened physical health fiber
- **Shame about wasted time** → Weakened emotional health and professional fibers
- **Missing family time while scrolling** → Weakened family fiber
- **No energy for creative work** → Weakened creative fiber

Now all your fibers are compromised, making it even harder to resist the addiction. You need 50 units of willpower to stop scrolling, but you only have 20 left. The negative starting energy of the addiction (-50) means you'll default back to it, further weakening your fibers.

#### Why Morning Habits Supercharge Your Willpower

Look back at the willpower chart - morning habits boost willpower from 70 to 90 units. This isn't just adding energy; it's activating multiple fibers simultaneously:

- **Exercise** fires up your physical health fiber
- **Journaling** engages your emotional health and creative fibers
- **Family breakfast** strengthens your family fiber
- **Review daily plan** pre-activates your professional fiber

These habits create a "pre-activation" state where all fibers are warm, aligned, and ready to work together. It's like a dynamic warm-up before lifting - you're not just stronger, you're more coordinated.

Remember: You don't need more willpower - you need better fiber coordination. When your roles work together, pulling in the same direction at the right time, even the hardest activation energies become manageable.

### Peer Pressure and Shared Willpower

We become the average of our peers, your peers pull you towards them, and you pull them towards you. If your peers are sitting around doing nothing so will you, and if they're all super busy, you'll either become busy too, or find new peers.

- Are you becoming your peers, or are they choosing you?
- Peers give us a chance to latch on to each others will power (or lack thereof)

### Schedules

The calendar is a simple tool to reduce stopping and starting energy. If you think about going to the gym, but then need to think about when to go the gym, there's an excellent chance you won't go. However, if you know you go to the gym after your morning coffee, the come home and take the kids to school - it's way easier to get it done.

### Sleep and activation Energy

Sleep is something we need to activate every day, and has a huge impact on our mental health, so it's important to know how to [optimize for this](/insomnia). First, decrease the starting energy by making consistent bed time a habit, and reducing caffeine intake. Also, don't engage in high stopping energy activities before bed. TikTok will keep you up, but reading a boring book will get you down for the count.

Quoting [Brian Johnson](/blueprint) a good night's sleep is like putting life into "easy mode".
