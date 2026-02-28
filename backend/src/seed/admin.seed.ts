import 'dotenv/config';
import { connect } from 'mongoose';
import * as bcrypt from 'bcrypt';

async function seedAdmin() {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    throw new Error('MONGO_URI not defined');
  }

  const connection = await connect(MONGO_URI);
  const adminCollection = connection.connection.collection('admins');

  const existingAdmin = await adminCollection.findOne({
    email: 'admin@gym.com',
  });

  if (existingAdmin) {
    console.log('✅ Admin already exists');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  await adminCollection.insertOne({
    email: 'admin@gym.com',
    password: hashedPassword,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log('🎉 Admin created successfully');
  process.exit(0);
}

void seedAdmin();
