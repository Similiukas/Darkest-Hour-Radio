%include "~/liquidsoap-daemon/script/custom_random.liq"
%include "~/liquidsoap-daemon/script/secret.liq"
log.level.set(3)
log.file.set(true)
log.file.path.set("/tmp/reformatai-liq.log")
settings.server.telnet.set(false)
settings.harbor.bind_addrs.set(["0.0.0.0"])

# ---- Playlists ----
myreformatai = playlist("~/music/playlists/reformatai_2.pls", mime_type="audio/x-scpls", prefetch=3)
myindie = playlist("~/music/playlists/indie.pls", mime_type="audio/x-scpls", prefetch=3)
mygimtine = playlist("~/music/playlists/gimtine.pls", mime_type="audio/x-scpls", prefetch=3)
myhiphop = playlist("~/music/playlists/hiphop.pls", mime_type="audio/x-scpls", prefetch=3)
myjapanese = playlist("~/music/playlists/japanese.pls", mime_type="audio/x-scpls", prefetch=3)
myold = playlist("~/music/playlists/old.pls", mime_type="audio/x-scpls", prefetch=3)
myrock = playlist("~/music/playlists/rock.pls", mime_type="audio/x-scpls", prefetch=3)
myelectronic = playlist("~/music/playlists/electronic.pls", mime_type="audio/x-scpls", prefetch=3)
mychill = playlist("~/music/playlists/chill.pls", mime_type="audio/x-scpls", prefetch=4)
mybad = playlist("~/music/playlists/bad.pls", mime_type="audio/x-scpls", prefetch=3)
myjazz = playlist("~/music/playlists/jazz.pls", mime_type="audio/x-scpls", prefetch=3)
myindierock = playlist("~/music/playlists/indie_rock.pls", mime_type="audio/x-scpls", prefetch=3)
mynight = playlist("~/music/playlists/night.pls", mime_type="audio/x-scpls", prefetch=3)
mypop = playlist("~/music/playlists/pop.pls", mime_type="audio/x-scpls", prefetch=3)
# -------------------

# ---- Mopidy ----
# This just prints metadata and does not modify it
# https://github.com/savonet/liquidsoap/issues/2241
def log_metadatas(m) =
        print("cia kazkas eina")
        print(m)
        print(m["title"])
end

mymopidy = input.harbor("/mopidy", port=8800, password=ICECAST_PASSWORD, metadata_charset="UTF-8")

mymopidy.on_metadata(log_metadatas)
# ----------------

# ---- Live ----
# The problem is that track metadata is not updated.
# Need to broadcast MP3 from Mixxx and output MP3 from liquidsoap
# But Icecast get first track's metadata and that's it. It doesn't change the metadata from track to track
mylive = input.harbor("/mixxx", port=ICECAST_DJ_PORT, password=ICECAST_PASSWORD, buffer=30.0, max=31.0)
# --------------

# ---- Jingles ----
#myjingle = single("~/music/jingles/intro.wav")
#myjingle2 = single("~/music/jingles/intro.mp3")
myad1 = single("~/music/jingles/radio-ad-1-silence.mp3")
# -----------------

# ---- Transitions ----
def from_pls((jingle:source), (old:source), (new:source))
        old = fade.out(old, duration=3.8)

        s = add([jingle, old])

        sequence([s, new])
end

def to_pls((jingle:source), (old:source), (new:source))
        old = fade.out(old, duration=3.8)

        s = add([jingle, old])

        sequence([s, fade.in(new, duration=3.8)], merge=true)
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
        print("Live audio metadata: #{m}")
        title = m["title"]
        
        [("title", "#{title} $live$")]
end
# ------------------------------------

#---- Building radio ----
myplaylists = map_metadata(append_album, custom_random(id="day-random", min_tracks=2, weights = [1, 40, 30, 4, 22, 7, 22, 16, 12, 26, 2, 4, 14],
        [myreformatai, myindie, mygimtine, myjazz, myindierock, mychill, myrock, myelectronic, myold, myhiphop, mybad, myjapanese, mypop]))

mynightplaylists = map_metadata(append_album, custom_random(min_tracks=4, weights = [16, 1, 18, 13, 6, 10, 18, 8, 10],
        [mynight, myreformatai, myindie, mygimtine, myjazz, myindierock, mychill, myrock, myelectronic]))

# Adding ad to day playlist
myplaylists = rotate(weights=[1, 20], [myad1, myplaylists])

# Switching to night playlist (server time is UTC+0)
myfullplaylists = mksafe(crossfade(duration=6.0, fade_in=3.5, fade_out=3.5,
        switch([
        ({ 2h-20h }, myplaylists),
        ({ 20h-2h }, mynightplaylists)])))

#radio = fallback(track_sensitive=false, transition_length=12.0, transitions=[from_pls(myjingle), to_pls(myjingle)],
#       [map_metadata(append_album, blank.skip(mymopidy, track_sensitive=false, max_blank=2.0, threshold=0.0)), myfullplaylists])

#radio = fallback(track_sensitive=false, transition_length=12.0, transitions=[from_pls(myfullplaylists, mymopidy), to_pls(myjingle, mymopidy, myfullplaylists)],
#       [blank.skip(mymopidy, track_sensitive=false, max_blank=2.0, threshold=0.0), myfullplaylists])

radio = fallback(track_sensitive=false, transition_length=12.0,
        [map_metadata(append_album, skip_blank(mymopidy, track_sensitive=false, max_blank=2.0, threshold=0.0)), myfullplaylists])

#full = fallback(track_sensitive=false, transition_length=7.6, transitions=[from_pls(myjingle2, radio, mylive), to_pls(myjingle2, mylive, radio)],
#       [map_metadata(append_live_indicator, mylive), radio])

full = fallback(track_sensitive=false, transition_length=7.0,
        [map_metadata(append_live_indicator, mylive), radio])

# ------------------------

# ---- Output ----
output.icecast(%vorbis,
        host = "127.0.0.1", port = 8000,
        password = ICECAST_PASSWORD, mount = "playlist.ogg",
        description = "Darkest Hour Radio, the best independent radio in the Baltic States",
        icy_metadata="true",
        full)
