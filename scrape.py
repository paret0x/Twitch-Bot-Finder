known_bots = []
whitelist = []
new_bots = []

with open("botlist.txt", 'r') as my_file:
    lines = my_file.readlines()
    for line in lines:
        bot_name = line.strip("\n")
        known_bots.append(bot_name)

with open("whitelist.txt", 'r') as my_file:
    lines = my_file.readlines()
    for line in lines:
        bot_name = line.strip("\n")
        whitelist.append(bot_name)
        
with open("new.txt", 'r') as my_file:
    lines = my_file.readlines()
    for line in lines:
        bot_name = line.strip("\n")
        
        if not ('\t' in bot_name):
            continue
            
        bot_name = bot_name[:bot_name.index('\t')].strip()
        
        if not (bot_name in known_bots) and not (bot_name in whitelist) and not (bot_name in new_bots):
            new_bots.append(bot_name)
        
print("Found %d new bots" % len(new_bots))

for bot in new_bots:
    known_bots.append(bot)
known_bots.sort()

with open("botlist.txt", 'w') as out_file:
    for bot_name in known_bots:
        out_file.write("%s\n" % bot_name)
    out_file.close()
