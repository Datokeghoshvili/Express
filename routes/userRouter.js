import express from 'express';
const userRouter = express.Router();
import
{
  getUsers,
  createUser,
  editUser,
  deleteUser
} from '../controllers/userContollers.js';

userRouter.route('/').get(getUsers).post(createUser);
userRouter.route('/:id').patch(editUser).delete(deleteUser);

export default userRouter;