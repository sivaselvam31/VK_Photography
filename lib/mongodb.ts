import { MongoClient, ServerApiVersion } from "mongodb";

const uri = (process.env.MONGODB_URI as string)?.trim();

if (!uri) {
  throw new Error(
    'Invalid/Missing environment variable: "MONGODB_URI". Please add it to your .env.local file.'
  );
}

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable so the MongoClient is not
  // re-created on every hot-reload.
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new client for every module instance.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
