import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { validateEmail, validatePhone } from '../utils/validation';

export class AuthController {
static async signup(req: Request, res: Response): Promise<void> {
try {
const { name, email, password, phone, role } = req.body;

if (!name || !email || !password || !phone) {
res.status(400).json({
success: false,
message: 'All fields are required'
});
return;
}

if (password.length < 6) {
res.status(400).json({
success: false,
message: 'Password must be at least 6 characters'
});
return;
}

if (!validateEmail(email)) {
res.status(400).json({
success: false,
message: 'Invalid email address'
});
return;
}

if (!validatePhone(phone)) {
res.status(400).json({
success: false,
message: 'Invalid phone number'
});
return;
}

const user = await AuthService.register({
name,
email,
password,
phone,
role: role || 'customer'
});

res.status(201).json({
success: true,
message: 'User registered successfully',
data: user
});
} catch (error: any) {
if (error.message === 'Email already registered') {
res.status(409).json({
success: false,
message: error.message
});
return;
}
res.status(500).json({
success: false,
message: 'Error during registration'
});
}
}

static async signin(req: Request, res: Response): Promise<void> {
try {
const { email, password } = req.body;

if (!email || !password) {
res.status(400).json({
success: false,
message: 'Email and password are required'
});
return;
}

const result = await AuthService.login(email, password);

res.status(200).json({
success: true,
message: 'Login successful',
data: result
});
} catch (error: any) {
if (error.message === 'Invalid credentials') {
res.status(401).json({
success: false,
message: error.message
});
return;
}
res.status(500).json({
success: false,
message: 'Error during login'
});
}
}
}