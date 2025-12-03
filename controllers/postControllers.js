const { uploadToCloudinary } = require("../config/cloudinary")
const mongoose = require("mongoose");
const { Post } = require("../models/post");
const { User } = require("../models/user");





// CREATE POST

exports.createPost = async (req, res) => {
  try {
    const { postCaption } = req.body;
    const userId = req.user.userId;

    const post = await Post.create({
      postPicUrl: req.file?.path || null,
      postCaption,
      userId
    });

    await User.findByIdAndUpdate(userId, {
      $push: { posts: { postId: post._id } }
    });

    res.json({ success: true, post });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE POST ENDED





// LIKE POST WITH ENHANCEMENT OF THE LOGIC IN WHICH POSTID IS ADDED TO LIKESGIVEN ARRAY OF USER

// LIKE POST

exports.likePost = async (req, res) => {
    try {
        const { postId } = req.query;
        const { userId } = req; 

        // Find post
        let post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "POST NOT FOUND" });
        }

        // Find user
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "USER NOT FOUND" });
        }

        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {

            // Unlike
            const findIndex = post.likes.indexOf(userId);
            post.likes.splice(findIndex, 1);

            // Remove postId from user's likesGiven
            const userIndex = user.likesGiven.indexOf(postId);
            if (userIndex !== -1) {
                user.likesGiven.splice(userIndex, 1);
            }

            await post.save();
            await user.save();

            return res.json({ message: "POST UNLIKED SUCCESSFULLY" });
        } else {

            // Like
            post.likes.push(userId);

            // Add postId to user's likesGiven
            if (!user.likesGiven.includes(postId)) {
                user.likesGiven.push(postId);
            }

            await post.save();
            await user.save();

            return res.json({ message: "POST LIKED SUCCESSFULLY" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};

// END OF LIKE POST





// REPLY THE COMMENT

  exports.replyOnComment = async (req, res) => {
  try {
    const { postId, commentId, text } = req.body;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const reply = {
      _id: new mongoose.Types.ObjectId(),
      userId,
      text
    };

    comment.replies.push(reply);
    await post.save();

    res.json({ success: true, reply });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// END OF REPLY THE POST





// COMMENT ON POST

exports.commentOnPost = async (req, res) => {
    try {
        const { postId } = req.query;
        const { userId } = req.user; 
        const { text } = req.body;

        // Find post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "POST NOT FOUND" });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "USER NOT FOUND" });
        }

        // Create comment object
        const commentOBJ = {
            text,
            userId,
        };

        // Push comment into post
        post.comments.push(commentOBJ);

        // Get the newly created commentId 
        const newComment = post.comments[post.comments.length - 1];
        const commentId = newComment._id;

        // Add to user's commentsGiven array
        user.commentsGiven.push({
            postId,
            commentId,
        });

        // Save both
        await post.save();
        await user.save();

        return res.json({ message: "COMMENTED SUCCESSFULLY", commentId });

    } 

    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};

// END OF COMMENT ON POST





// REPORT THE COMMENT 

exports.reportComment = async (req, res) => {

    try {

        const { postId, commentId } = req.query
        const { userId } = req.user
        const { text } = req.body

        let post = await Post.findById(postId)
        if (!post) return res.status(404).json({ message: "POST NOT FOUND" })

        const comment = post.comment.id(commentId);
        if (!comment) return res.status(404).json({ message: "COMMENT NOT FOUND" })

        comment.reports.push({
            user: userId,
            text: text,
            reportedAt: new Date()
        });

        await post.save();

        return res.json({ message: "COMMENT REPORTED SUCCESSFULLY!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};

// END OF REPORT THE COMMENT





// EDIT THE COMMENT

exports.editComment = async (req, res) => {

    try {

        const { postId, commentId } = req.query
        const { userId } = req.user
        const { text } = req.body

        let post = await Post.findById(postId)
        if (!post) return res.status(404).json({ message: "POST NOT FOUND" })

        const comment = post.comment.id(commentId);
        if (!comment) return res.status(404).json({ message: "COMMENT NOT FOUND" })

        if (comment.userId !== userId) {
            return res.status(403).json({ message: "NOT AUTHORIZED TO EDIT THE COMMENT" });
        }


        comment.text = text;

        await post.save();

        return res.json({ message: "COMMENT UPDATED SUCCESSFULLY!" });


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "SERVER ERROR" });

    }

}

// END OF EDIT THE COMMENT





// REPLY TO A COMMENT

exports.replyOnComment = async (req, res) => {
  try {
    const { commentId } = req.params;   // comment being replied to
    const { text } = req.body;          // reply text
    const { userId } = req.user;        // logged-in user

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "COMMENT NOT FOUND" });
    }

    // Add reply to the comment
    comment.replies.push({ user: userId, text });
    await comment.save();

    // Save this reply in user's comments array
    const user = await User.findById(userId);
    if (user) {
      user.comments.push(comment._id); 
      await user.save();
    }

    res.json({ message: "REPLY ADDED SUCCESSFULLY", comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "SERVER ERROR" });
  }
};

//END OF REPLY TO COMMENT





// UPLOAD SINGLE OR MULTIPLE STORIES

exports.uploadStories = async (req, res) => {
  try {
    const { userId } = req.user;

    // Handle both single and multiple uploads
    const files = req.files && req.files.length > 0 
      ? req.files 
      : req.file 
        ? [req.file] 
        : [];

    if (files.length === 0) {
      return res.status(400).json({ message: "NO FILE UPLOADED" });
    }

    const stories = files.map(file => ({
      user: userId,
      mediaUrl: file.path
    }));

    // Insert stories into DB
    await Story.insertMany(stories);

    res.json({ 
      message: "STORY UPLOADED SUCCESSFULLY", 
      count: stories.length, 
      stories 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "SERVER ERROR" });
  }
};

// END OF UPLOAD SINGLE OR MULTIPLE STORIES


