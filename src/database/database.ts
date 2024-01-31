import pkg, { QueryResult } from 'pg';
import config from 'config';

const DATABASE_URL = config.get<string>('DATABASE_URL') || '';
const { Client } = pkg;

export async function executeCommand(commandText: string, params: Array<any>): Promise<QueryResult> {
  console.log('command, params', commandText, params);
  const client = new Client(DATABASE_URL);
  await client.connect();
  try {
    return await client.query(commandText, [...params]);
  } catch (err) {
    console.error("error executing query:", err);
    throw err;
  } finally {
    await client.end();
  }
}