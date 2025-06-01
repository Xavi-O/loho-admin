// migrations/userModelMigration.ts
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import { User } from '@/models/User'; // Adjust the path if necessary

interface MigrationResult {
  success: boolean;
  totalUsers: number;
  migratedUsers: number;
  errors: string[];
  skippedUsers: number;
}

export async function migrateUserModel(): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: false,
    totalUsers: 0,
    migratedUsers: 0,
    errors: [],
    skippedUsers: 0,
  };

  try {
    console.log('🚀 Starting User Model Migration...');

    await connectDB();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not established');

    const users = await db.collection('users').find({}).toArray();
    result.totalUsers = users.length;

    console.log(`📊 Found ${users.length} users to migrate`);

    if (users.length === 0) {
      console.log('✅ No users found. Migration completed.');
      result.success = true;
      return result;
    }

    const batchSize = 100;
    const batches = Math.ceil(users.length / batchSize);

    for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
      const startIndex = batchIndex * batchSize;
      const endIndex = Math.min(startIndex + batchSize, users.length);
      const batch = users.slice(startIndex, endIndex);

      console.log(`📦 Processing batch ${batchIndex + 1}/${batches} (${batch.length} users)`);

      const bulkOperations = [];

      for (const user of batch) {
        try {
          const updateDoc: any = { $set: {} };
          let hasUpdates = false;

          if (user.isVerified === undefined) {
            updateDoc.$set.isVerified = false;
            hasUpdates = true;
          }

          if (user.updatedAt === undefined) {
            updateDoc.$set.updatedAt = user.createdAt || new Date();
            hasUpdates = true;
          }

          if (user.loginAttempts === undefined) {
            updateDoc.$set.loginAttempts = 0;
            hasUpdates = true;
          }

          if (!user.settings) {
            updateDoc.$set.settings = {
              theme: 'system',
              language: 'en',
              timezone: 'UTC',
              emailNotifications: {
                marketing: true,
                security: true,
                updates: true,
                newsletter: false,
              },
              privacy: {
                profileVisibility: 'public',
                showEmail: false,
                showLastSeen: true,
                allowSearchByEmail: true,
              },
              preferences: {
                dateFormat: 'MM/DD/YYYY',
                timeFormat: '12h',
                currency: 'USD',
                pageSize: 25,
              },
              twoFactorAuth: {
                enabled: false,
                method: null,
                backupCodes: [],
              },
            };
            hasUpdates = true;
          }

          if (!Array.isArray(user.securityQuestions)) {
            updateDoc.$set.securityQuestions = [];
            hasUpdates = true;
          }

          if (!['user', 'admin', 'superadmin'].includes(user.role)) {
            updateDoc.$set.role = 'user';
            hasUpdates = true;
          }

          if (hasUpdates) {
            bulkOperations.push({
              updateOne: {
                filter: { _id: user._id },
                update: updateDoc,
              },
            });
          } else {
            result.skippedUsers++;
          }
        } catch (error) {
          console.error(`❌ Error processing user ${user._id}:`, error);
          result.errors.push(`User ${user._id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      if (bulkOperations.length > 0) {
        try {
          const bulkResult = await db.collection('users').bulkWrite(bulkOperations);
          result.migratedUsers += bulkResult.modifiedCount;
          console.log(`✅ Batch ${batchIndex + 1} completed: ${bulkResult.modifiedCount} users updated`);
        } catch (error) {
          console.error(`❌ Bulk operation error in batch ${batchIndex + 1}:`, error);
          result.errors.push(`Batch ${batchIndex + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      } else {
        console.log(`⏭️ Batch ${batchIndex + 1} skipped: no updates needed`);
      }
    }

    console.log('🔍 Creating indexes...');
    try {
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      await db.collection('users').createIndex({ passwordResetToken: 1 });
      await db.collection('users').createIndex({ emailVerificationToken: 1 });
      await db.collection('users').createIndex({ isActive: 1, isApproved: 1 });
      await db.collection('users').createIndex({ role: 1 });
      await db.collection('users').createIndex({ createdAt: -1 });
      console.log('✅ Indexes created');
    } catch (error) {
      console.warn('⚠️ Index creation warning:', error);
    }

    result.success = result.errors.length === 0;
  } catch (error) {
    console.error('💥 Fatal migration error:', error);
    result.errors.push(`Fatal error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return result;
}

export async function rollbackUserMigration(): Promise<void> {
  console.log('🔄 Rolling back user migration...');

  await connectDB();
  const db = mongoose.connection.db;
  if (!db) throw new Error('MongoDB not connected');

  try {
    const res = await db.collection('users').updateMany({}, {
      $unset: {
        isVerified: '',
        updatedAt: '',
        loginAttempts: '',
        lockUntil: '',
        emailVerificationToken: '',
        emailVerificationExpiry: '',
        settings: '',
        lastLogin: '',
      }
    });
    console.log(`✅ Rollback completed: ${res.modifiedCount} users reverted`);
  } catch (error) {
    console.error('❌ Rollback error:', error);
    throw error;
  }
}

if (require.main === module) {
  const command = process.argv[2];
  connectDB().then(async () => {
    console.log('📡 Connected to MongoDB');

    if (command === 'rollback') {
      await rollbackUserMigration();
    } else {
      await migrateUserModel();
    }

    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
    process.exit(0);
  }).catch(err => {
    console.error('💥 DB connection error:', err);
    process.exit(1);
  });
}
