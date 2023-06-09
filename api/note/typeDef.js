import { gql } from "apollo-server";

const noteTypeDefs = gql`
  scalar Date

  type Note {
    _id: String
    title: String!
    description: String
    dueDate: Date
    importance: Int!
    completed: Boolean
  }

  input InputNote {
    _id: String
    title: String!
    description: String
    dueDate: Date
    importance: Int!
    completed: Boolean
  }

  type Query {
    notes(search: String, field: String, sort: Int, completed: Boolean): [Note!]
    note(id: String!): Note
  }

  type Mutation {
    addNote(input: InputNote): Note
    modifyNote(input: InputNote): Note
    deleteNote(id: String!): Note
  }
`;

export default noteTypeDefs;
