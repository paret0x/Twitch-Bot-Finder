# Twitch-Bot-Finder

This is a repository hosting the code for a program to find any "bots" that are currently "watching" a Twitch streamer.

## What are Twitch bots?

Look, I'm not here to discuss the ethics behind any of these bots. I'm not a streamer, I just write programs for channels I moderate for. 

That said, there's been tales of these bots topping point leaderboards, getting community gift subs, and harvesting data about streamers. There's even conspiracy theories about these bots like that some bots are tied to hate raids or that they're grabbing streamers' IP addresses. I have zero clue how true these stories are, but I know there's a decent amount of streamers that want these "bots" as far from their stream as possible.

Most of these "bots" are really programs that connect to a stream via [Twitch IRC](https://dev.twitch.tv/docs/irc), which is effectively just a chatroom and is very limited in what they can see. They can't actually see the video stream of your channel, but they can see everything going on in chat. Most of them are not malicious, but there's always bad apples.

## How do I use it?

With the old method deprecated, a new method is in the works.

## References

There's a pretty decent article about these "bots" from streamer Kyle Juffs [over here](https://web.archive.org/web/20221105202033/https://kylejuffs.com/how-to-ban-bots-on-twitch/).

There's been a load of discussion about these "bots" on Reddit: [Post 1](https://www.reddit.com/r/Twitch/comments/srhhd8/any_way_to_get_rid_of_the_chat_bots_i_have_1/), [Post2](https://www.reddit.com/r/Twitch/comments/nlmiui/mass_banning_known_bot_accounts/), [Post 3](https://www.reddit.com/r/Twitch/comments/96sxsy/can_we_talk_about_bots_is_it_possible_to_start/)

You can find a pretty comprehensive list of bots on [Stream Charts](https://streamscharts.com/tools/bots), which is where most of the list this program uses came from. Another great list is [Twitch Insights](https://twitchinsights.net/bots).

If you want the bots automatically banned rather than having to do it manually, there's a [website](https://ban-twitch-bots.sirmre.com/) for that. That website uses the Twitch API for Authentication, so it should be (relatively?) safe to use without worrying about your password getting leaked.
