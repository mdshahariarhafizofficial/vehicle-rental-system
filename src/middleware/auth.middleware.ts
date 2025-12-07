import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RequestWithUser } from '../types';
import { logger } from '../utils/logger';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
try {
const authHeader = req.headers.authorization;

if (!authHeader || !authHeader.startsWith('Bearer ')) {
res.status(401).json({
success: false,
message: 'Authentication required'
});
return;
}

const token = authHeader.split(' ')[1];
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
res.status(500).json({
success: false,
message: 'Server configuration error'
});
return;
}

try {
const decoded = jwt.verify(token, jwtSecret) as any;
(req as RequestWithUser).user = {
id: decoded.id,
email: decoded.email,
role: decoded.role
};
next();
} catch (error) {
res.status(401).json({
success: false,
message: 'Invalid or expired token'
});
}
} catch (error) {
logger.error('Authentication error:', error);
res.status(500).json({
success: false,
message: 'Internal server error during authentication'
});
}
};

export const authorize = (roles: string[]) => {
return (req: Request, res: Response, next: NextFunction): void => {
const requestWithUser = req as RequestWithUser;

if (!requestWithUser.user) {
res.status(401).json({
success: false,
message: 'Authentication required'
});
return;
}

if (!roles.includes(requestWithUser.user.role)) {
res.status(403).json({
success: false,
message: 'Insufficient permissions'
});
return;
}

next();
};
};