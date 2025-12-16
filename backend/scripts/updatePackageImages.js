import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27018/lyan-restaurant';

const packageImages = {
  '690b8f5cfdeeeaa71fcb3f0d': 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80', // private dining
  '690b8a89998b79ca240bede0': 'https://images.unsplash.com/photo-1519167758481-83f29da8c313?auto=format&fit=crop&w=800&q=80', // anniversary
  '690a0f7f7225dedc97c850f8': 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', // bridal
  '690a0f147225dedc97c850ec': 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80', // wedding
  '6909ee3eb4a393710e529994': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80'  // birthday
};

async function updatePackageImages() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));

    for (const [id, imageUrl] of Object.entries(packageImages)) {
      try {
        const result = await Package.updateOne(
          { _id: id },
          { $set: { image: imageUrl } }
        );

        if (result.matchedCount > 0) {
          console.log(`✅ Updated package ${id}`);
        } else {
          console.log(`⚠️  Package ${id} not found`);
        }
      } catch (error) {
        console.error(`❌ Failed to update package ${id}:`, error.message);
      }
    }

    console.log('\n✨ Package images updated successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

updatePackageImages();
