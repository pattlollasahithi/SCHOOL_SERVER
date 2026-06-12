import Notice from '../models/Notice.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Get all notices
// @route   GET /api/notices
// @access  Public
export const getNotices = asyncHandler(async (req, res) => {
  const notices = await Notice.find().sort({ date: -1 });
  res.json(notices);
});

// @desc    Create a notice
// @route   POST /api/notices
// @access  Private/Admin
export const createNotice = asyncHandler(async (req, res) => {
  const { title, description, date } = req.body;
  let file = '';
  if (req.file) {
    const base64Str = req.file.buffer.toString('base64');
    file = `data:${req.file.mimetype};base64,${base64Str}`;
  }

  const notice = await Notice.create({
    title,
    description,
    file,
    date,
  });

  res.status(201).json(notice);
});

// @desc    Update a notice
// @route   PUT /api/notices/:id
// @access  Private/Admin
export const updateNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);

  if (notice) {
    notice.title = req.body.title || notice.title;
    notice.description = req.body.description || notice.description;
    notice.date = req.body.date || notice.date;
    if (req.file) {
      const base64Str = req.file.buffer.toString('base64');
      notice.file = `data:${req.file.mimetype};base64,${base64Str}`;
    }

    const updatedNotice = await notice.save();
    res.json(updatedNotice);
  } else {
    res.status(404).json({ message: 'Notice not found' });
  }
});

// @desc    Delete a notice
// @route   DELETE /api/notices/:id
// @access  Private/Admin
export const deleteNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);

  if (notice) {
    await notice.deleteOne();
    res.json({ message: 'Notice removed' });
  } else {
    res.status(404).json({ message: 'Notice not found' });
  }
});
