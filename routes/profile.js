import express from 'express';
const router = express.Router();

import { isLoggedIn, ownsResult } from '../middleware.js';
import catchAsync from '../utils/CatchAsync.js';
import { create, destroy, showData, renderProfile, renderHistory } from '../controllers/profile.js';

router.route('/')
   .get(renderProfile);

router.route('/history')
   .get(renderHistory);
   
router.route('/results')
   .get(showData)
   .post(isLoggedIn, catchAsync(create));

router.delete('/results/:rid', isLoggedIn, ownsResult, catchAsync(destroy));

export default router;