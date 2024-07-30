---
layout: post
title: Slow ZSH prompts
---

All of the sudden, hititng enter in zsh took seconds - took me a while, but I realized if I kiled tmux (not just a window), then it would be fast again (well, that's better then a reboot I guess. **Sigh, this drove me nuts and I just switched to Atuin instead**

Profiling Zsh

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
