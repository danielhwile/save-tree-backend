const chai = require('chai');
const chaiHttp = require('chai-http');
const graphql = require('graphql');

const app = require('../Server');
const newPost = {};
const expect = chai.expect;
const url = `http://localhost:4000/`;
const request = require('supertest')(url);
const putQuery = {};
const delQuery = {};
describe('GraphQL Issue Posts CRUD Test', () => {
    it('Returns One post with id = 6148e38a40f3cedb90e20701', (done) => {
        request.post('api/graphql')
        .set("Authorization", "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGFuaWVsaHdpbGUiLCJpYXQiOjE2MzE5NzIwNTksImV4cCI6MTYzMjgzNjA1OX0.4hBd5MRfkGUHSgP4kYRRQPiyefNh4SrnenLOnxB3Zjk')
        /* This Token WILL EXPIRE around 9/27/2021 AND NEED TO BE REBUILT via a user log-in/registration*/
        .send({query: '{ getPosts(_id: "6148e38a40f3cedb90e20701") { _id creator title } }'})
        .expect(200)
        .end((err,res) => {
            // res will contain array with one user
            if (err) return done(err);
            expect(res.body.data.getPosts[0]._id).to.deep.equal('6148e38a40f3cedb90e20701')
            expect(res.body.data.getPosts[0]).to.haveOwnProperty('creator');
            expect(res.body.data.getPosts[0]).to.haveOwnProperty('title');
            done();
        })
    })
    it('Returns All Posts', (done) => {
        request.post('api/graphql')
        .set("Authorization", "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGFuaWVsaHdpbGUiLCJpYXQiOjE2MzE5NzIwNTksImV4cCI6MTYzMjgzNjA1OX0.4hBd5MRfkGUHSgP4kYRRQPiyefNh4SrnenLOnxB3Zjk')
        /* This Token WILL EXPIRE around 9/27/2021 AND NEED TO BE REBUILT via a user log-in/registration*/
        .send({query: '{ getPosts { _id creator title } }'})
        .expect(200)
        .end((err,res) => {
            // res will contain array with one user
            if (err) return done(err);
            expect(res.body.data.getPosts.length).to.be.above(1);

            done();
        })
    })
    it('Gets posts by creator: danielhwile', (done) => {
        request.post('api/graphql')
        .set("Authorization", "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGFuaWVsaHdpbGUiLCJpYXQiOjE2MzE5NzIwNTksImV4cCI6MTYzMjgzNjA1OX0.4hBd5MRfkGUHSgP4kYRRQPiyefNh4SrnenLOnxB3Zjk')
        /* This Token WILL EXPIRE around 9/27/2021 AND NEED TO BE REBUILT via a user log-in/registration*/
        .send({query: '{ getPosts(creator:"danielhwile") { _id creator title } }'})
        .expect(200)
        .end((err,res) => {
            // res will contain array with one user
            if (err) return done(err);
            expect(res.body.data.getPosts.length).to.be.above(1);

            done();
        })
    })
    it('adds a new post', function(done) {
        request.post('api/graphql')
        .set("Authorization", "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGFuaWVsaHdpbGUiLCJpYXQiOjE2MzE5NzIwNTksImV4cCI6MTYzMjgzNjA1OX0.4hBd5MRfkGUHSgP4kYRRQPiyefNh4SrnenLOnxB3Zjk')
        /* This Token WILL EXPIRE around 9/27/2021 AND NEED TO BE REBUILT via a user log-in/registration*/
        .send({query: 'mutation postPost { postPost(title:"This is a post", description:"This post is made by MochaChai",creator:"mochaChai") { _id creator title } }'})
        .expect(200)
        .end((err,res) => {
            // res will contain array with one user
            if (err) return done(err);
            expect(res.body.data.postPost).to.haveOwnProperty('title');
            expect(res.body.data.postPost).to.haveOwnProperty('creator');
            newPost._id = res.body.data.postPost._id;
            // Setting up query strings for the next tests.
            putQuery.query = 'mutation putPost { putPost(_id:"'+newPost._id+'", description:"This Post was Edited by Mocha and Chai") { creator description title } }'
            delQuery.query= 'mutation deletePost { deletePost(_id:"'+newPost._id+'") { string } }'
            done();
        })
    })
});
describe('GraphQL Issue Posts CRUD Test pt2', function () {
    it('edits a post', function(done) {
        request.post('api/graphql')
        .set("Authorization", "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGFuaWVsaHdpbGUiLCJpYXQiOjE2MzE5NzIwNTksImV4cCI6MTYzMjgzNjA1OX0.4hBd5MRfkGUHSgP4kYRRQPiyefNh4SrnenLOnxB3Zjk')
        /* This Token WILL EXPIRE around 9/27/2021 AND NEED TO BE REBUILT via a user log-in/registration*/
        .send(putQuery)
        .expect(200)
        .end((err,res) => {
            // res will contain array with one user
            
            if (err) return done(err);
            expect(res.body.data.putPost).to.haveOwnProperty('title');
            expect(res.body.data.putPost).to.haveOwnProperty('creator');

            done();
        })
    })
    it('deletes a post', function(done) {
        request.post('api/graphql')
        .set("Authorization", "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGFuaWVsaHdpbGUiLCJpYXQiOjE2MzE5NzIwNTksImV4cCI6MTYzMjgzNjA1OX0.4hBd5MRfkGUHSgP4kYRRQPiyefNh4SrnenLOnxB3Zjk')
        /* This Token WILL EXPIRE around 9/27/2021 AND NEED TO BE REBUILT via a user log-in/registration*/
        .send(delQuery)
        .expect(200)
        .end((err,res) => {
            // res will contain array with one user
            if (err) return done(err);
            expect(res.body.data.deletePost).to.haveOwnProperty('string');
            expect(res.body.data.deletePost.string).to.deep.equal("deleted")

            done();
        })
    })
});