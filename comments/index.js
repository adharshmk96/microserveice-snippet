const express = require('express')
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const axios = require('axios');

const app = express();
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {}

app.get('/posts/:id/comments',(req,res)=>{
    res.send(commentsByPostId[req.params.id] || []);
    
}); 

app.post('/posts/:id/comments', async (req,res)=>{
    const commentId = randomBytes(4).toString('hex');

    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];
    comments.push({id:commentId, content})
    commentsByPostId[req.params.id] = comments;

    const event = {
        type:'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id
        }
    }

    try {
        await axios.post('http://localhost:4005/events', event);
    }
    catch(err) {
        console.log(err.message);
    }

    res.status(201).send(comments);
});

app.post('/events', (req,res)=>{
    console.log('Received Event', req.body.type);

    res.send({});
});

app.listen(4001,()=>{
    console.log("Listening to 4001")
});