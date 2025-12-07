import { Request, Response, NextFunction } from 'express';

export const validateRequestBody = (requiredFields: string[]) => {
return (req: Request, res: Response, next: NextFunction): void => {
const missingFields: string[] = [];

requiredFields.forEach(field => {
if (!req.body[field]) {
missingFields.push(field);
}
});

if (missingFields.length > 0) {
res.status(400).json({
success: false,
message: `Missing required fields: ${missingFields.join(', ')}`
});
return;
}

next();
};
};

export const validateEmail = (email: string): boolean => {
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
const phoneRegex = /^[0-9]{10,15}$/;
return phoneRegex.test(phone);
};