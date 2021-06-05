import { ApolloServer, gql } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';

export interface Query {
  contents(): Content[];
}

interface Content {
  id: string;
  title?: string;
  year?: string;
}

const contents: Content[] = [
  { id: '1', title: 'Batman', year: '1989' },
  { id: '2', title: 'Batman Returns', year: '1992' },
  { id: '3', title: 'Batman: The Animated Series', year: '1992' },
];

const typeDefs = gql`
  type Query {
    contents: [Content]
  }
  type Content @key(fields: "id") {
    id: ID!
    title: String
    year: String
  }
`;

const resolvers = {
  Query: {
    contents() {
      return contents;
    },
  },
  Content: {
    __resolveReference(content: Content) {
      return contents.find(c => c.id === content.id);
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server.listen(4002).then(({ url }) => {
  console.log(`🚀 Content service ready at ${url}`);
});
