import { ApolloServer, gql } from "apollo-server";

const users = [
   {
      id: "1",
      username: "Robin Wieruch",
      firstName: "Robin",
      lastName: "Wieruch",
   },
   {
      id: "2",
      username: "Dave Davids",
      firstName: "Dave",
      lastName: "Davids",
   },
   {
      id: "3",
      username: "Dave Davids3",
      firstName: "Dave3",
      lastName: "Davids3",
   }
];

const tweets = [
   {
      id: "1",
      text: "Hello World",
      authorId: "1",
   },
   {
      id: "2",
      text: "Hi, GraphQL",
      authorId: "2",
   },
];


const typeDefs = gql`
      type User {
         id: ID!
         username: String!
         firstName: String
         lastName: String
         """ fullName = firstName + lastName"""
         fullName: String
      }
      """ Tweet is a post by a user"""
      type Tweet {
         id: ID!
         text: String!
         author: User!
      }
      type Movie {
         id:Int!
         url:String!
         imdb_code   :String!
         title      :String!
         title_english  :String!
         title_long  :String!
         slug      :String!
         year    :Int!
         rating   :Float!
         runtime     :Int!
         genres   :[String!]!
         download_count :Int!
         like_count  :Int! 
         description_intro :String!
         description_full :String!
         yt_trailer_code :String!
         language   :String!
         mpa_rating :String!
         background_image :String!
         background_image_original :String!
         small_cover_image :String!
         medium_cover_image :String!
         large_cover_image :String!
      }
   type Query {
      allTweets: [Tweet!]!
      tweet(id: ID!): Tweet
      allUsers: [User!]!
      user(id: ID!): User
      allMovies:[Movie!]!
      movie(id:ID!):Movie
   }
   type Mutation {
      postTweet(text: String!, userId: ID!): Tweet
      deleteTweet(id: ID!): Boolean
   }
`;
const resolvers = {
   Query: {
      allTweets: () => tweets,
      tweet: (_, { id }) => tweets.find(tweet => tweet.id === id),
      allUsers: () => users,
      user: (_, { id }) => users.find(user => user.id === id),
      allMovies: () => fetch('https://yts.mx/api/v2/list_movies.json')
         .then(res => res.json())
         .then(json => json.data.movies),
      movie: (_, { id }) => fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
         .then(res => res.json())
         .then(json => json.data.movie)
      ,
   },
   Mutation: {
      postTweet: (_, { text, userId }) => {
         const newTweet = {
            id: tweets.length + 1,
            text,
            authorId: userId,
         };
         tweets.push(newTweet);
         return newTweet;
      },
      deleteTweet: (_, { id }) => {
         const tweetIndex = tweets.findIndex(tweet => tweet.id === id);
         if (tweetIndex !== -1) {
            tweets.splice(tweetIndex, 1);
            return true;
         }
         return false;
      }
   },
   User: {
      fullName: ({ firstName, lastName }) => `${firstName} ${lastName}`
   },
   Tweet: {
      author: ({ authorId }) => users.find(user => user.id === authorId),
   }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
   console.log(`🚀 Server ready at ${url}`);
}); 