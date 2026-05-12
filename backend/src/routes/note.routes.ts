import express from 'express';
import { getNotes, uploadNote, getNoteById, getUserStats, updateDownloadCount } from '../controllers/note.controller';
import { protect, optionalProtect } from '../middlewares/auth.middleware';
import upload from '../middlewares/upload.middleware';

const router = express.Router();

router.get('/stats', protect, getUserStats);
router.put('/:id/download', updateDownloadCount);

router.route('/')
  .get(getNotes)
  .post(protect, upload.single('file'), uploadNote);

router.route('/:id')
  .get(optionalProtect, getNoteById);

export default router;
