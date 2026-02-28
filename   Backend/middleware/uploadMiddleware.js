import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Auto-create uploads folder if it doesn't exist
if (!fs.existsSync('uploads')) {              // ← add this
  fs.mkdirSync('uploads', { recursive: true }); // ← add this
}                                             // ← add this

// ─── Storage Configuration ────────────────────────────────────────────────────
// diskStorage: Saves files to disk (in the /uploads folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save uploaded files to the uploads/ directory
  },
  filename: (req, file, cb) => {
    // Create unique filename: fieldname-timestamp.extension
    // e.g., image-1703001234567.jpg
    const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});


// ─── File Filter ──────────────────────────────────────────────────────────────
// Only accept image files (jpg, jpeg, png, webp)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);  // Accept file
  } else {
    cb(new Error('Only image files are allowed (jpg, jpeg, png, webp)'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB per file
});

export default upload;