const {gql} = require('apollo-server-express');
const typeDefs = gql`
    # types
    "A user is made for accessing login information for each account in the Back End"
    type User {
      _id: ID!
      "The users Username"
      username: String!
      "user raw password which will be hashed in the corresponding resolver postUser"
      password: String!
      "user email is stored on signup"
      email: String!
      "user posts collect all posts created by the user in the db"
      posts: [Post]
    }
    "Posts are topics created by users with a title, description, vote count, and comments"
    type Post {
      _id: ID!
      "The Posts's Title created by the user who sent the post"
      title: String!
      "The Post's description is created by the user who sent the post. Contains more info than the title"
      description: String!
      "username (unique) of the post creator"
      creator: String!
      "Vote sum is a running total of votes. Upvotes add 1, downvotes subtract 1"
      voteSum: Int!
      "This is a timestamp of when the post was created, used for showing post age"
      createdAt: String!
      "post comments collect all comments in response to the post in the db"
      comments: [Comment]
      "userVote checks a post's vote map in the db for what a current users vote is"
      userVote(username:String!): Vote

    }
    "Comments are in response to a parent post. They do not have titles nor voting, but do have content and a shown creator."
    type Comment {
      _id: ID!
      "The content of the comment is the user inputted text that will display"
      content: String!
      "the post_id helps tie the child comment to it's parent post"
      post_id: String!
      "the creator username helps tie the child comment to it's parent user"
      creator: String!
      "createdAt is used for display sorting and showing comment age to all users"
      createdAt: String!
    }
    type Token {
      "The token is a jwt system used to not force regular log ins. it is returned to the front end after log ins or registration"
      username: String
      jwt: String
    }
    "A vote is the return of how a user has voted previous or when a user has voted"
    type Vote {
      "The user who cast the vote"
      user: String
      "The value of the vote (-1 down, 0 no vote, +1 up)"
      vote: Int
    }
    type return {
      string: String
    }
    # Queries
    type Query {
      "get User pulls all needed data for the user pages"
      getUser(_id: ID,username: String): User!
      "get posts pulls all needed data for the front page, and comments pages"
      getPosts(_id: ID,creator: String,username: String): [Post]
    }
    # Mutations
    type Mutation {
      "postUser handles both log ins and registration, always returning a jwt"
      postUser(username: String!, password: String!, email: String): Token
      "postComment handles adding a new comment to a post from a comment section"
      postComment(content: String!, creator: String!, post_id:String!):Comment!
      "postPost creates a new post from our create post page"
      postPost(title: String!, description: String!, creator: String!): Post!
      "putVote is our vote handler. When a vote is sent in, the vote and vote total is updated"
      putVote(username: String!,post_id: String! vote:Int!): Vote!
      "putComment is for editing comment content. only for comment Creator"
      putComment(_id: String!, content: String!): Comment!
      "putUser is for editing user email. The username and PW cannot be changed"
      putUser(_id: String!, email: String!): User!
      "putPost is for editing a posts title or description only for post creator"
      putPost(_id: String!, title: String, description: String): Post!
      "deleteComment is for removing a comment. Only for comment creator"
      deleteComment(_id: String!): return
      "deletePost is for removing a post. Only for Post Creator"
      deletePost(_id: String!): return
      "deleteUser is for removing a user. Only for said User"
      deleteUser(_id: String!): return
    }
`;

module.exports = { typeDefs }