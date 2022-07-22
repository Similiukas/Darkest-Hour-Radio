# How to stream audio files:

Currently, we are just a simple proxy. Basically, we take audio hosted somewhere else *(currently [pCloud](https://my.pcloud.com))* and play it to the user. Additionally, this way we can know exactly when was the last time a user listened to the audio, and we can count them. Moreover, trying to be fancy and incrementing listener count only after some amount of audio has been played. This is the tricky part, since from the API itself, it's difficult to know for sure how much a user has listened to. Moreover, the goal is to also be efficient and have a great user experience, so they wouldn't have to wait 10s until they can start listening.

## Current implementation:

Currently, the implementation is rather straightforward. What we do is just store the url of the audio in the Firestore database and when the user asks for it, we scrape the actual url to the audio file *(this is because pCloud provides a static url to their own audio player, but we need url to the actual file which is embedded in the provided audio player)* and then pipe it to the user.

Using just plain simple [HTTP streaming](https://gist.github.com/CMCDragonkai/6bfade6431e9ffb7fe88.js) which just sends data in chunks with `Transfer-Encoding: chunked` header together with [Byte Serving](https://en.wikipedia.org/wiki/Byte_serving) *(`206` HTTP response with `Content-Range` and `Content-Length` headers)*. These two methods could be used separately, but combining them is even better. This works quite nicely, since modern browsers with `<audio>` API are optimised enough to not pipe all the data. Only some data is piped, enough to buffer 30 or so seconds. Moreover, using byte serving, we can pipe only a small portion of the audio. This allows seeking and jumping to the specific position, since the client (browser) asks for data with the `Range` header, which asks for some specific place in the audio. This also means, that the browser automatically makes multiple HTTP requests (because of the `206 Partial Content` response), thus we can keep track of how much data has been piped, thus we can add increment listener count only when 20% of data has been requested by the client.

## Other implementations:

### Sequential streams:
Another possible way to implement data streams is with sequential streams. That is, we combine multiple streams into one, which is piped to the user. This way, we can delay piping another source after first one ended or insert something else in the middle. All of this gives more control, but it's not necessary right now.
```js
// https://barstool.engineering/combining-sequential-streams-with-node-js/
async function _mergeStreams(streams, destination) {
    for (const stream of streams) {
        await new Promise((resolve, reject) => {
            stream.pipe(destination, { end: false });
            stream.on('end', () => {
                setTimeout(resolve, 1000*60);   // Adding a minute of delay before piping another stream (if network is not slow, this does not fail)
            });
            stream.on('error', reject);
        });
    }
    destination.end();
}
function mergeStreams() {
    let refStream = got.stream(refUrl);
    let shortStream = got.stream(shortUrl);

    let streams = [
        refStream,
        shortStream
    ];

    let totalSent = 0;

    let pass = new PassThrough();
    _mergeStreams(streams, pass);
    pass.on('data', buf => {
        totalSent += buf.length;
        console.log('send', totalSent, totalSent / refBytes, totalSent / (refBytes + shortUrlBytes));
    })
    return pass;
}
```

### HLS:
For proper high-scale implementation, [HLS](https://www.cloudflare.com/en-gb/learning/video/what-is-http-live-streaming/) would most likely would be used ([for example](https://medium.com/@HoseungJang/video-streaming-with-node-js-9401213a04e7)). What this gives, are the same byte serving advantages which allow seeking to a particular place and only serving small amount of data on demand. This means, if the client only listens for 10s, the whole file will not be downloaded.

However, the best advantage of using HLS, is that it is used for different quality streaming. What HLS does, is that it cuts the audio/video into small bits (usually 6s) and makes different quality files. This means, that there is a possibility to serve the same video/audio in 480p, 1080p or in 4K. Since only a small chunk is requested each time, if the network suddenly drops, then the server can pipe the lower quality chunk in order to keep continuous flow.

Moreover, with the coming of HTTP/2 and especially HTTP/3 with UDP over TCP, this can furthermore reduce the latency between the user click and the first audio byte.

Some other examples of using byte serving:

[StackOverflow](https://stackoverflow.com/a/42591021/9819103)

[Streaming videos](https://www.linode.com/docs/guides/build-react-video-streaming-app/#stream-a-video)

[Basic byte serving](https://blog.bywachira.com/post/stream-mp3-link-to-html-audio-tag)

[Decoding Opus in the web in chunks](https://github.com/AnthumChris/fetch-stream-audio)