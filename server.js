// import express from 'express';
// import next from 'next';
// import { ApolloServer } from 'apollo-server-express';
// import bodyParser from 'body-parser';
// import typeDefs from './graphql/schema.js';
// import resolvers from './graphql/resolvers.js';
// import { PrismaClient } from '@prisma/client';
// import multer from 'multer';

// const prisma = new PrismaClient();
// const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
// const handle = app.getRequestHandler();

// const startServer = async () => {
//   await app.prepare();
  
//   const server = express();
//   const upload = multer();
//   server.use(express.json());

//   // Webhook endpoint
//   server.post('/api/webhook', upload.none(), async (req, res) => {
//     console.log('Received Headers:', req.headers); // Log headers
//     console.log('Received Webhook Request Body:', req.body); // Log body
  
//     // Extract rawRequest and parse it
//     const rawRequest = req.body.rawRequest;
  
//     if (!rawRequest) {
//       console.error('Missing rawRequest field');
//       return res.status(400).send('Missing rawRequest field');
//     }
  
//     let parsedData;
//     try {
//       parsedData = JSON.parse(rawRequest);
//     } catch (error) {
//       console.error('Error parsing rawRequest:', error);
//       return res.status(400).send('Error parsing rawRequest');
//     }
  
//     const { slug, submitSource, buildDate, event_id, timeToSubmit, validatedNewRequiredFieldIDs, path, ...answers } = parsedData;
//     const { formID: formId, submissionID: submissionId } = req.body;
  
//     if (!formId || !submissionId || !answers) {
//       console.error('Missing required fields');
//       return res.status(400).send('Missing required fields');
//     }
  
//     try {
//       // Save data to the database
//       await prisma.jotFormSubmission.create({
//         data: {
//           formId,
//           submissionId,
//           data: answers,
//         },
//       });
//       res.status(200).send('Submission saved');
//     } catch (error) {
//       console.error('Error saving submission:', error);
//       res.status(500).send('Error saving submission');
//     }
//   });
  
//   app.get('/api/submissions', async (req, res) => {
//     try {
//       const submissions = await prisma.jotFormSubmission.findMany();
//       console.log("submissions",submissions)
//       res.json(submissions);
//     } catch (error) {
//       res.status(500).send('Error fetching submissions');
//     }
//   });

//   const apolloServer = new ApolloServer({ typeDefs, resolvers });
//   await apolloServer.start();
//   apolloServer.applyMiddleware({ app: server, path: '/api/graphql'});

//   // All other requests should be handled by Next.js
//   server.all('*', (req, res) => {
//     return handle(req, res);
//   });

//   server.listen(3000, (err) => {
//     if (err) throw err;
//     console.log('> Ready on http://localhost:3000');
//   });
// };

// startServer().catch(err => {
//   console.error('Error starting server:', err);
// });
import express from 'express';
import next from 'next';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './graphql/schema.js';
import resolvers from './graphql/resolvers.js';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import axios from 'axios';
import cors from 'cors';


const prisma = new PrismaClient();
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const startServer = async () => {
  await app.prepare();

  const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend origin
    methods: 'GET,POST',
  };
  
  
  const server = express();
  const upload = multer();
  server.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }));
  server.use(express.json());

  // Webhook endpoint
  server.post('/api/webhook', upload.none(), async (req, res) => {
    console.log('Received Headers:', req.headers); // Log headers
    console.log('Received Webhook Request Body:', req.body); // Log body
  
    // Extract rawRequest and parse it
    const rawRequest = req.body.rawRequest;
  
    if (!rawRequest) {
      console.error('Missing rawRequest field');
      return res.status(400).send('Missing rawRequest field');
    }
  
    let parsedData;
    try {
      parsedData = JSON.parse(rawRequest);
    } catch (error) {
      console.error('Error parsing rawRequest:', error);
      return res.status(400).send('Error parsing rawRequest');
    }
  
    const { slug, submitSource, buildDate, event_id, timeToSubmit, validatedNewRequiredFieldIDs, path, ...answers } = parsedData;
    const { formID: formId, submissionID: submissionId } = req.body;
  
    if (!formId || !submissionId || !answers) {
      console.error('Missing required fields');
      return res.status(400).send('Missing required fields');
    }
  
    try {
      // Save data to the database
      await prisma.jotFormSubmission.create({
        data: {
          formId,
          submissionId,
          data: answers,
        },
      });

      res.status(200).send('Submission saved');
    } catch (error) {
      console.error('Error saving submission:', error);
      res.status(500).send('Error saving submission');
    }
  });
  
  server.get('/api/submissions', async (req, res) => {
    try {
      const submissions = await prisma.jotFormSubmission.findMany();
      console.log("submissions", submissions);
      res.json(submissions);
    } catch (error) {
      res.status(500).send('Error fetching submissions');
    }
  });

  server.post('/api/sendToJotForm', async (req, res) => {
    console.log('Received request at /api/sendToJotForm'); // Debugging line

    const API_KEY = '594fe38e8d6b50ac94c48789f6114dad';
    const FORM_ID = '242049171984058';
    const JOTFORM_URL =  `https://api.jotform.com/form/${FORM_ID}/submissions?apiKey=${API_KEY}`

    const { formId, answers } = req.body;

    const submissionData = answers && Object.keys(answers).length > 0
      ? answers
      : { /* Default values for empty form */ };

    try {
      const response = await axios.post(JOTFORM_URL, submissionData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response from JotForm:', response.data);
      res.status(200).json(response.data);
    } catch (error) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        res.status(error.response.status).send(error.response.data);
      } else {
        console.error('Error message:', error.message);
        res.status(500).send('Error sending data to JotForm');
      }
    }
  });
  server.get('/test', (req, res) => {
    res.send('Test route is working!');
  });

  const apolloServer = new ApolloServer({ typeDefs, resolvers });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app: server, path: '/api/graphql' });

  // All other requests should be handled by Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {

    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
    console.log(`Server running at http://localhost:3000`);
  });
};

startServer().catch(err => {
  console.error('Error starting server:', err);
});
