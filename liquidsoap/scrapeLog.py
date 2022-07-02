from datetime import timedelta
import re

fileName = "reformatai-liq(old vm).log"
night_playlist_start = 20
night_playlist_end = 2
day_length = (night_playlist_start - night_playlist_end) * 60 * 60
night_length = 24 * 60 * 60 - day_length
# day_weights = [1, 40, 30, 4, 22, 7, 22, 16, 12, 26, 2, 4, 14]
# night_weights = [16, 1, 18, 13, 6, 10, 18, 8, 10]

myreformatai = 0
myreformatai_night = 0

myindie = 0
myindie_night = 0

mygimtine = 0
mygimtine_night = 0

myhiphop = 0
myhiphop_night = 0

myjapanese = 0
myjapanese_night = 0

myold = 0
myold_night = 0

myrock = 0
myrock_night = 0

myelectronic = 0
myelectronic_night = 0

mychill = 0
mychill_night = 0

mybad = 0
mybad_night = 0

myjazz = 0
myjazz_night = 0

myindierock = 0
myindierock_night = 0

mynight = 0
mynight_night = 0

mypop = 0
mypop_night = 0

with open(fileName) as file:
    currentlyDay = True
    currentPlaylist = ''
    # how we do is basically go line by line and check if we switch playlists (with switcher id, for example [day-random:3])
    # then different switcher id corresponds to either night or day playlist
    # And when we encounter 'Changing track to', we increment the playlist song count
    for line in file:
        # Striping new line and empty string stuff
        line = line.rstrip()
        # Switching to different playlist
        if (re.search("\[switch_0.*?\]|\[day-random.*?\]", line)):
            currentlyDay = True
            currentPlaylist = line.split(" ")[5]
        # Night playlist change
        elif (re.search("\[switch_2.*?\]|\[random_9372.*?\]", line)):
            currentlyDay = False
            currentPlaylist = line.split(" ")[5] # equals exacly the playlist name (i.e. indie_rock.pls)
        elif (re.search("Changing track to", line)):
            # Matching for either reformatai_2(dot)pls or reformatai_2.pls
            if (re.match("reformatai_2(\.|\(dot\))pls", currentPlaylist)):
                if currentlyDay:
                    myreformatai += 1
                else:
                    myreformatai_night += 1
            elif (re.match("indie(\.|\(dot\))pls", currentPlaylist)):
                if currentlyDay:
                    myindie += 1
                else:
                    myindie_night += 1
            elif (re.match("gimtine(\.|\(dot\))pls", currentPlaylist)):
                if currentlyDay:
                    mygimtine += 1
                else:
                    mygimtine_night += 1
            elif (re.match("hiphop(\.|\(dot\))pls", currentPlaylist)):
                if currentlyDay:
                    myhiphop += 1
                else:
                    myhiphop_night += 1
            elif (re.match("japanese(\.|\(dot\))pls", currentPlaylist)):
                if currentlyDay:
                    myjapanese += 1
                else:
                    myjapanese_night += 1
            elif (re.match("old(\.|\(dot\))pls", currentPlaylist)):
                if currentlyDay:
                    myold += 1
                else:
                    myold_night += 1
            # this only matches with rock.pls and not indie_rock.pls
            elif (re.match("rock(\.|\(dot\))pls", currentPlaylist)):
                if currentlyDay:
                    myrock += 1
                else:
                    myrock_night += 1                    
            elif (re.match("electronic(\.|\(dot\))pls", currentPlaylist)):
                if currentlyDay:
                    myelectronic += 1
                else:
                    myelectronic_night += 1
            elif (re.match("chill(\.|\(dot\))pls", currentPlaylist)):
                if currentlyDay:
                    mychill += 1
                else:
                    mychill_night += 1                    
            elif (re.match("bad(\.|\(dot\))pls", currentPlaylist)):
                if currentlyDay:
                    mybad += 1
                else:
                    mybad_night+= 1
            elif (re.match("jazz(\.|\(dot\))pls", currentPlaylist)):
                if currentlyDay:
                    myjazz += 1
                else:
                    myjazz_night += 1
            elif (re.match("indie_rock(\.|\(dot\))pls", currentPlaylist)):
                if currentlyDay:
                    myindierock += 1
                else:
                    myindierock_night += 1
            elif (re.match("night(\.|\(dot\))pls", currentPlaylist)):
                if currentlyDay:
                    mynight += 1
                else:
                    mynight_night += 1
            elif (re.match("pop(\.|\(dot\))pls", currentPlaylist)):
                if currentlyDay:
                    mypop += 1
                else:
                    mypop_night+= 1                

total_day = myreformatai + myindie + mygimtine + myhiphop + myjapanese + myold + myrock + myelectronic + mychill + mybad + myjazz + myindierock + mynight + mypop
total_night = myreformatai_night + myindie_night + mygimtine_night + myhiphop_night + myjapanese_night + myold_night+ myrock_night + myelectronic_night + mychill_night + mybad_night + myjazz_night + myindierock_night + mynight_night + mypop_night
print(total_day, total_night, total_day + total_night)
# print(myreformatai, myindie, mygimtine, myhiphop, myjapanese, myold, myrock, myelectronic, mychill, mybad, myjazz, myindierock, mynight, mypop)
# print(myreformatai_night, myindie_night, mygimtine_night, myhiphop_night, myjapanese_night, myold_night, myrock_night, myelectronic_night, mychill_night, mybad_night, myjazz_night, myindierock_night, mynight_night, mypop_night)
# print()

# print(time.strftime("%H:%M:%S", time.gmtime(day_length * mypop / total_day)))
# print(timedelta(seconds=day_length * mypop / total_day))

print(f"{'day 18h':^33}", f"{'night 6h':^37}")
print("{n:<12}{:6.3f}% ({:3}) [{:>7.7}]{n:>14}{:7.3f}% ({:3}) [{:>7.7}]".format((myreformatai / total_day * 100), myreformatai, str(timedelta(seconds=day_length * myreformatai / total_day)), (myreformatai_night / total_night * 100), myreformatai_night, str(timedelta(seconds=day_length * myreformatai_night / total_day)), n="reformatai:"))
print("{n:<12}{:6.3f}% ({:3}) [{:>7.7}]{n:>14}{:7.3f}% ({:3}) [{:>7.7}]".format((myindie / total_day * 100), myindie, str(timedelta(seconds=day_length * myindie / total_day)), (myindie_night / total_night * 100), myindie_night, str(timedelta(seconds=day_length * myindie_night / total_day)), n="indie:"))
print("{n:<12}{:6.3f}% ({:3}) [{:>7.7}]{n:>14}{:7.3f}% ({:3}) [{:>7.7}]".format((mygimtine / total_day * 100), mygimtine, str(timedelta(seconds=day_length * mygimtine / total_day)), (mygimtine_night / total_night * 100), mygimtine_night, str(timedelta(seconds=day_length * mygimtine_night / total_day)), n="gimtine:"))
print("{n:<12}{:6.3f}% ({:3}) [{:>7.7}]{n:>14}{:7.3f}% ({:3}) [{:>7.7}]".format((myrock / total_day * 100), myrock, str(timedelta(seconds=day_length * myrock / total_day)), (myrock_night / total_night * 100), myrock_night, str(timedelta(seconds=day_length * myrock_night / total_day)), n="rock:"))
print("{n:<12}{:6.3f}% ({:3}) [{:>7.7}]{n:>14}{:7.3f}% ({:3}) [{:>7.7}]".format((myelectronic / total_day * 100), myelectronic, str(timedelta(seconds=day_length * myelectronic / total_day)), (myelectronic_night / total_night * 100), myelectronic_night, str(timedelta(seconds=day_length * myelectronic_night / total_day)), n="electronic:"))
print("{n:<12}{:6.3f}% ({:3}) [{:>7.7}]{n:>14}{:7.3f}% ({:3}) [{:>7.7}]".format((mychill / total_day * 100), mychill, str(timedelta(seconds=day_length * mychill / total_day)), (mychill_night / total_night * 100), mychill_night, str(timedelta(seconds=day_length * mychill_night / total_day)), n="chill:"))
print("{n:<12}{:6.3f}% ({:3}) [{:>7.7}]{n:>14}{:7.3f}% ({:3}) [{:>7.7}]".format((mybad / total_day * 100), mybad, str(timedelta(seconds=day_length * mybad / total_day)), (mybad_night / total_night * 100), mybad_night, str(timedelta(seconds=day_length * mybad_night / total_day)), n="bad:"))
print("{n:<12}{:6.3f}% ({:3}) [{:>7.7}]{n:>14}{:7.3f}% ({:3}) [{:>7.7}]".format((myjazz / total_day * 100), myjazz, str(timedelta(seconds=day_length * myjazz / total_day)), (myjazz_night / total_night * 100), myjazz_night, str(timedelta(seconds=day_length * myjazz_night / total_day)), n="jazz:"))
print("{n:<12}{:6.3f}% ({:3}) [{:>7.7}]{n:>14}{:7.3f}% ({:3}) [{:>7.7}]".format((myindierock / total_day * 100), myindierock, str(timedelta(seconds=day_length * myindierock / total_day)), (myindierock_night / total_night * 100), myindierock_night, str(timedelta(seconds=day_length * myindierock_night / total_day)), n="indie_rock:"))
print("{n:<12}{:6.3f}% ({:3}) [{:>7.7}]{n:>14}{:7.3f}% ({:3}) [{:>7.7}]".format((mynight / total_day * 100), mynight, str(timedelta(seconds=day_length * mynight / total_day)), (mynight_night / total_night * 100), mynight_night, str(timedelta(seconds=day_length * mynight_night / total_day)), n="night:"))
print("{n:<12}{:6.3f}% ({:3}) [{:>7.7}]{n:>14}{:7.3f}% ({:3}) [{:>7.7}]".format((mypop / total_day * 100),mypop, str(timedelta(seconds=day_length * mypop / total_day)), (mypop_night / total_night * 100), mypop_night, str(timedelta(seconds=day_length * mypop_night / total_day)), n="pop:"))
print("{n:<12}{:6.3f}% ({:3}) [{:>7.7}]{n:>14}{:7.3f}% ({:3}) [{:>7.7}]".format((myhiphop / total_day * 100), myhiphop, str(timedelta(seconds=day_length * myhiphop / total_day)), (myhiphop_night / total_night * 100), myhiphop_night, str(timedelta(seconds=day_length * myhiphop_night / total_day)), n="hiphop:"))
print("{n:<12}{:6.3f}% ({:3}) [{:>7.7}]{n:>14}{:7.3f}% ({:3}) [{:>7.7}]".format((myjapanese / total_day * 100), myjapanese, str(timedelta(seconds=day_length * myjapanese / total_day)), (myjapanese_night / total_night * 100), myjapanese_night, str(timedelta(seconds=day_length * myjapanese_night / total_day)), n="japanese:"))
print("{n:<12}{:6.3f}% ({:3}) [{:>7.7}]{n:>14}{:7.3f}% ({:3}) [{:>7.7}]".format((myold / total_day * 100), myold, str(timedelta(seconds=day_length * myold / total_day)), (myold_night / total_night * 100), myold_night, str(timedelta(seconds=day_length * myold_night / total_day)), n="old:"))
