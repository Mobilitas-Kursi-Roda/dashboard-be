const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT || 4000;
const app = express();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const routesV1 = require('./src/routes/v1');
const DB = require('./src/configs/knex');
const { attachPaginate } = require('knex-paginate');
const WebSocket = require('ws');
attachPaginate();

var corsOptions = {
    origin: "*"
};

app.use(fileUpload({
    limits: {
        fileSize: 5000000, // 5 MB limit
    },
    abortOnLimit: true,
}));
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send('<center style="font-size:40px;margin-top:23%">Kutoko Service 👋</center>');
})
app.post('/test', (req, res)=>{
    return res.json({
        data: 'ehe'
    });
});
app.use("/v1", routesV1);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const socket = new WebSocket.Server({ port: 3000 });

var i = 1;


setInterval(() => {
    socket.clients.forEach((client) => {
        client.send(JSON.stringify(
            [
                {
                    "id": "c4640a57-0cad-46dd-9d70-01343a79516e",
                    "name": "Mokura 1",
                    "speed": Math.floor(Math.random() * 45),
                    "throtle": Math.floor(Math.random() * 100),
                    "battery": Math.floor(Math.random() * 100),
                    "lat": -6.200000+(i/100000),
                    "long": 106.816666+(i/100000)
                },
                {
                    "id": "05598a91-f323-45e5-a295-19aa26249c5a",
                    "name": "Mokura 2",
                    "speed": Math.floor(Math.random() * 45),
                    "throtle": Math.floor(Math.random() * 100),
                    "battery": Math.floor(Math.random() * 100),
                    "lat": -6.200000+(i/100000),
                    "long": 106.816666+(i/100000)
                }
            ]
        ));
    });

    i++;
}, 2000);


socket.on('connection', (ws) => {
    console.log('Client connected');
    // setTimeout(() => {
    //     socket.clients.forEach((client) => {
    //         client.send("hehehe"+ i++);
    //     });
    //     console.log("hehehe"+ i++);
    // }, 1000);
    // ws.on('message', (data) => {

    //     socket.clients.forEach((client) => {
    //         if (client.readyState === WebSocket.OPEN) {
    //             client.send(data.toString());
    //         }
    //     })
    // });

    ws.on('close', () => {
        console.log('Client disconnected');
    })


});