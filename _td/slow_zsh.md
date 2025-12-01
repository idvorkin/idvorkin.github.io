---
layout: post
title: Slow ZSH prompts
---

All of the sudden, hititng enter in zsh took seconds - took me a while, but I realized if I kiled tmux (not just a window), then it would be fast again (well, that's better then a reboot I guess. **Sigh, this drove me nuts and I just switched to Atuin instead**

Groan, looks like Atuin is hitting the same problem, but has an error message about it being slow to write to disk:

[https://github.com/atuinsh/atuin/issues/2328](https://github.com/atuinsh/atuin/issues/2328)

Hymn, looks a lot like this tmux slow issue:

[https://github.com/tmux/tmux/issues/2551](https://github.com/tmux/tmux/issues/2551)

Ah, looks like my tmux plugins where still getting loaded (and pomodoro was still in memory - lets see if he was the culprit)

Profiling Zsh

    zmodload zsh/zprof
    zprof

Looks like the issue is mcfly's input

Inspecting history

Hypothesis:

The weird part. Why would restart tmux matter? Maybe something in tmux is adding to history on a tick?

Look at them mcfly code:

Setup the function to work on the pre-prompt

```zsh
precmd_functions+=(mcfly_prompt_command)
```

Now that prompt

```zsh
function mcfly_prompt_command {
local exit_code=$? # Record exit status of previous command.

# Populate McFly's temporary, per-session history file from recent commands in the shell's primary HISTFILE.
if [[ ! -f "${MCFLY_HISTORY}" ]]; then
  export MCFLY_HISTORY=$(command mktemp ${TMPDIR:-/tmp}/mcfly.XXXXXXXX)
  command tail -n100 "${MCFLY_HISTFILE}" >| ${MCFLY_HISTORY}
fi

# Write history to $MCFLY_HISTORY.
fc -W "${MCFLY_HISTORY}"

# Run mcfly with the saved code. It find the text of the last command in $MCFLY_HISTORY and save it to the database.
[ -n "$MCFLY_DEBUG" ] && echo "mcfly.zsh: Run mcfly add --exit ${exit_code}"
$MCFLY_PATH --history_format $MCFLY_HISTORY_FORMAT add --exit ${exit_code}
return ${exit_code} # Restore the original exit code by returning it.
}
```

Tailing the history file - what else could be taking time

Lets see if it's that add call that's slow. Must be. Then I need to debug why that might be

    $MCFLY_PATH --history_format $MCFLY_HISTORY_FORMAT add --exit ${exit_code}

### Debugging Slow IO

The issue is I/O within TMUX only goes super slow, I've added a profiling tool to my [vim_python](https://github.com/idvorkin/settings/blob/49d4470ba50d177b206a7589ffdf726348d13c2d/py/vim_python.py?plain=1#L108)

In Tmux when it's slow:

    ❯ vim_python profile-io
    Error: pool timed out while waiting for an open connection

    Location:
    /private/tmp/atuin-20240415-5422-dpc6s2/atuin-18.2.0/atuin-client/src/record/sqlite_store.rs:48:20
    Starting 0
    Write time 0: 3.05961 seconds
    Read time 0: 0.00023 seconds
    Starting 1
    Write time 1: 1.01048 seconds
    Read time 1: 0.00020 seconds
    Starting 2
    Write time 2: 1.00221 seconds
    Read time 2: 0.00023 seconds
    Starting 3
    Write time 3: 1.01644 seconds
    Read time 3: 0.00023 seconds

At the same time when not in TMUX

    Starting 0
    0: Write/Read:  0.00254/0.00031 seconds
    Starting 1
    1: Write/Read:  0.00050/0.00028 seconds
    Starting 2
    2: Write/Read:  0.00087/0.00018 seconds
    Starting 3
    3: Write/Read:  0.00050/0.00016 seconds
