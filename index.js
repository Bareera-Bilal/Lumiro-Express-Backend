// ======================= IMPORTS =======================

const express = require("express");
const connectDb = require("./config/connectDB");
const bodyParser = require("body-parser");
const cors = require("cors");

const isAuth = require("./middlewares/isAuthorised");
const multMid = require("./middlewares/multer");

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
app.post("/stories/upload", isAuth, MultMid, uploadStories); // Upload story

// ======================= SERVER LISTEN =======================

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});





















































// // IMPORTING
// const express = require("express");
// const connectDb = require("./config/connectDB");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const isAuth = require("./middlewares/IsAuthorised");
// const multMid = require("./middlewares/multer");

// // // Controllers
// // const userController = require("./controllers/userController");
// // const postController = require("./controllers/postControllers");
// // const commentController = require("./controllers/commentControllers");
// // const reportController = require("./controllers/reportControllers");
// // const followController = require("./controllers/followControllers");
// // const storyController = require("./controllers/storyControllers");

// // Controllers
// const userController = require("./controllers/userController");
// const postController = require("./controllers/postController");

// const app = express();
// const port = 6000;

// // DATABASE
// connectDb();

// // MIDDLEWARES
// app.use(bodyParser.json());
// app.use(cors());

// // ROUTES
// app.get("/", (req, res) => res.send("hello from the server"));

// // // User
// // app.post("/user/register", userController.registerHandler);
// // app.post("/user/login", userController.loginhandler);
// // app.get("/user/verify", isAuth, userController.fetchUserhandler);
// // app.get("/user/bio", isAuth, userController.reportUser);
// // app.put("/user/update", isAuth, userController.updateUserHandler);
// // app.put("/user/bio", isAuth, userController.updateUserBio);
// // app.post("/user/profile-pic", isAuth, multMid, userController.uploadProfilePic);

// // // Follow/Unfollow
// // app.post("/user/follow/:id", isAuth, userController.toggleFollowUser);
// // app.post("/user/unfollow/:id", isAuth, followController.unfollowUser);
// // User
// app.post("/user/register", userController.registerHandler);
// app.post("/user/login", userController.loginhandler);
// app.get("/user/verify", isAuth, userController.fetchUserhandler);

// // Report user (should be POST, not GET)
// app.post("/user/report", isAuth, userController.reportUser);

// // Update bio
// app.put("/user/bio", isAuth, userController.updateUserBio);

// // Upload profile picture
// app.post("/user/profile-pic", isAuth, multMid, userController.uploadProfilePic);

// // Follow/Unfollow (toggle in one handler)
// app.post("/user/follow/:id", isAuth, userController.toggleFollowUser);
// app.post("/user/unfollow/:id", isAuth, userController.toggleFollowUser);
// ``












// // Posts
// app.post("/post/create", isAuth, multMid, postController.createPost);
// app.get("/post/like/:id", isAuth, postController.likePost);
// app.post("/post/comment", isAuth, commentController.commentOnPost);
// app.post("/post/reply-comment", isAuth, commentController.replyOnComment);

// // Stories
// app.post("/story/upload", isAuth, multMid, storyController.uploadStory);
// app.post("/story/upload-multiple", isAuth, multMid.array("stories", 10), storyController.uploadMultipleStories);

// // Reporting
// app.post("/report/user/:id", isAuth, reportController.reportUser);
// app.post("/report/post/:id", isAuth, reportController.reportPost);
// app.post("/report/comment/:id", isAuth, reportController.reportComment);

// // SERVER
// app.listen(port, () => {
//     console.log("Server listening on port " + port);
// });
