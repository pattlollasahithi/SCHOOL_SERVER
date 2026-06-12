import Announcement from '../models/Announcement.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
export const getAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await Announcement.find().sort({ date: -1 });
  res.json(announcements);
});

// @desc    Create an announcement
// @route   POST /api/announcements
// @access  Private/Admin
export const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, message, date } = req.body;

  const announcement = await Announcement.create({
    title,
    message,
    date,
  });

  res.status(201).json(announcement);
});

// @desc    Update an announcement
// @route   PUT /api/announcements/:id
// @access  Private/Admin
export const updateAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);

  if (announcement) {
    announcement.title = req.body.title || announcement.title;
    announcement.message = req.body.message || announcement.message;
    announcement.date = req.body.date || announcement.date;

    const updatedAnnouncement = await announcement.save();
    res.json(updatedAnnouncement);
  } else {
    res.status(404).json({ message: 'Announcement not found' });
  }
});

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
export const deleteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);

  if (announcement) {
    await announcement.deleteOne();
    res.json({ message: 'Announcement removed' });
  } else {
    res.status(404).json({ message: 'Announcement not found' });
  }
});
