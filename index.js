const dgram = require("node:dgram");
import { name } from './node_modules/@leichtgewicht/ip-codec/types/index.d';
var packet = require("dns-packet");
const { type } = require("node:os");

const server = dgram.createSocket('udp4');

const db = {
    'netlify.com' : {
        type : 'A',
        data : '1.2.3.4'
    },
    'ronak-surve.netlify.com' : {
        type : 'CNAME',
        data : 'netlify.com'
    }
}

server.on('message', (msg, rinfo) => {
    const incomingReq = packet.decode(msg);
    const ipFromDb = db[incomingReq.questions[0].name];

    const ans = packet.encode({
        type : "response",
        id : incomingReq.id,
        flag : packet.AUTHORITATIVE_ANSWER,
        questions : incomingReq.questions,
        answers : [{
            type : 'A',
            class : 'IN',
            name : incomingReq.questions[0].name,
            data : ipFromDb.data
        }]
    })

    server.send(ans, rinfo.port, rinfo.address);
});

server.bind(53, () => console.log("Server is listening on port 53"))