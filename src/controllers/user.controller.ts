import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { RequestWithUser } from '../types';

export class UserController {
static async getAllUsers(req: Request, res: Response): Promise<void> {
try {
const users = await UserService.getAllUsers();

res.status(200).json({
success: true,
message: 'Users retrieved successfully',
data: users
});
} catch (error: any) {
res.status(500).json({
success: false,
message: 'Error retrieving users'
});
}
}

static async updateUser(req: Request, res: Response): Promise<void> {
try {
const userId = parseInt(req.params.userId);
const updateData = req.body;
const requestWithUser = req as RequestWithUser;
const currentUserId = requestWithUser.user?.id;
const currentUserRole = requestWithUser.user?.role;

const updatedUser = await UserService.updateUser(
userId,
updateData,
currentUserId,
currentUserRole
);

if (!updatedUser) {
res.status(404).json({
success: false,
message: 'User not found'
});
return;
}

res.status(200).json({
success: true,
message: 'User updated successfully',
data: updatedUser
});
} catch (error: any) {
if (error.message.includes('You can only')) {
res.status(403).json({
success: false,
message: error.message
});
return;
}
res.status(500).json({
success: false,
message: 'Error updating user'
});
}
}

static async deleteUser(req: Request, res: Response): Promise<void> {
try {
const userId = parseInt(req.params.userId);

const deleted = await UserService.deleteUser(userId);

if (!deleted) {
res.status(404).json({
success: false,
message: 'User not found'
});
return;
}

res.status(200).json({
success: true,
message: 'User deleted successfully'
});
} catch (error: any) {
if (error.message.includes('Cannot delete user with active bookings')) {
res.status(400).json({
success: false,
message: error.message
});
return;
}
res.status(500).json({
success: false,
message: 'Error deleting user'
});
}
}
}