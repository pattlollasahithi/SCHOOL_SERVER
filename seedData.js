import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Achievement from './models/Achievement.js';
import Announcement from './models/Announcement.js';
import Notice from './models/Notice.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding data...');

    // Clear existing data (optional, but good for a fresh start with defaults)
    await Achievement.deleteMany({});
    await Announcement.deleteMany({});
    await Notice.deleteMany({});

    // Seed Achievements
    const achievements = [
      {
        title: '100% Board Results',
        description: 'Consistent excellence in SSC board exams for the last 10 years.',
        image: '/achievements/board_toppers.png',
        date: new Date('2024-03-15')
      },
      {
        title: 'Sports Champions',
        description: 'Winners in Athletics, Kickboxing, and various regional sports.',
        image: 'https://res.cloudinary.com/ddsuglolg/image/upload/v1777310493/Screenshot_2026-04-27_225027_qhd9vn.png',
        date: new Date('2024-04-10')
      }
    ];
    await Achievement.insertMany(achievements);
    console.log('✅ Default Achievements seeded');

    // Seed Announcements
    const announcements = [
      {
        title: 'Annual Sports Meet Registration Open',
        message: 'All students are hereby informed that the Annual Sports Meet will be held next month. Please register with your respective house captains.',
        date: new Date('2026-04-25')
      },
      {
        title: 'Science Exhibition – Submit Projects',
        message: 'The inter-school science exhibition is open for project submissions. Students from Grades 8–10 are encouraged to participate.',
        date: new Date('2026-04-20')
      },
      {
        title: 'Parent-Teacher Meeting Scheduled',
        message: 'The quarterly Parent-Teacher Meeting is scheduled for the last Saturday of April. Attendance is strongly encouraged.',
        date: new Date('2026-04-15')
      }
    ];
    await Announcement.insertMany(announcements);
    console.log('✅ Default Announcements seeded');

    // Seed Notices (Example)
    const notices = [
      {
        title: 'Summer Vacation Schedule 2026',
        description: 'Detailed schedule for the upcoming summer holidays and reopening dates.',
        date: new Date('2026-04-27')
      }
    ];
    await Notice.insertMany(notices);
    console.log('✅ Default Notices seeded');

    console.log('All default data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
