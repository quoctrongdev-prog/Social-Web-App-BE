import express from 'express';
import userRoutes from './routes/user.js';
import postRoutes from './routes/posts.js'; 
import commentRoutes from './routes/comments.js';
import likeRoutes from './routes/like.js';
import authRoutes from './routes/auth.js';
import relationshipsRoutes from "./routes/relationships.js";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';

const app = express();
const PORT = process.env.PORT || 8800;

//middleware
app.use((req, res, next)=>{
  res.header("Access-Control-Allow-Credentials", true)
  next();
})
app.use(express.json());
//cors middleware to allow cross-origin requests
app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend URL
}));
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../my-project/public/upload')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

const upload = multer({ storage: storage })

app.post('/api/upload', upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename) 
})

//Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/like', likeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/relationships', relationshipsRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});