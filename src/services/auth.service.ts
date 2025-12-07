import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
import { User } from '../types';
import { logger } from '../utils/logger';

export class AuthService {
static async register(userData: {
name: string;
email: string;
password: string;
phone: string;
role?: 'admin' | 'customer';
}): Promise<Omit<User, 'password'>> {
try {
const existingUser = await UserModel.findByEmail(userData.email);
if (existingUser) {
throw new Error('Email already registered');
}

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

const role = userData.role || 'customer';

const user = await UserModel.create({
name: userData.name,
email: userData.email,
password: hashedPassword,
phone: userData.phone,
role: role
});

const { password, ...userWithoutPassword } = user;
return userWithoutPassword;
} catch (error: any) {
logger.error('Registration error:', error);
throw error;
}
}

static async login(email: string, password: string): Promise<{ token: string; user: Omit<User, 'password'> }> {
try {
const user = await UserModel.findByEmail(email);
if (!user) {
throw new Error('Invalid credentials');
}

const isValidPassword = await bcrypt.compare(password, user.password);
if (!isValidPassword) {
throw new Error('Invalid credentials');
}

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
throw new Error('JWT_SECRET is not configured');
}

const token = jwt.sign(
{
id: user.id,
email: user.email,
role: user.role
},
jwtSecret,
{ expiresIn: process.env.JWT_EXPIRE || '7d' }
);

const { password: _, ...userWithoutPassword } = user;

return {
token,
user: userWithoutPassword
};
} catch (error: any) {
logger.error('Login error:', error);
throw error;
}
}
}