import { gql } from 'apollo-server';

const typeDefs = gql`

  type Comment {
    _id: ID
    text: String
    user: User
    post: Post
    userId: ID
    postId: ID
  }

  type Query {
    comments(skip: Int, limit: Int, text: String): [Comment]
  }


`

export default typeDefs;