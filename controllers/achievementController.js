import Achievement from '../models/Achievement.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
export const getAchievements = asyncHandler(async (req, res) => {
  const achievements = await Achievement.find().sort({ date: -1 });
  res.json(achievements);
});

// @desc    Create an achievement
// @route   POST /api/achievements
// @access  Private/Admin
export const createAchievement = asyncHandler(async (req, res) => {
  const { title, description, date, category } = req.body;
  let image = '';
  if (req.file) {
    const base64Str = req.file.buffer.toString('base64');
    image = `data:${req.file.mimetype};base64,${base64Str}`;
  }

  if (!image) {
    return res.status(400).json({ message: 'Please upload an image' });
  }

  const achievement = await Achievement.create({
    title,
    description,
    image,
    category,
    date,
  });

  res.status(201).json(achievement);
});

// @desc    Update an achievement
// @route   PUT /api/achievements/:id
// @access  Private/Admin
export const updateAchievement = asyncHandler(async (req, res) => {
  const achievement = await Achievement.findById(req.params.id);

  if (achievement) {
    achievement.title = req.body.title || achievement.title;
    achievement.description = req.body.description || achievement.description;
    achievement.date = req.body.date || achievement.date;
    if (req.file) {
      const base64Str = req.file.buffer.toString('base64');
      achievement.image = `data:${req.file.mimetype};base64,${base64Str}`;
    }

    const updatedAchievement = await achievement.save();
    res.json(updatedAchievement);
  } else {
    res.status(404).json({ message: 'Achievement not found' });
  }
});

// @desc    Delete an achievement
// @route   DELETE /api/achievements/:id
// @access  Private/Admin
export const deleteAchievement = asyncHandler(async (req, res) => {
  const achievement = await Achievement.findById(req.params.id);

  if (achievement) {
    await achievement.deleteOne();
    res.json({ message: 'Achievement removed' });
  } else {
    res.status(404).json({ message: 'Achievement not found' });
  }
});
