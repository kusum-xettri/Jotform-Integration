// import { PrismaClient } from '@prisma/client';
// import GraphQLJSON from 'graphql-type-json';

// const prisma = new PrismaClient();

// export const resolvers = {
//   JSON: GraphQLJSON,
//   Query: {
//     submissions: async () => await prisma.jotFormSubmission.findMany(),
//   },
//   Mutation: {
//     createSubmission: async (_, { formId, submissionId, data }) => {
//       return await prisma.jotFormSubmission.create({
//         data: {
//           formId,
//           submissionId,
//           data,
//         },
//       });
//     },
//   },
// };

import GraphQLJSON from 'graphql-type-json';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    submissions: async () => await prisma.jotFormSubmission.findMany(),
  },
  Mutation: {
    createSubmission: async (_, { formId, submissionId, data }) => {
      return await prisma.jotFormSubmission.create({
        data: {
          formId,
          submissionId,
          data,
        },
      });
    },
  },
};

export default resolvers;
