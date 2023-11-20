// initDB.js

const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/surveys', async (req, res) => {
    const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();

        const db = client.db('my_database');

        const surveys = await db.collection('Surveys').find().toArray();

        res.send(surveys);
    } finally {
        await client.close();
    }
});

app.post('/api/surveys', async (req, res) => {
    const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();

        const db = client.db('my_database');

        const survey = await db.collection('Surveys').insertOne({
            "Title": req.body.title,
            "Votes": []
        });

        res.send(survey);
    } finally {
        await client.close();
    }
});

app.post('/api/surveys/:id/vote', async (req, res) => {
    const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();

        const db = client.db('my_database');

        const survey = await db.collection('Surveys').findOne({ _id: new ObjectId(req.params.id) });

        if (!survey) {
            return res.status(404).send('Survey not found');
        }

        let client_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        const ipExists = survey.Votes.find(v => v.IP === client_ip);
        if (ipExists) {
            return res.status(403).send('IP already voted');
        }

        const vote = {
            "IP": client_ip,
            "Timestamp": new Date()
        };

        const surveyVote = await db.collection('Surveys').updateOne({ _id: new ObjectId(req.params.id) }, { $push: { Votes: vote } });

        res.send(surveyVote);
    } finally {
        await client.close();
    }
});

app.get('/api/surveys/:id/results', async (req, res) => {
    const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();

        const db = client.db('my_database');

        const survey = await db.collection('Surveys').findOne({ _id: new ObjectId(req.params.id)});

        if (!survey) {
            return res.status(404).send('Survey not found');
        }

        const results = {
            "Title": survey.Title,
            "Votes": survey.Votes.length
        };

        res.send(results);
    } finally {
        await client.close();
    }
});

app.delete('/api/surveys/:id', async (req, res) => {
    const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();

        const db = client.db('my_database');

        const survey = await db.collection('Surveys').findOne({ _id: new ObjectId(req.params.id) });

        if (!survey) {
            return res.status(404).send('Survey not found');
        }

        const surveyDelete = await db.collection('Surveys').deleteOne({ _id: new ObjectId(req.params.id) });

        res.send(surveyDelete);
    } finally {
        await client.close();
    }
});

app.put('/api/surveys/:id', async (req, res) => {
    const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();

        const db = client.db('my_database');

        const survey = await db.collection('Surveys').findOne({ _id: new ObjectId(req.params.id) });

        if (!survey) {
            return res.status(404).send('Survey not found');
        }

        const surveyUpdate = await db.collection('Surveys').updateOne({ _id: new ObjectId(req.params.id) }, { $set: { Title: req.body.title } });

        res.send(surveyUpdate);
    } finally {
        await client.close();
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
