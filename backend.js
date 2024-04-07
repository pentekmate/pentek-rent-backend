const express = require('express');
const app = express()
const http = require('http');

const port =process.env.PORT
const ip = process.env.IP


const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello, World!\n');
  });
// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

app.listen(port,ip, () => {
    console.log(`Server running at http://${ip}:${port}/`);
})