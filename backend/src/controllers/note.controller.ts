import { Request, Response } from 'express';
import Note from '../models/Note';

// @desc    Get all notes (with search & filtering)
// @route   GET /api/notes
// @access  Public
export const getNotes = async (req: Request, res: Response) => {
  try {
    const { keyword, subject, university, sort } = req.query;

    const query: any = { visibility: 'public' };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { tags: { $in: [new RegExp(keyword as string, 'i')] } }
      ];
    }

    if (subject) query.subject = { $regex: subject, $options: 'i' };
    if (university) query.university = { $regex: university, $options: 'i' };

    let sortObj: any = { createdAt: -1 };
    if (sort === 'popular') sortObj = { downloads: -1, likes: -1 };

    const notes = await Note.find(query)
      .populate('uploader', 'name avatar reputation')
      .sort(sortObj)
      .limit(50);

    // If uploader is deleted, set default name to EasyNotes
    const processedNotes = notes.map(note => {
      const noteObj: any = note.toObject();
      if (!noteObj.uploader) {
        noteObj.uploader = {
          name: 'EasyNotes',
          avatar: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
          reputation: 0
        };
      }
      return noteObj;
    });

    res.json(processedNotes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload a new note
// @route   POST /api/notes
// @access  Private
export const uploadNote = async (req: Request | any, res: Response) => {
  try {
    const { title, description, subject, tags, university, semester, courseCode, visibility } = req.body;
    
    let fileUrl = '';
    if (req.file) {
      fileUrl = req.file.path;
    } else {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const note = await Note.create({
      title,
      description,
      subject,
      fileUrl,
      thumbnailUrl: 'https://via.placeholder.com/300x400?text=PDF+Note', // Mock thumbnail
      uploader: req.user._id,
      tags: tags ? tags.split(',').map((t: string) => t.trim()) : [],
      university,
      semester,
      courseCode,
      visibility: visibility || 'public'
    });

    res.status(201).json(note);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single note by ID
// @route   GET /api/notes/:id
// @access  Public
export const getNoteById = async (req: Request | any, res: Response) => {
  try {
    const note = await Note.findById(req.params.id).populate('uploader', 'name avatar');
    if (note) {
      // Increment views only if viewer is not the uploader
      const isUploader = req.user && note.uploader && note.uploader._id.toString() === req.user._id.toString();

      if (!isUploader) {
        note.views = (note.views || 0) + 1;
        await note.save();
      }

      const noteObj: any = note.toObject();
      if (!noteObj.uploader) {
        noteObj.uploader = {
          name: 'EasyNotes',
          avatar: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
        };
      }
      res.json(noteObj);
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get user dashboard stats
// @route   GET /api/notes/stats
// @access  Private
export const getUserStats = async (req: Request | any, res: Response) => {
  try {
    const totalUploads = await Note.countDocuments({ uploader: req.user._id });
    const userNotes = await Note.find({ uploader: req.user._id });
    
    const totalDownloads = userNotes.reduce((acc, note) => acc + (note.downloads || 0), 0);
    const totalLikes = userNotes.reduce((acc, note) => acc + (note.likes || 0), 0);
    const totalViews = userNotes.reduce((acc, note) => acc + (note.views || 0), 0);
    
    const recentNotes = await Note.find({ uploader: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUploads,
      totalDownloads,
      totalLikes,
      totalViews,
      recentNotes
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update download count
// @route   PUT /api/notes/:id/download
// @access  Public
export const updateDownloadCount = async (req: Request, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);
    if (note) {
      note.downloads = (note.downloads || 0) + 1;
      await note.save();
      res.json({ downloads: note.downloads });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
