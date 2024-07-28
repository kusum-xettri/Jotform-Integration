// import { gql } from 'apollo-server-micro';

// export const typeDefs = gql`
//   scalar JSON

//   type JotFormSubmission {
//     id: Int!
//     formId: String!
//     submissionId: String!
//     data: JSON!
//   }

//   type Query {
//     submissions: [JotFormSubmission!]!
//   }

//   type Mutation {
//     createSubmission(formId: String!, submissionId: String!, data: JSON!): JotFormSubmission!
//   }
// `;

import { gql } from 'apollo-server-express';

const typeDefs = gql`
  scalar JSON

  type Submission {
    id: ID!
    formId: String!
    submissionId: String!
    data: JSON!
  }

  type Query {
    submissions: [Submission!]
  }

  type Mutation {
    createSubmission(formId: String!, submissionId: String!, data: JSON!): Submission!
  }
`;

export default typeDefs;


