import { createYoga } from "graphql-yoga";
import { createServer } from "http";
import { schema } from "./graphql/schema.js";
import { context } from "./graphql/context.js";

const yoga = createYoga({ schema, context });
const server = createServer(yoga);

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
