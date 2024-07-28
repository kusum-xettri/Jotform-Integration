// import { ApolloClient, InMemoryCache } from '@apollo/client';

// const client = new ApolloClient({
//   uri: 'https://4baa-2400-1a00-b040-961c-7df5-1d80-5869-e574.ngrok-free.app/api/graphql',
//   cache: new InMemoryCache(),
// });

// export default client;

import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:3000/api/graphql',
  cache: new InMemoryCache(),
});

export default client;
