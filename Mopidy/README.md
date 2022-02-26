# Custom lil service for metadata update

Just a simple custom python service which updates Icecast2 metadata from Mopidy.

Connects to mopidy with WebSockets and then since mopidy sends [WebSocket events](https://docs.mopidy.com/en/latest/api/http/#websocket-api), we can update Icecast metadata with a simple [http request](https://www.icecast.org/docs/icecast-trunk/admin_interface/#metadata-update).
Could've also made it simpler with JS, since Mopidy has JS [SDK](https://github.com/mopidy/mopidy.js) but just wanted to use Python and not install Node on this VM.

## Cool stuff:

This script is run as a service with **Systemd**.

The main systemd config file is at `/etc/systemd/system/update-metadata.service`. Documentation about it is [here](https://unix.stackexchange.com/a/401080) and [here](https://medium.com/codex/setup-a-python-script-as-a-service-through-systemctl-systemd-f0cc55a42267).

To run it, use:

 `sudo systemctl start update-metadata`

To watch status:

 `sudo systemctl status update-metadata`

To see the logs:

 `journalctl -u update-metadata`

To run on boot: *(don't know if works, since needs to start after mopidy but in theory it should run after mopidy)*

 `sudo systemctl enable update-metadata`
