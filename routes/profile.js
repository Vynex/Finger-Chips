import express from 'express';
const router = express.Router({ mergeParams: true });

import { isLoggedIn, ownsResult } from '../middleware.js';
import catchAsync from '../utils/CatchAsync.js';
import { create, destroy, showData, renderProfile } from '../controllers/result.js';

router.route('/')
   .get(renderProfile)

router.route('/results')
   .get(showData)
   .post(isLoggedIn, catchAsync(create));

router.delete('/:rid', isLoggedIn, ownsResult, catchAsync(destroy));

export default router;