import Notice from '../models/Notice.js';

// @desc    Get all notices
// @route   GET /api/notices
// @access  Public
export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a notice
// @route   POST /api/notices
// @access  Private/Admin
export const createNotice = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    let file = req.file ? req.file.path : '';

    if (file && !file.startsWith('http')) {
        file = `${req.protocol}://${req.get('host')}/${file.replace(/\\/g, '/')}`;
    }

    const notice = await Notice.create({
      title,
      description,
      file,
      date,
    });

    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a notice
// @route   PUT /api/notices/:id
// @access  Private/Admin
export const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (notice) {
      notice.title = req.body.title || notice.title;
      notice.description = req.body.description || notice.description;
      notice.date = req.body.date || notice.date;
      if (req.file) {
        let filePath = req.file.path;
        if (!filePath.startsWith('http')) {
            filePath = `${req.protocol}://${req.get('host')}/${filePath.replace(/\\/g, '/')}`;
        }
        notice.file = filePath;
      }

      const updatedNotice = await notice.save();
      res.json(updatedNotice);
    } else {
      res.status(404).json({ message: 'Notice not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a notice
// @route   DELETE /api/notices/:id
// @access  Private/Admin
export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (notice) {
      await notice.deleteOne();
      res.json({ message: 'Notice removed' });
    } else {
      res.status(404).json({ message: 'Notice not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
