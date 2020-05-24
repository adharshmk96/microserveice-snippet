const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const axios = require('axios');

const cors = require('cors');

const app = express();

const posts = {};

app.use(bodyParser.json());
app.use(cors());

app.get('/posts', (req,res)=>{
    res.send(posts);
});

app.post('/posts', async (req,res)=>{
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = {id,title};

    const event = {
        type:'PostCreated',
        data:{
            id,title
        }
    }

    try {
        await axios.post('http://event-bus:4005/events', event);
    }
    catch(err) {
        console.log(err.message);
    }

    res.status(201).send(posts[id]);

});

app.post('/events', (req,res)=>{
    console.log('Received Event', req.body.type);

    res.send({});
});

app.listen(4000, ()=> {
    console.log('Listening in 4000')
})