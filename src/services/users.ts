import { executeCommand } from "../database/database";
import { IUser } from "../models";


export async function GetUserByEmail(email: string): Promise<IUser | null> {
  const commandText = 'SELECT id, email, password, role, cast(active as string) as active from public.users where email = $1::varchar';
  const params = [ email ];
  const result = await executeCommand(commandText, params);
  if (result.rowCount === 1) {
      return Promise.resolve(
          {
              id: parseInt(result.rows[0]['id']),
              email: result.rows[0]['email'],
              password: result.rows[0]['password'],
              role: result.rows[0]['role'],
              active: result.rows[0]['active'] == 'true'
          });
  }
  return null;
}

export async function GetUser(id: number): Promise<IUser | null> {
  const commandText = 'SELECT id, email, password, role, cast(active as string) as active from public.users where id = $1::int';
  const params = [ id ];
  const result = await executeCommand(commandText, params);
  if (result.rowCount === 1) {
      return Promise.resolve(
          {
              id: parseInt(result.rows[0]['id']),
              email: result.rows[0]['email'],
              password: result.rows[0]['password'],
              role: result.rows[0]['role'],
              active: result.rows[0]['active'] == 'true'
          });
  }
  return null;
}

export async function CreateUser(email: string, passwordHash: string): Promise<IUser | null> {
  const commandText = 'insert into users (email, password) values ($1::string, $2::string) RETURNING id, email, password, role;';
  const params = [ email, passwordHash ];
  const results = await executeCommand(commandText, params);
  if (results.rowCount === 1) {
    return {
      id: parseInt(results.rows[0]['id']),
      email: results.rows[0]['email'],
      password: results.rows[0]['password'],
      role: results.rows[0]['role']
    } as IUser
  }
  return null;
}

export async function GetUserRole(id: number): Promise<string> {
  const commandText = 'SELECT role FROM public.users where id = $1::int';
  const params = [ id ];
  const result = await executeCommand(commandText, params);
  if (result.rowCount === 1){
      return result.rows[0]['role'];
  }
  return '';
}

export async function GetUsers(): Promise<Array<IUser>> {
  const commandText = 'select id, email, role, cast(active as string) active from public.users order by role, email';
  const results = await executeCommand(commandText, []);
  return results.rows.map(r => {
      return {
          id: parseInt(r['id']),
          email: r['email'],
          password: '',
          role: r['role'],
          active: r['active'] == 'true'
      } as IUser
  })
}

export async function UpdateUser(userId: number, password: string, role: string, active: boolean) {
  const commandText = 'update public.users set password = $1::string, role = $2::string, active= $3::boolean where id = $4::int';
  const params = [ password, role, active, userId ];
  await executeCommand(commandText, params);
}