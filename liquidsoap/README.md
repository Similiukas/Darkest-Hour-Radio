# Simple tips on how it works

*(keep in mind, rasau po labai seniai naudojimo)*

## To start liquidsoap radio:

 `sudo systemctl start ref-liquidsoap`

## To stop liquidsoap radio:

 `sudo systemctl stop ref-liquidsoap`

## To restart:

 `sudo systemctl restart ref-liquidsoap`

## To check status:

 `sudo systemctl status`

## To create liquidsoap daemon:
While in `/liquidsoap-daemon` folder run:

 `./daemonize-liquidsoap.sh ref`

*`ref.liq` file must be in `/liquidsoap-daemon/script` folder*


## To open icecast2 xml:

 `sudo nano /etc/icecast2/icecast.xml`

Need to then restart the SysteMD service with

 `sudo systemctl restart icecast2`

## Mopidy start

As a service:

 `sudo systemctl start mopidy`

from command line:

 `sudo mopidy -v`

To get installed extensions and config:

`mopidy deps` and `mopdiy config`

### Mopidy-Spotify

To get Mopidy-Spotify run:

 `sudo python3 -m pip install --upgrade Mopidy-Spotify`

For it to work, need to have pyspotify installed:

 `sudo python3 -m pip install --upgrade pyspotify`

For this, need libspotify. Just a simple:

 `wget -O - https://mopidy.github.io/libspotify-archive/ && tar -xf -`

Then just read the README

Then also need *libffi*: https://github.com/libffi/libffi

The problem is that it installs in the wrong place, it needs to be installed in `usr/lib/x86-64-linux-gnu` so just move file there (to know where it installed run `whereis libffi`). Then need to reconfigure pkgconfig file
which is usually located where libffi is installed. The proper configuration for it is:
```
 prefix=/usr
 exec_prefix=${prefix}
 libdir=${exec_prefix}/lib
 toolexeclibdir=${exec_prefix}/lib../lib
 includedir=${prefix}/include

 AND THE REST IS UNCHANGED
```

## GStreamer stuff

To check gstreamer version run `dpkg -l | grep gstreamer`.
Currently gstreamer version 1.20 is installed which is only available on unstable Debian version. To install it, first need to add apt-source list *(look in `/etc/apt/sources.list.d`)*. Then just simply:
```
 apt-get install libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev libgstreamer-plugins-bad1.0-dev gstreamer1.0-plugins-base gstreamer1.0-plugins-good gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly gstreamer1.0-libav gstreamer1.0-doc gstreamer1.0-tools gstreamer1.0-x gstreamer1.0-alsa gstreamer1.0-gl gstreamer1.0-gtk3 gstreamer1.0-qt5 gstreamer1.0-pulseaudio
```
**WITHOUT THE _gstreamer1.0-doc_ package**

### GStreamer sucky:

For some reason, it doesn't send **ANY** metadata at all, which just sucks. No idea why. Neither with mp3 or vorbis format. So to battle it, made a simple python service which uses WebSockets with Mopidy.
Then just dinamically updating metadata using Icecast url metadata update feature. At least something Icecast does somewhat nicely. All of the code and documentation is in `update-metadata` folder.

## Nginx:

App has nginx as a reverse proxy to provide TLS certificate for `stream.dhardio.tk`. DNS just has A record with the static IP and then using certbot to create a free certificate. To reload nginx after making some changes use:
```
sudo systemctl reload nginx.service
```
Also, used [this](https://ivanderevianko.com/2019/03/migrate-letsencrypt-certificates-certbot-to-new-server) tutorial to transfer private keys. Note: before running `sudo certbot renew --dry-run` need to install `python3-certbot-nginx`.
Plus need to transfer site config file (`/etc/nginx/sites-enabled/SITE`), `ssl-dhparams.pem` and `options-ssl-nginx.conf` files and reload nginx.
