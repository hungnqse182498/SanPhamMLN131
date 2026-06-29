import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Kích hoạt dotenv: đọc env gốc trước, rồi env riêng của main-repo nếu có
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/puzzle_game';
const PORT = process.env.PORT || 5000;

// Kết nối MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('🚀 Kết nối MongoDB thành công!'))
  .catch(err => console.error('💥 Lỗi kết nối MongoDB:', err));

// Định nghĩa Schema Bảng xếp hạng
const leaderboardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, required: true, default: 0 },
  level: { type: Number, required: true, default: 1 }
}, { versionKey: false });

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema, 'leaderboards');

// ─── API ROUTES ──────────────────────────────────────────────────────────────

// [GET] Lấy danh sách xếp hạng
app.get('/api/leaderboard', async (req, res) => {
  try {
    const list = await Leaderboard.find().sort({ score: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// [POST] Đồng bộ điểm khi người chơi thắng màn
app.post('/api/leaderboard/save-game', async (req, res) => {
  const { name, score, level } = req.body;
  if (!name) return res.status(400).json({ message: "Thiếu tên người chơi" });

  try {
    let player = await Leaderboard.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } 
    });

    if (player) {
      if (score > player.score) player.score = score;
      if (level > player.level) player.level = level;
      await player.save();
    } else {
      player = new Leaderboard({ name: name.trim(), score, level });
      await player.save();
    }

    const updatedList = await Leaderboard.find().sort({ score: -1 });
    res.json(updatedList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`💻 Server API đang chạy mượt mà tại http://localhost:${PORT}`);
});
