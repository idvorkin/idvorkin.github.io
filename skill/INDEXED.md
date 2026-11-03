# Last indexed

The refresh job reads this file, distills only what changed since these marks into ENTRY, TOOLS, OPINIONS and VOICE, then moves the marks forward in the same PR. The loader never fetches this file.

| Source | Indexed through                                                |
| ------ | -------------------------------------------------------------- |
| Blog   | commit `d6b392e46bdc685b46631c92b31a83450903b0ad` (2026-11-01) |
| X      | posts up to 2026-11-02 (account: not set yet)                  |

Indexed at: 2026-11-02

Refresh scope: `git diff <blog commit>..main -- _d _posts` plus Igor's own public X posts after the X date. Only public writing counts; nothing about his day job goes in.
