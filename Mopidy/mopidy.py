import re
import asyncio
import websockets
import requests
import urllib.parse
import logging
import os

# logging format: https://docs.python.org/3/library/logging.html#logrecord-attributes
# This logger logs stuff to journald which is cool
logging.basicConfig(level=os.environ.get("LOGLEVEL", "INFO"), format='[%(asctime)s](%(funcName)s)%(levelname)s: %(message)s')

IP_ADDRESS = "127.0.0.1"
ICECAST_ADDRESS = f"http://{IP_ADDRESS}:8000/admin/metadata?"
ICECAST_MOUNTPOINT = "/playlist.ogg"
ICECAST_USER = ""
ICECAST_PASSWORD = ""


async def updateMetadata(songName):
    # Adding a little delay, since the audio is somewhere about 20s behind.
    # Liquidsoap always will update the first song's metadata. That is, when mopidy is started and first song starts playing, then since
    # audio is about 20s behind, it will overwrite this script's updated metadata but it will not overwrite next song's metadata
    await asyncio.sleep(3)
    logging.info(f"Updating metadata with song: {songName}")
    r = requests.get(f"{ICECAST_ADDRESS}mount={ICECAST_MOUNTPOINT}&mode=updinfo&song={urllib.parse.quote(songName)}", auth=(ICECAST_USER, ICECAST_PASSWORD))
    logging.debug(f"Request status code: {r.status_code}")
    logging.debug(f"Request response text: {r.text}")


def convertMessage(message):
    # Only converting messages with "event": "track_playback_started"
    if (re.search("\"event\": \"track_playback_started\"", message)):
        kazkas = re.findall("\"name\": \"(.*?)\"", message)
        # Escaping double escape character (\\u2019 -> \u2019)
        kazkas = [x.encode("latin1").decode('unicode_escape') for x in kazkas]
        songName = f"{str(kazkas[1])} - {str(kazkas[0])} #{str(kazkas[2])}"
        return songName
    else:
        return None


async def handler(websocket):
    while True:
        try:
            message = await websocket.recv()
        except asyncio.CancelledError:
            logging.info("Received keyboard interrupt")
            break
        except websockets.ConnectionClosedOK:
            logging.error("WebSocket connection closed with OK")
            break
        logging.info(f"ws message<{message}")
        convertedMessage = convertMessage(message)
        if (convertedMessage != None):
            await updateMetadata(convertedMessage)


async def main():
    websocket = await websockets.connect(f"ws://{IP_ADDRESS}:6680/mopidy/ws")
    try:
        await handler(websocket)
    finally:
        logging.info("Closing WebSocket connection")
        await websocket.close()


if __name__ == "__main__":
    logging.info("hello??--------------------------------------------")
    try:
        asyncio.run(main())
    except asyncio.TimeoutError:
        # TODO: jei pvz mopidy nera pajungtas, tai tada galima kas kokia 1 minute vis kviest ir ziet, ar pasijungs
        logging.error("Asyncio timeout reached. Most likely websocket connection failed to connect. Check address")
    except KeyboardInterrupt:
        pass
    finally:
        # Can have cleanup code here
        logging.info("Goodbye--------------------------------------------")


# Systemd stuff:
# For journalctl https://unix.stackexchange.com/a/550799
# To set up service https://unix.stackexchange.com/a/401080
# And https://medium.com/codex/setup-a-python-script-as-a-service-through-systemctl-systemd-f0cc55a42267
