import { UserModel } from '../models/user.model';
import { User } from '../types';
import bcrypt from 'bcrypt';

export class UserService {
static async getAllUsers(): Promise<Omit<User, 'password'>[]> {
const users = await UserModel.findAll();
return users.map(user => {
const { password, ...userWithoutPassword } = user;
return userWithoutPassword;
});
}

static async updateUser(
id: number,
updateData: Partial<User & { newPassword?: string }>,
currentUserId?: number,
currentUserRole?: string
): Promise<Omit<User, 'password'> | null> {
if (currentUserRole !== 'admin' && currentUserId !== id) {
throw new Error('You can only update your own profile');
}

if (updateData.role && currentUserRole !== 'admin') {
delete updateData.role;
}

if (updateData.newPassword) {
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
updateData.password = await bcrypt.hash(updateData.newPassword, saltRounds);
delete updateData.newPassword;
}

const updatedUser = await UserModel.update(id, updateData);
if (updatedUser) {
const { password, ...userWithoutPassword } = updatedUser;
return userWithoutPassword;
}
return null;
}

static async deleteUser(id: number): Promise<boolean> {
return await UserModel.delete(id);
}
}