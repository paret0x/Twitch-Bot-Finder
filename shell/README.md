# Twitch-Bot-Finder

This folder holds the now deprecated PowerShell script method to find view bots.

## How do I run it?

To run the script, open PowerShell (Press Start, type in "Powershell", click the app called "Windows Powershell") and run the following command:

```
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex "&{$((New-Object System.Net.WebClient).DownloadString('https://raw.githubusercontent.com/paret0x/Twitch-Bot-Finder/main/botfinder.ps1'))} global"
```

The program will ask you to enter the username of the Twitch streamer you want to monitor for bots, hit Enter, and it will check your viewers list periodically for known bots. When it finds one, the name of the bot will show up on the program. What you do with the bot is entirely up to you. If you don't want them, do a /ban and they'll usually disappear after a couple of minutes.

## Why is it deprecated?

Well it turns out that Twitch decided to deprecate the `https://tmi.twitch.tv/group/user/USERNAME/chatters` API in favor of using the actual Twitch API ([See article here](https://discuss.dev.twitch.tv/t/legacy-chatters-endpoint-shutdown-details-and-timeline-april-2023/43161)). To get the viewer list now, you need to have moderator permissions for the channel, which is entirely not needed in my opinion, but without doing a bunch of OAuth requests, I figured it just wasn't worth it.
