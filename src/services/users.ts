import { IUser } from "../models";
import { User } from "../mongodb/models";


export async function GetUserByEmail(email: string): Promise<IUser | null> {
  const user = await User.findOne({email: email });
  if (user != null){
    return {
      id: user.id,
      email: user.email,
      password: user.password,
      role: user.role,
      active: user.active
    } as IUser;
  }

  return null;
}

export async function GetUser(id: string): Promise<IUser | null> {
  const user = await User.findById(id);
  if (user != null) {
    return {
      id: user.id,
      email: user.email,
      password: user.password,
      active: user.active,
      role: user.role
    } as IUser;
  }
  return null;
}

export async function CreateUser(email: string, passwordHash: string): Promise<IUser | null> {
  let user = await User.create({
    email: email,
    password: passwordHash,
    active: true,
    role: 'user'
  });

  await user.save();

  return {
    id: user.id,
    email: email,
    password: passwordHash,
    active: true,
    role: user.role
  } as IUser;
}

export async function GetUserRole(id: string): Promise<string> {
  const user = await User.findById(id);
  return user?.role;
}

export async function GetUsers(): Promise<Array<IUser>> {
  const users = await User.find({}).exec();
  const results = users.map(u => {
    return {
      id: u.id,
      email: u.email,
      active: u.active,
      password: '',
      role: u.role
    } as IUser;
  });
  return results;
}

export async function UpdateUser(userId: string, password: string, role: string, active: boolean) {
  await User.findByIdAndUpdate(userId, {
    password: password,
    role: role,
    active: active
  });
}