const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs } = require('./Schema/TypeDefs');
const { resolvers } = require('./Schema/Resolvers');
const mongoose = require('mongoose');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

const url = 'mongodb://127.0.0.1:27017/assessment-4';
// starting mongoose
mongoose
	.connect(url, { useNewUrlParser: true })
	.then(() => {
    
    // fx that start our GraphQL server
    async function startServer() {
        apolloServer = new ApolloServer({
            typeDefs,
            resolvers,
            context: ({ req }) => {
            // Checks for Header or assigns Null
            const authorizationHeaader = req.headers.authorization || '';
            
            if (authorizationHeaader !== '') { // if an auth token was availabe it's validated and added to GQL context
                const token = req.headers.authorization.split(' ')[1];
                const options = { expiresIn: '10d' };
                req.decoded = jwt.verify(token, process.env.JWT_SECRET, options);
                return {validate:true};
            } else {
                return {validate:false};
            }}
        });
        await apolloServer.start();
        app.use("/api", apolloServer.getMiddleware({}))
    }

    const app = express();
    app.use(morgan('dev'))
    startServer();
    app.listen(4000, function () {
        console.log(`server running on port 4000`);
    });
})