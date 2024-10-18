const express = require("express");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();



const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');


// In-memory storage (replace with a database in production)
const dataStore = {};

router.use(cors());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.get("/", (req, res) => {
    res.json({
        hello: "hi!"
    });
});

router.get('/test', (req, res) => {
    res.json({
        hello: "test!"
    });

})

router.post('/testpost', (req, res) => {
    res.json({
        hello: "hit the POST!"
    });
})


// Intermediary endpoint
router.post('/intermediary', (req, body, res) => {
    const uniqueId = crypto.randomBytes(16).toString('hex');
    dataStore[uniqueId] = req.body;

    // Set expiration for the data (e.g., 5 minutes)
    setTimeout(() => {
        delete dataStore[uniqueId];
    }, 5 * 60 * 1000);

    //console.log("Request body::::" + body.toString);

    // body.json({
    //     hello: "hit the POST!"
    // });
    // Redirect to Flutter web app
    res.redirect(`https://iifl-loans-app.azurewebsites.net/?id=${uniqueId}`);
});

// Endpoint to retrieve data
router.get('/getData', (req, res) => {
    const { id } = req.query;
    if (dataStore[id]) {
        res.json(dataStore[id]);
        delete dataStore[id]; // Remove data after retrieval
    } else {
        res.status(404).json({ error: 'Data not found' });
    }
});

// const PORT = process.env.PORT || 4040;

// router.listen(PORT, console.log(
//     `Server started on port ${PORT}`));

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
