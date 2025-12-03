// ======================= IMPORTS =======================

const express = require("express");
const connectDb = require("./config/connectDB");
const bodyParser = require("body-parser");
const cors = require("cors");
const isAuth = require("./middlewares/isAuthorised");
const multMid = require("./middlewares/multer");
const MultMid = require("./middlewares/multer");


const {
  registerHandler,
  loginHandler,
  fetchUserHandler,
  updateUserHandler,
  reportUser,
  toggleFollowUser,
  updateUserBio,
  uploadProfilePic,
} = require("./controllers/userController");

const {
  createPost,
  likePost,
  commentOnPost,
  reportPost,
  reportComment,
  editComment,
  replyOnComment,
  uploadStories,
} = require("./controllers/postControllers");

const app = express();
const port = 4000;

// ======================= DATABASE CONNECTION =======================

connectDb();

// ======================= MIDDLEWARES =======================

app.use(bodyParser.json());
app.use(cors()); // Enables CORS for all routes
app.use('/uploads', express.static('uploads')) // serve uploaded files


// ======================= ROUTES =======================

// ---------- Root ----------
app.get("/", (req, res) => {
  res.send("Hello from the server");
});

// ---------- User Authentication ----------
app.post("/user/register", registerHandler);
app.post("/user/login", loginHandler);
app.get("/user/verify", isAuth, fetchUserHandler);
app.get("/user/verify", isAuth, updateUserHandler);


// ---------- User Interaction ----------
app.post("/user/report/:targetId", isAuth, reportUser);
app.post("/user/friends/:targetId", isAuth, toggleFollowUser);

// ---------- User Profile ----------
app.put("/user/bio", isAuth, updateUserBio); // Update bio
app.put("/user/profilepic", isAuth, multMid, uploadProfilePic); // Update profile picture






// ---------- Post Management ----------
app.post("/post/create", isAuth, multMid, createPost); // Create post
app.post("/post/like/:postId", isAuth, likePost); // Like post
app.post("/post/report/:postId", isAuth, reportPost)


// ---------- Comment Management ----------
app.post("/post/comment/:postId", isAuth, commentOnPost)
app.post("/post/comment/:postId/report/:commentId", isAuth, reportComment)
app.put("/post/comment/:postId/edit/:commentId", isAuth, editComment)
app.post("/post/comment/:postId/reply/:commentId", isAuth, replyOnComment)

// ---------- Stories ----------
app.post("/post/upload", isAuth, MultMid, uploadStories); // Upload story

// ======================= SERVER LISTEN =======================

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});








