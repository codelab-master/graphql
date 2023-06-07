# Rest API의 문제점

## 1. over-fetching
영화의 타이틀을 가져오고 싶은데 코드를 작성하면 영화의 모든 정보를 가져오게 된다. 이는 over-fetching이다. 필요한 정보만 가져오는 것이 아니라 불필요한 정보까지 가져오는 것이다. 이를 해결하기 위해 GraphQL이 나왔다.


## 2. under-fetching
영화의 장르를 알기 위해서는 장르 코드를 다시 조회해야 하는 경우가 생긴다. 이는 under-fetching이다. 하나를 완성하기 위해 많은 소스를 요청하는 것이다. 

<br>

# GraphQL의 특징
https://graphql-kr.github.io/

single request 로 원하는 정보만 받을 수 있다.

<br>

# GraphQL 서버 만들기

예시: 스타워즈 \
https://studio.apollographql.com/public/star-wars-swapi/variant/current/explorer

<br>

## 1. 아폴로 서버 사용
아폴로 서버를 사용하면 손쉽게 GraphQL을 사용할 수 있다. \
GraphQL 스키마를 작성하고, 데이터 소스를 연결하고, 데이터를 가져오는 방법을 작성하면 된다. \

https://www.apollographql.com/docs/apollo-server/

### 0. 설치
```bash
npm i apollo-server graphql
```

### 1. GraphQL 스키마 작성
```js
const typeDefs = gql`
      type User {
         id: ID!
         username: String!
         firstName: String
         lastName: String
         """ fullName = firstName + lastName"""
         fullName: String
      }
      type Tweet {
         id: ID!
         text: String!
         author: User!
      }
   type Query {
      allTweets: [Tweet!]!
      tweet(id: ID!): Tweet
   }
   type Mutation {
      postTweet(text: String!, userId: ID): Tweet
      deleteTweet(id: ID!): Boolean
   }
`;
```


### 2. 데이터 소스 연결
json 소스를 작성한다. \
추후  DB를 연결하면 된다.
```js
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
```

### 3. 데이터를 가져오는 방법 작성
```js 
const resolvers = {
   Query: {
      allTweets: () => tweets,
      tweet: (_, { id }) => tweets.find(tweet => tweet.id === id)
   },
   Mutation: {
      postTweet: (_, { text, userId }) => {
         const tweet = {
            id: String(tweets.length + 1),
            text,
            authorId: userId
         };
         tweets.push(tweet);
         return tweet;
      },
      deleteTweet: (_, { id }) => {
         const cleanedTweets = tweets.filter(tweet => tweet.id !== id);
         if (tweets.length > cleanedTweets.length) {
            tweets = cleanedTweets;
            return true;
         } else {
            return false;
         }
      }
   },
  ...
}
```

### 4. 서버 실행
server.js
```js
import { ApolloServer, gql } from "apollo-server";
...

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
   console.log(`🚀 Server ready at ${url}`);
}); 
```

package.json
```json
{
  "name": "tweetql",
  "version": "1.0.0",
  "description": "",
  "main": "server.js", --> 수정
  "scripts": {
    "dev": "nodemon server.js" --> 추가
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "apollo-server": "^3.12.0",
    "graphql": "^16.6.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  },
  "type": "module" --> 추가 // import 사용을 위해
}
```

```bash
npm install -g nodemon
npm run dev
```

### 5. REST API를 GraphQL 서버로 랩핑

```js
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
}
```

기존 REST API를 GraphQL 서버로 랩핑하면서 REST API의 장점을 그대로 가져올 수 있다. \
(성능저하 등은 확인을 해봐야 할 듯...)

영화 \
https://yts.mx/api/v2/list_movies.json
https://yts.mx/api/v2/movie_details.json?movie_id=52582

<br>

# GraphQL 강의

노마드코더 GraphQL 강의 \
https://nomadcoders.co/graphql-for-beginners/lectures/3703


생활코딩 GraphQL 강의 \
https://www.youtube.com/watch?v=c6qHnYa9pUk&t=2s

