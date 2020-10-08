import * as genericPool from "generic-pool";
import { Client } from "pg";
import { createDb, migrate } from "postgres-migrations";

const [postgresHost, postgresPort] = (
  process.env.POSTGRES || "localhost:5432"
).split(":");

const pool = genericPool.createPool<Client>({
  create: async () => {
    while (true) {
      try {
        const client = new Client({
          host: postgresHost,
          port: postgresPort ? parseInt(postgresPort) : undefined,
          user: "postgres",
          password: "postgres",
          database: "postgres",
        });
        await client.connect();
        return client;
      } catch (error) {
        if (error.message.startsWith("connect ECONNREFUSED")) continue;
        console.log(error.message);
        throw error;
      }
    }
  },
  destroy: (client: Client) => client.end(),
});

export async function run<T>(f: (client: Client) => T): Promise<T> {
  const client = await pool.acquire();
  try {
    return await f(client);
  } finally {
    await pool.release(client);
  }
}

export async function initialize() {
  await run(async (client) => {
    await createDb("postgres", { client });
    await migrate({ client }, "./migrations");
  });
}
