# Last indexed

The refresh job reads this file, distills only what changed since these marks into ENTRY, TOOLS, OPINIONS and VOICE, then moves the marks forward in the same PR. The loader never fetches this file.

| Source | Indexed through                                                            |
| ------ | -------------------------------------------------------------------------- |
| Blog   | commit `d6b392e46bdc685b46631c92b31a83450903b0ad`, 2026-11-01 11:40 -08:00 |
| X      | posts up to 2026-11-02 04:22 -08:00 (account: not set yet)                 |

Indexed at: 2026-11-02 04:22 -08:00

Times are Pacific with their UTC offset. The refresh writes the new commit's own commit time for the blog, and its own start time for X and "Indexed at", so a post that lands mid-run is picked up next week.

Refresh scope: `git diff <blog commit>..main -- _d _posts` plus Igor's own public X posts after the X time. Only public writing counts; nothing about his day job goes in.
