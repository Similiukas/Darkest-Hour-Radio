set("log.file.path", "/tmp/reformatai-liq.log")
set("server.telnet", false)
set("harbor.bind_addrs", ["0.0.0.0"])

# ---- Playlists ----
myreformatai = playlist("~/music/playlists/reformatai_2.pls", mime_type="audio/x-scpls")
myindie = playlist("~/music/playlists/indie.pls", mime_type="audio/x-scpls")
mygimtine = playlist("~/music/playlists/gimtine.pls", mime_type="audio/x-scpls")
myhiphop = playlist("~/music/playlists/hiphop.pls", mime_type="audio/x-scpls")
myjapanese = playlist("~/music/playlists/japanese.pls", mime_type="audio/x-scpls")
myold = playlist("~/music/playlists/old.pls", mime_type="audio/x-scpls")
myrock = playlist("~/music/playlists/rock.pls", mime_type="audio/x-scpls")
myelectronic = playlist("~/music/playlists/electronic.pls", mime_type="audio/x-scpls")
mychill = playlist("~/music/playlists/chill.pls", mime_type="audio/x-scpls")
mybad = playlist("~/music/playlists/bad.pls", mime_type="audio/x-scpls")
myjazz = playlist("~/music/playlists/jazz.pls", mime_type="audio/x-scpls")
myindierock = playlist("~/music/playlists/indie_rock.pls", mime_type="audio/x-scpls")
mynight = playlist("~/music/playlists/night.pls", mime_type="audio/x-scpls")
mypop = playlist("~/music/playlists/pop.pls", mime_type="audio/x-scpls")
# -------------------

# ---- Mopidy ----
mymopidy = input.harbor(port=8800, password="nu0stab_sraDijas-2", "/mopidy-input")
# ----------------

# ---- Live ----
# The problem is that track metadata is not updated.
# Need to broadcast MP3 from Mixxx and output MP3 from liquidsoap
# But Icecast get first track's metadata and that's it. It doesn't change the metadata from track to track
mylive = input.harbor(port=8006, password="nu0stab_sraDijas-2", "/mixxx")
# --------------

# ---- Jingles ----
myjingle = single("~/music/jingles/intro.wav")
myjingle2 = single("~/music/jingles/intro.mp3")
myad1 = single("~/music/jingles/radio-ad-1-silence.mp3")
# -----------------

# ---- Transitions ----
def from_pls(jingle, old, new)
	old = fade.final(old)

	s = add([jingle, old])

	sequence([s, new])
end

def to_pls(jingle, old, new)
	old = fade.final(old)

	s = add([jingle, old])

	sequence([s, fade.initial(new)], merge=true)
end
# --------------------

# ---- Adding additional metadata ----
def append_album(m)
	title = m["title"]
	artist = m["artist"]
	album = m["album"]
	print("Changing track to: #{title} #{album} (artist: #{artist})")

        [("title", "#{title} ##{album}")]
end

# When live connects from input.harbor, adding additional data to indicate in icecast stats
def append_live_indicator(m)
	title = m["title"]
	
	[("title", "#{title} $live$")]
end
# ------------------------------------

# ---- Building radio ----
myplaylists = map_metadata(append_album, random(id="day-random", weights = [1, 40, 30, 4, 22, 7, 22, 16, 12, 26, 2, 4, 14],
	[myreformatai, myindie, mygimtine, myjazz, myindierock, mychill, myrock, myelectronic, myold, myhiphop, mybad, myjapanese, mypop]))

mynightplaylists = map_metadata(append_album, random(weights = [16, 1, 18, 13, 6, 10, 18, 8, 10],
	[mynight, myreformatai, myindie, mygimtine, myjazz, myindierock, mychill, myrock, myelectronic]))

# Adding ad to day playlist
myplaylists = rotate(weights=[1, 20], [myad1, myplaylists])

# Switching to night playlist (server time is UTC+0)
myfullplaylists = mksafe(crossfade(duration=6.0, fade_in=3.5, fade_out=3.5,
	switch([
	({ 2h-20h }, myplaylists),
	({ 20h-2h }, mynightplaylists)])))

radio = fallback(track_sensitive=false, transition_length=12.0, transitions=[from_pls(myjingle), to_pls(myjingle)],
	[skip_blank(mymopidy, track_sensitive=false, max_blank=2.0, threshold=0.0), myfullplaylists])

full = fallback(track_sensitive=false, transition_length=7.0, transitions=[from_pls(myjingle2), to_pls(myjingle2)],
	[map_metadata(append_live_indicator, mylive), radio])

# ------------------------

# ---- Output ----
output.icecast(%vorbis,
	host = "localhost", port = 8000,
	password = "nu0stab_sraDijas-2", mount = "playlist.ogg",
	description = "Darkest Hour Radio, the best independent radio in the Baltic States",
	icy_metadata="true",
	full)
