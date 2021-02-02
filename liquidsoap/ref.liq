# I'm using liquidsoap daemon (https://github.com/savonet/liquidsoap-daemon)
# So this file is located ~/liquidsoap-daemon/script/


set("log.file.path", "/tmp/dhradio.log")
set("server.telnet", false)
set("harbor.bind_addrs", ["0.0.0.0"])

# ---- Playlists ----
myreformatai = playlist("~/music/playlists/reformatai.pls")
myindie = playlist("~/music/playlists/indie.pls")
mygimtine = playlist("~/music/playlists/gimtine.pls")
myhiphop = playlist("~/music/playlists/hiphop.pls")
myjapanese = playlist("~/music/playlists/japanese.pls")
myold = playlist("~/music/playlists/old.pls")
myrock = playlist("~/music/playlists/rock.pls")
myelectronic = playlist("~/music/playlists/electronic.pls")
mychill = playlist("~/music/playlists/chill.pls")
mybad = playlist("~/music/playlists/bad.pls")
myjazz = playlist("~/music/playlists/jazz.pls")
# -------------------

# ---- Mopidy ----
mymopidy = input.harbor(port=8800, password="ICECAST_SOURCE_PASSWORD", "/MOPIDY_MOUNTPOINT")
# ----------------

# ---- Live ----
mylive = input.harbor(port=8006, password="ICECAST_SOURCE_PASSWORD", "/MIXXX_MOUNTPOINT")
# DJ sets password to ICECAST_SOURCE_PASSWORD, mountpoint to MIXXX_MOUNTPOINT and port to 8006
# --------------

# ---- Jingles ----
myjingle = single("~/music/jingles/intro.wav")
myjingle2 = single("~/music/jingles/intro.mp3")
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

        [("title", "#{title} ##{album}")]
end
# ------------------------------------

# ---- Building radio ----
myplaylists = mksafe(crossfade(duration=9.0, fade_in=4.0, fade_out=4.0,
	map_metadata(append_album, random(weights = [1, 4, 3, 1, 1, 2, 4, 2, 1, 1, 1],
	[myreformatai, myindie, mygimtine, myhiphop, myjapanese, myold, myrock, myelectronic, mychill, myjazz, mybad]))))

radio = fallback(track_sensitive=false, transition_length=12.0, transitions=[from_pls(myjingle), to_pls(myjingle)],
	[skip_blank(mymopidy, track_sensitive=false, max_blank=2.0, threshold=0.0), myplaylists])

full = fallback(track_sensitive=false, transition_length=7.0, transitions=[from_pls(myjingle2), to_pls(myjingle2)],
	[mylive, radio])

# ------------------------

# ---- Output ----
output.icecast(%vorbis.cbr(bitrate=64),
	host = "localhost", port = 8000,
	password = "ICECAST_SOURCE_PASSWORD", mount = "playlist.ogg",
	icy_metadata="true",
	full)
