import express from "express";
import helmet from "helmet";
import compression from "compression";

import SongRouter from "./songs/routes.config.js";
import ScheduleRouter from "./schedule/routes.config.js";
import RecordingRouter from "./recordings/routes.config.js";

const app = express();

/*
 Different way to use cors

var whitelist = ['http://example1.com', 'http://example2.com']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS')) This way it would send an error if origin is wrong
    }
 }
}

app.use(cors(corsOptions));
*/

const port = process.env.PORT || 3002;


// Take a look at compressions
// https://hacks.mozilla.org/2015/11/better-than-gzip-compression-with-brotli/
// https://stackoverflow.com/questions/48039152/how-does-simply-piping-to-the-response-object-render-data-to-the-client
// Before production https://expressjs.com/en/advanced/best-practice-security.html
// Some cool tips: https://nodesource.com/blog/nine-security-tips-to-keep-express-from-getting-pwned/

// Setting headers to prevent well-know vulnerabilites
app.use(helmet());

// Using gzip compression (tho brotli should be supported soon hopefully? https://github.com/expressjs/compression/pull/172)
// Right now, this is probably never used, since by default, the threshold to consider compression is 1KB
// but now the body is usually really small. Also, for audio files, compression is not needed, only for text files
app.use(compression());

app.use((req, res, next) => {
    res.header({
        "Access-Control-Allow-Origin": "https://dhradio.web.app",
        "Access-Control-Allow-Headers": "Accept, Authorization, Content-Type, X-Requested-With, Origin, Range",
        "Access-Control-Allow-Methods": "GET, POST, DELETE",
        "Access-Control-Expose-Header": "Content-Length",
    });
    // All of those headers can be changed with something like Insomnia or even curl, so this is not the most secure
    // But don't have any really sensative data so it's fine
    // In a real app would send firebase user auth token and then check it. Or use something like JWT if not using firebase
    // Firebase: https://firebase.google.com/docs/auth/admin/verify-id-tokens#web
    if (req.headers.referer === "https://dhradio.web.app/" && req.headers.origin === "https://dhradio.web.app"){
        if (req.method === "OPTIONS"){
            return res.sendStatus(200);
        }
        else next();
    }
    else    res.status(403).send({ Error: "Not authorized" });
})


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

SongRouter(app);
ScheduleRouter(app);
RecordingRouter(app);

app.listen(port, () =>{
    console.log("App listening on port", port);
    console.log(`The process pid is: ${process.pid}`);
    console.log('Deploying to fly: fly deploy -a dhradio-api')
})

// A process can not listen to sigkill: https://stackoverflow.com/q/42450501/9819103
process.on('exit', (code) => {
    console.log("Cia jau kai exit kviecia, Process exit:", code);
})
