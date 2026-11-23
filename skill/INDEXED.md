# Last indexed

The refresh job reads this file, distills only what changed since these marks into ENTRY, TOOLS, OPINIONS and VOICE, then moves the marks forward in the same PR. The loader never fetches this file.

| Source | Indexed through                                                                    |
| ------ | ---------------------------------------------------------------------------------- |
| Blog   | commit `fde311c81fefcb50d82c78d75e1530c57021c915`, 2026-11-22 08:33 -08:00         |
| X      | posts up to 2026-11-22 08:57 -08:00 (account: [@idvorkin](https://x.com/idvorkin)) |

Indexed at: 2026-11-22 08:57 -08:00

Times are Pacific with their UTC offset. The refresh writes the new commit's own commit time for the blog, and its own start time for X and "Indexed at", so a post that lands mid-run is picked up next week.

Refresh scope: `git diff <blog commit>..main -- _d _posts` plus Igor's own public X posts after the X time. Only public writing counts; nothing about his day job goes in.

Every new blog citation links the section that makes the claim (`https://idvork.in/<permalink>#<anchor>`, the rendered heading id), and `scripts/check_skill_links.py` must pass against a fresh `_site` before the PR.
