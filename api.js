const express = require("express");
const serverless = require("serverless-http");

const app = express();
// const router = express.Router();



const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');


// In-memory storage (replace with a database in production)
const dataStore = {};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get("/", (req, res) => {
    res.json({
        hello: "hi!"
    });
});

app.get('/test', (req, res) => {
    res.json({
        hello: "test!"
    });

})

app.post('/testpost', (req, res) => {
    res.json({
        hello: "hit the POST!"
    });
})


// Intermediary endpoint
app.post('/intermediary', (req, body) => {
    const uniqueId = crypto.randomBytes(16).toString('hex');
    dataStore[uniqueId] = req.body;

    // Set expiration for the data (e.g., 5 minutes)
    setTimeout(() => {
        delete dataStore[uniqueId];
    }, 5 * 60 * 1000);

    // body.json({
    //     hello: "hit the POST!"
    // });
    // Redirect to Flutter web app
    body.redirect(`https://your-flutter-web-app.com/?id=${uniqueId}`);
});

// Endpoint to retrieve data
app.get('/getData', (req, res) => {
    const { id } = req.query;
    if (dataStore[id]) {
        res.json(dataStore[id]);
        delete dataStore[id]; // Remove data after retrieval
    } else {
        res.status(404).json({ error: 'Data not found' });
    }
});

const PORT = process.env.PORT || 4040;

app.listen(PORT, console.log(
    `Server started on port ${PORT}`));

// app.use(`/.netlify/functions/api`, router);

// module.exports = app;
// module.exports.handler = serverless(app);