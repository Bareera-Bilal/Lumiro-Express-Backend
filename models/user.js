const mongoose = require("mongoose");




// USER SCHEMA

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  posts: [{ postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" } }],
  followers: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" } }],
  following: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" } }],

  profilePic: { type: String },
  bio: { type: String, default: "" },

  stories: [
    {
      storyUrl: { type: String, required: true },
      timeCreated: { type: Date, default: Date.now },
      expire: { type: Date, default: () => new Date(Date.now() + 86400000) } // 24h expiry
    }
  ],

  likesGiven: [{ postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" } }],

  comments: [
    {
      postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
      commentId: { type: mongoose.Schema.Types.ObjectId }
    }
  ],

  isReported: {
    reasonResult: { type: Boolean, default: false },
    reason: [{ reportText: { type: String } }],
    banned: { type: Boolean, default: false }
  }
}, { timestamps: true });

// END OF USER SCHEMA




// REPORT SCHEMA

const ReportSchema = new mongoose.Schema({
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  reportedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  reportText: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["pending", "reviewed", "resolved"],
    default: "pending"
  }
}, { timestamps: true });

// END OF REPORT SCHEMA




// Models
const User = mongoose.model("User", UserSchema);
const Report = mongoose.model("Report", ReportSchema);

module.exports = { User, Report };