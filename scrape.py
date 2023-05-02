known_bots = []
whitelist = []
new_bots = []
new_good_bots = []

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

        bot_fields = bot_name.strip().split("\t")
        if len(bot_fields) < 2:
            continue
            
        bot_name = bot_fields[0].strip().lower()
        
        if len(bot_fields) == 5:
            bot_mod_str = bot_fields[3].strip().replace(' ', '')
            bot_mod_count = int(bot_mod_str)

            if bot_mod_count > 10:
                if bot_name in known_bots:
                    known_bots.remove(bot_name)
                
                if not (bot_name in whitelist):
                    new_good_bots.append(bot_name)

                continue

        if not (bot_name in known_bots) and not (bot_name in whitelist) and not (bot_name in new_bots):
            new_bots.append(bot_name)
              
print("Found %d new bots and %d new (probably) good bots" % (len(new_bots), len(new_good_bots)))

for bot in new_bots:
    known_bots.append(bot)
known_bots.sort()

for bot in new_good_bots:
    whitelist.append(bot)
whitelist.sort()

with open("botlist.txt", 'w') as out_file:
    for bot_name in known_bots:
        out_file.write("%s\n" % bot_name)
    out_file.close()

with open("whitelist.txt", 'w') as out_file:
    for bot_name in whitelist:
        out_file.write("%s\n" % bot_name)
    out_file.close()