require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
})

app.use(
    '/graphql',
    graphqlHttp({
        schema: graphQlSchema,
        rootValue: graphQlResolvers,
        graphiql: true
    })
);

const URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@clusternftinder.tajvrwb.mongodb.net/test`;
const OPTIONS = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(URL, OPTIONS)
    .then(() => app.listen(3000)).catch(err => {
        console.log(err)
    });