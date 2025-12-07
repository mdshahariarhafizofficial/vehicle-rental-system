import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (
error: Error,
req: Request,
res: Response,
next: NextFunction
): void => {
logger.error('Unhandled error:', error);

if (error.message.includes('duplicate key')) {
res.status(409).json({
success: false,
message: 'Resource already exists'
});
return;
}

if (error.message.includes('not found')) {
res.status(404).json({
success: false,
message: error.message
});
return;
}

if (error.message.includes('Cannot delete') ||
error.message.includes('You can only') ||
error.message.includes('Only admin') ||
error.message.includes('Invalid credentials')) {
res.status(400).json({
success: false,
message: error.message
});
return;
}

res.status(500).json({
success: false,
message: 'Internal server error'
});
};