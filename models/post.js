const mongoose = require("mongoose");




// POST SCHEMA

exports.postSchema = new mongoose.Schema({
  postPicUrl: { type: String },
  postCaption: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  likes: [
    { userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" } }
  ],

  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: { type: String },
      isReported: { type: Boolean, default: false },
      isEdited: { type: Boolean, default: false },
      replies: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          text: { type: String },
          isReported: { type: Boolean, default: false },
          isEdited: { type: Boolean, default: false },
        }
      ]
    }
  ],

  shareCount: { type: Number, default: 0 },
}, { timestamps: true });

// END OF POST SCHEMA




// COMMENT SCHEMA

exports.commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },

  replies: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],

  reports: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String },
    reportedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// END OF COMMENT SCHEMA




// REPORT SCHEMA

exports.reportSchema = new mongoose.Schema({
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reportedUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reportText: { type: String, required: true },
}, { timestamps: true });

// END OF REPORT SCHEMA





// STORY SCHEMA

exports.storySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mediaUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => Date.now() + 24 * 60 * 60 * 1000 } // 24h expiry
});

// END OF STORY SCHEMA

// CREATE MODELS
const Post = mongoose.model("Post", exports.postSchema);
const Comment = mongoose.model("Comment", exports.commentSchema);
const PostReport = mongoose.model("PostReport", exports.reportSchema);
const Story = mongoose.model("Story", exports.storySchema);

// EXPORT MODELS
module.exports = { Post, Comment, PostReport, Story };

