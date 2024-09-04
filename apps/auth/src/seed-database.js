// seed-database.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
mongoose.connect(process.env.MONGO_URI);

const UserSchema = new mongoose.Schema(
  {
    fullname: String,
    email: String,
    password: String,
    role: String,
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function seedDatabase() {
  try {
    const users = [
      {
        fullname: 'admin',
        email: 'admin@gmail.com',
        password: '123456',
        role: 'admin',
      },
      {
        fullname: 'Linh Lê',
        email: 'linhle@gmail.com',
        password: '123456',
        role: 'user',
      },
    ];

    for (const user of users) {
      const hashedPassword = await hashPassword(user.password);
      await User.create({
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        password: hashedPassword,
      });
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
