*-*-*- cheatah brings cheat sheet speedy -*-*-*

Cheatah is cheat sheet manager working on Slack.

## What he can do is

He starts conversation when you reply to him with these words.

```
show (file name)
add (file name)
remove (file name)
help
```

He follows the favors below anytime.

```
:bye/
:stop/
:cancel/
  -> He stops all conversation with you.
```

## How to run

Cheatah is powered by [Botkit](https://github.com/howdyai/botkit)

#### About API

It is necessary to prepare Slack API token.
Create a bot user in your team from [this page](https://my.slack.com/services/new/bot).

This app import token as `SLACK_BOT_TOKEN_CHEATAH`.
After you get token, set it as environment variable.

#### Additional

Files under `./data/cheatah` are just examples.