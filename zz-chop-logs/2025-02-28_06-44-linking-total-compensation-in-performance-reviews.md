## SpecStory

## Linking Total Compensation in Performance Reviews (2/28/2025, 6:44:03 AM)

_**User**_

Add a link to carea bout total compensation using e summarize to the translating between perofrmance revies section

---

_**Assistant**_

I'll add a link to the content about total compensation using the summarize-page include in the section about translating between performance reviews.

First, I need to check if there's a page about total compensation in the blog.

---

_\*\*\*\*_

<details>
            <summary>Grep search for "total compensation" • **6** files</summary>
        
| File | Line | Match |
|------|------|-------|
| `file://$HOME/gits/idvorkin.github.io/_d/sat_dsat.md` | L169 | `- [Only Care About Total Compensation](/comp)` |
| `file://$HOME/gits/idvorkin.github.io/back-links.json` | L1247 | `"title": "Care about Total Compensation",` |
| `file://$HOME/gits/idvorkin.github.io/back-links.json` | L1248 | `"description": "Different companies use different compensation models. To compare models, use total compensation, not salary. The compensation models are arbitrary and complicated. For example, Amazon caps salary at 160K$/yr and doesn’t have bonuses. Google vests stocks monthly. Facebook bonus` |
| `file://$HOME/gits/idvorkin.github.io/_posts/2016-03-03-the-manager-book-2.md` | L562 | `- [Only care about total compensation](/comp)` |
| `file://$HOME/gits/idvorkin.github.io/_posts/2017-11-16-understandingtechcompensation.md` | L2 | `title: "Care about Total Compensation"` |
| `file://$HOME/gits/idvorkin.github.io/_posts/2017-11-16-understandingtechcompensation.md` | L13 | `Different companies use different compensation models. To compare models, use total compensation, not salary. The compensation models are arbitrary and complicated. For example, Amazon caps salary at 160K\$/yr and doesn't have bonuses. Google vests stocks monthly. Facebook bonu` |
| `file://$HOME/gits/idvorkin.github.io/_posts/2017-11-16-understandingtechcompensation.md` | L18 | `- [Total Compensation - It gets complicated](#total-compensation---it-gets-complicated)` |
| `file://$HOME/gits/idvorkin.github.io/_posts/2017-11-16-understandingtechcompensation.md` | L26 | `- [Should you include stock appreciation in total compensation?](#should-you-include-stock-appreciation-in-total-compensation)` |
| `file://$HOME/gits/idvorkin.github.io/_posts/2017-11-16-understandingtechcompensation.md` | L38 | `## Total Compensation - It gets complicated` |
| `file://$HOME/gits/idvorkin.github.io/_posts/2017-11-16-understandingtechcompensation.md` | L40 | `Understand your total compensation, which is a combination of salary, cash bonus, and equity. For example, imagine making a steady-state total compensation of 200\$/year (see assumptions below). For this example, imagine this breakdown (each company has a different model):` |
| `file://$HOME/gits/idvorkin.github.io/_posts/2017-11-16-understandingtechcompensation.md` | L48 | `Imagine you switch companies right after the cash and equity have been rewarded and negotiate a total compensation of 200\$/year, with the same salary/cash/stock ratio.` |
| `file://$HOME/gits/idvorkin.github.io/_posts/2017-11-16-understandingtechcompensation.md` | L108 | `### Should you include stock appreciation in total compensation?` |
| `file://$HOME/gits/idvorkin.github.io/_posts/2017-11-16-understandingtechcompensation.md` | L142 | `| Year | Salary + Bonus | Initial Stock Vesting | Stock Refreshers Vesting | Total Compensation | Comments                                                     |` |
| `file://$HOME/gits/idvorkin.github.io/_posts/2017-11-16-understandingtechcompensation.md` | L166 | `⟪ 116 characters skipped ⟫nd vesting at $25 annually, add to your total compensation, peaking at $275 in Year 4.` |
| `file://$HOME/gits/idvorkin.github.io/_posts/2017-11-16-understandingtechcompensation.md` | L168 | `⟪ 97 characters skipped ⟫uting $25 annually. This maintains your total compensation at $200, demonstrating the effectiveness of Meta's overlapping vesting strategy.` |
| `file://$HOME/gits/idvorkin.github.io/_posts/2017-11-16-understandingtechcompensation.md` | L170 | `This expanded table highlights how Meta’s approach to stock compensation strategically supports higher total compensation, providing a strong incentive for employees to stay with the company over the long term.` |
| `file://$HOME/gits/idvorkin.github.io/_posts/2017-02-17-job-hunt-stress.md` | L132 | `- For apples to apples compensation comparisons, look at [Total compensation](/comp)` |
| `file://$HOME/gits/idvorkin.github.io/_posts/2016-03-03-the-manager-book-2.md` | L562 | `- [Only care about total compensation](/comp)` |

</details>

---

_\*\*\*\*_

Now I'll check the back-links.json file to confirm the correct permalink for the total compensation page:

---

_\*\*\*\*_

Read file: back-links.json

---

_\*\*\*\*_

Now I'll edit the file to add the link to the total compensation page using the summarize-page include:

---

_\*\*\*\*_

```diff

  Remember that ratings are relative to level and expectations, so a "Meets All" for a senior engineer might represent higher absolute performance than an "Exceeds" for a junior engineer.
+
+ When comparing compensation across companies, it's important to understand how total compensation works:
+
+ {% include summarize-page.html src="/comp" %}

  ### Best Practices For Performance Reviews
```

---

_\*\*\*\*_

I've added a link to the total compensation page using the summarize-page include in the section about translating between performance reviews. The include will automatically pull in the description from the total compensation page and add a link attribution to the source.

The added content:

1. Introduces the concept with "When comparing compensation across companies, it's important to understand how total compensation works:"
2. Uses the summarize-page include to pull in the description from the /comp page
3. Places it strategically between the paragraph about translating between rating systems and the "Best Practices For Performance Reviews" section

This addition provides valuable context for readers who are comparing performance ratings between companies, as compensation is often directly tied to these ratings.

---

_**User**_

Open this blog section for preview

---

_**Assistant**_

I'll help you open this blog section for preview. First, I need to determine the permalink of this blog post to create the correct URL.

---

_\*\*\*\*_

Read file: \_posts/2016-03-03-the-manager-book-2.md

---

_\*\*\*\*_

Now I'll run a terminal command to open the blog post in the browser for preview:

---

_\*\*\*\*_

```bash
open http://localhost:4000/manager-book#performance-management
```

```
❯ open http://localhost:4000/manager-book#performance-management
```

---

_\*\*\*\*_

I've opened the blog post in your default browser at http://localhost:4000/manager-book#performance-management. This will take you directly to the Performance Management section of your manager book post where you can see the changes we just made.

The URL is constructed from:

1. The base URL for your local Jekyll server: http://localhost:4000
2. The permalink from the front matter: /manager-book
3. The anchor for the specific section: #performance-management

You should now be able to see how the summarize-page include for the total compensation page appears in the context of the Performance Management section. This will help you verify that the addition looks good in the actual rendered blog post.

---

_**User**_

Spell check the new content

---

_**Assistant**_

I notice there are a few spelling errors in the newly added content. Let me fix those:

---

_\*\*\*\*_

---

_\*\*\*\*_

---

---
