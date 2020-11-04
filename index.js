/**
 * PSaaS Open API App.
*/


if (process.env.NODE_ENV !== 'prodcution') {
    require('dotenv').config()
}
const appFullName = "PSaaS Open API"
const appPort = 3200

const WebSocket = require('ws')

const isMobile = require('is-mobile');
const path = require('path');

const express = require('express')

const favicon = require('express-favicon');

const session = require('express-session')

const app = express()

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
app.use(favicon(__dirname + '/webui/icons/favicon-96x96.png'));
app.use(express.urlencoded({ extended: false }))
// app.use(cookieParser())
// app.use(cookieSession({
//     keys: ['key1', 'key2']
// }));
//app.use(flash())
app.use(session({
    secret: 'secret12345',
    resave: false,
    saveUninitialized: false
}))



//app.use(methodOverride('_method'))



app.use(express.json());
//app.use('/webui', express.static('webui'))
app.use('/web', express.static(__dirname + '/web'));


app.get('/', checkMobile, async (req, res) => {
    console.log("Routing: /")
    let user = await req.user
    res.render('index.ejs', { user: user })
})


async function checkMobile(req, res, next) {
    let userIsMobile = await isMobile()
    req.user.isMobile = userIsMobile
    return next()
}


const wss = new WebSocket.Server({
    port: 8111,
    perMessageDeflate: {
        zlibDeflateOptions: {
            // See zlib defaults.
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024 // Size (in bytes) below which messages
        // should not be compressed.
    }
});
wss.broadcast = function broadcast(msg) {
    // console.log(msg);
    wss.clients.forEach(function each(client) {
        client.send(msg);
    });
};




//socket handler
wss.on('connection', function connection(ws) {
    let fh = myWs = ws
    ws.on('message', async function incoming(message) {
        console.log('received: %s', message);
        let packet = JSON.parse(message)


        if (packet.task) {
            switch (packet.task) {
                case "getUserMaps": {
                    let user = await getUserById(packet.data)
                    console.log("Sending user maps", user)
                    // gather user maps 
                    let maps = await (typeof user.maps == 'undefined') ? [] : user.maps
                    let outPacket = await JSON.stringify({
                        maps: maps,
                        task: 'listMaps'
                    })

                    ws.send(outPacket)
                    // send maps back to client.





                    break;


                }
                case "getUserLayers": {
                    let user = await getUserById(packet.data)
                    console.log("wss: Sending user layers to ", user.name)
                    // gather user maps 
                    let layers = await (typeof user.layers == 'undefined') ? [] : user.layers

                    let cannedLayers = await Object.assign(layers, serverMapLayers)


                    let outPacket = await JSON.stringify({
                        layers: cannedLayers,
                        task: 'listUserLayers'
                    })

                    ws.send(outPacket)
                    // send maps back to client.





                    break;


                }
                case "appVersion": {

                    let pjson = await require('./package.json');
                    let version = await pjson.version
                    console.log("wss: Sending app version", version)
                    let outPacket = await JSON.stringify({
                        version: version,
                        task: 'appVersion'
                    })

                    ws.send(outPacket)
                    break;
                }

                default: {
                    console.log("unknown WSS command....", message)
                }
            }

        }
        else {
            console.log("unknown WSS command....", message)
        }



        // ws.send(JSON.stringify({ task: 'reload fog', ts: Date.now() }));
    })

    ws.on('close', function close() {
        console.log('disconnected');
    });


});


process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

//app.listen(3100)
app.listen(appPort, () => {
    let startDate = new Date()
    let dateString = new Intl.DateTimeFormat('en-CA').format(startDate)

    // .toLocaleDateString(
    //     'ko-KR'
    // );
    console.clear();
    console.log("========================================================================")
    console.log(`${appFullName} running on PORT ${appPort}  :  ${startDate}`)
    // console.log("using CORS(*)")

}
);