import { Router } from 'express';
import validateCreateProject from 'src/http/middlewares/requestValidations/createProject';
import validateProjectEdit from 'src/http/middlewares/requestValidations/editProject';
import wrapAsync from 'src/http/wrapAsync';
import { createProject, editProject } from './controller';
import verifyToken from 'src/http/middlewares/auth/verifyToken';

const projectRouter = Router();

projectRouter.post('/',
  verifyToken,
  validateCreateProject,
  wrapAsync(createProject));

projectRouter.put('/:projectId',
  verifyToken,
  validateProjectEdit,
  wrapAsync(editProject));

export default projectRouter;
