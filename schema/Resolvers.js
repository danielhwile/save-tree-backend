const User = require("../models/Users");
const Post = require("../models/Posts");
const Comment = require("../models/Comments")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ApolloError } = require("apollo-server-errors");

const generateToken = (user) => {
  // Generate token is used to take a username and create a JWT token to assist user auth.
    let isMatch = bcrypt.compareSync(user.passwordHash, user.password);
    if (isMatch) {
        const payload = { username: user.username };
        const options = { expiresIn: '10d' };
        const secret = `286752148970c89b8c1ef0528dcae3053ac5f5cafc242afff26826b0d19afc77`;
        const token = {username: user.username , jwt: jwt.sign(payload, secret, options)};
        return token;
    } else {
        return new ApolloError("Err Password Mismatch")
    }
}

const resolvers = {

    Query: {
        getUser: async (parent, args, ctx) => {
            if (!ctx.validate) return 'bad Auth';
            let user = await User.findOne(args);
            return user;
        },
        getPosts: async(parent, args, ctx) => {
            if (!ctx.validate) {
              return 'bad Auth';
            }
            return await Post.find(args).sort({voteSum: -1});
        }
        // Getting comments is handled withen the Post query section. (Post:comments:)
    },

    User: {
      posts: async (parent, args, ctx) => {
          return await Post.find({creator: parent.username});
      }
    },
    Post: {
      comments: async (parent, args, ctx) =>{
          return await Comment.find({post_id: parent._id}).sort({createdAt: -1});
      },
      userVote: async (parent, args, ctx) =>{
          let post = await Post.findOne({_id: parent._id});
          if (post.userVoters.get(args.username) !== undefined) {
            return {user:args.username,vote:post.userVoters.get(args.username)}
          } else {
            return {user:args.username,vote:0}
          }
      } 
    },

    Mutation: {
      // postUser handles both log In and Register Functionality. If an Email is sent, it registers the account, if just a username/PW then it logs in.
      postUser: async (parent, args, ctx) => {
        let rawPassword = args.password; // we temporarily store the raw PW here to compare for log ins.
        args.password = bcrypt.hashSync(args.password, 10)
        if (args.email){  // If email try to register the args as a new user
          const newUser = new User(args);
          await newUser.save()
          return generateToken({...newUser._doc, passwordHash: rawPassword}); // generate token send a JWT back to the user after a successful registration
        } else {  // if not email log in
          const user = await User.findOne({username: args.username});
          return generateToken({...user._doc, passwordHash: rawPassword}); // generate token sends a JWT back ot the user after a successful log in
        }
      },
      postPost: async (parent,args,ctx) => {
        if (!ctx.validate) return 'bad Auth'; // checking auth
        const newPost = new Post(args);
        newPost.voteSum = 1; // setting initial vote sum at 1
        newPost.userVoters = {[args.creator]:1}; // setting the creator as an initial upvote.
        await newPost.save();
        return newPost;
      },
      postComment: async (parent, args,ctx) => {
        if (!ctx.validate) return 'bad Auth';
        const newComment = new Comment(args);
        await newComment.save();
        return newComment;
      },
      putVote: async (parent, args,ctx) => {
        //This function will trigger whenever a user votes.
        // It needs to Find a post. See what a user's current vote is, and update it.
        // Then it also needs to also properly adjust our running total
        if (!ctx.validate) return 'bad Auth';
        const post = await Post.findOne({_id: args.post_id});
        let voteSum = post.voteSum;
        let tempVote = {}
        if (post.userVoters.get(args.username) !== undefined) { // checking our db map to see if the user had voted on the post yet. if not we assign an initial vote of zero
          tempVote = {user:args.username,vote:post.userVoters.get(args.username)}
        } else {
          tempVote = {user:args.username,vote:0}
        }
        voteSum = voteSum - tempVote.vote + args.vote; // adjusting vote sum by removing prior vote (0 for no prior vote) and adding the new vote.
        tempVote.vote = args.vote // preping tempvote to be sent back to the Front End.
        post.userVoters.set(args.username,args.vote)  // setting the new vote in the post's map
        post.voteSum = voteSum
        await post.save();
        return tempVote;

      },
      putPost: async (parent, args, ctx) => {
        if (!ctx.validate) return 'bad Auth';
        return await Post.findOneAndUpdate({_id:args._id},args);
      },
      putComment: async (parent, args, ctx) => {
        if (!ctx.validate) return 'bad Auth';
        return await Comment.findOneAndUpdate({_id:args._id},args);
      },
      putUser: async (parent, args, ctx) => {
        if (!ctx.validate) return 'bad Auth';
        return await User.findOneAndUpdate({_id:args._id},args);
        //Note: Add Password Changing capabilities later.
      },
      deletePost: async (parent, args, ctx) => {
        if (!ctx.validate) return 'bad Auth';
        await Post.findByIdAndDelete(args._id);
        return {string:"deleted"};
      },
      deleteComment: async (parent, args, ctx) => {
        if (!ctx.validate) return 'bad Auth';
        await Comment.findByIdAndDelete(args._id);
        return {string:"deleted"};
      },
      deleteUser: async (parent, args, ctx) => {
        if (!ctx.validate) return 'bad Auth';
        await User.findByIdAndDelete(args._id);
        return {string:"deleted"};
      }
    }
};


module.exports = {resolvers}