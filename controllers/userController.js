const e = require("express")
const { User } = require("../models/user")
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
const { transporter } = require("../config/nodemailer")
require('dotenv').config()




// REGISTER HANDLER 

exports.registerHandler = async (req, res) => {

    try {

        const { email, username, password } = req.body

        if (email === "" || password === "" || username === "") {

            return res.status(400).json({ message: "ALL DETAILS ARE REQUIRED !" })
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ message: "USER ALREADY EXISTS" })
        }

        const encryptPass = await bcrypt.hash(password, 10)

        await User.create({ email, username, password: encryptPass })

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: "Registration Successful",
            text: "Welcome to LUMIRO - Glow in Your Way", 
            html: `<h2>Welcome to LUMIRO - Glow in Your Way</h2>
                   <p>We’re excited to have you join our community!</p>`
        };


        await transporter.sendMail(mailOptions)


        return res.status(201).json({ messsage: "NEW USER CREATED SUCCESSFULLY" })



    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "SERVER ERROR" })
    }
}

// END OF REGISTER HANDLER 





// LOGIN HANDLER

exports.loginHandler = async (req, res) => {

    try {

        const { email, password } = req.body

        if (email === "" || password === "") {
            return res.status(400).json({ message: "EMAIL AND PASSWORD BOTH ARE REQUIRED !" })
        }

        const existingUser = await User.findOne({ email })

        if (existingUser === null) {
            return res.status(404).json({ message: "NO USER FOUND !" })
        }
        const verifyPass = await bcrypt.compare(password, existingUser.password)

        const payload = {
            userId: existingUser._id,
            username: existingUser.username
        }


        if (verifyPass) {
            const token = jwt.sign(payload, process.env.SECRET_KEY, {
                expiresIn: 24 * 60 * 60 * 1000
            })
            return res.json({ message: "LOGGED IN SUCCESSFULLY !", token })
        } else {
            return res.status(400).json({ message: "PASSWORD INCORRECT !" })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "INTERNAL SERVER ERROR" })
    }

}

// END OF LOGIN HANDLER





// FETCH USER HANDLER

exports.fetchUserHandler = async (req, res) => {
    try {


        console.log("request user", req.user)

        let { userId } = req.user

        let user = await User.findById(userId)

        if (user !== null) {
            return res.status(200).json({ message: "1 user Found !", payload: user })
        } else {
            return res.status(404).json({ message: "User Not Found !" })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server Error !" })
    }

}

// END OF FETCH USER HANDLER





//IPDTAE USER HANDLER 

exports.updateUserHandler= async(req, res) =>{
    try {
        const updates = req.body
        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password')
        res.json(user)
    } catch (err) { res.status(500).json({ message: 'server error' }) }
}

// END OF UPDATE USER HANDLER





// REPORT USER

exports.reportUser = async (req, res) => {
  try {
    const { reportedUserId } = req.query;   // User being reported
    const { userId } = req.user;            // Reporter
    const { reportText } = req.body;        // Reason

    // Find reported user
    const reportedUser = await User.findById(reportedUserId);
    if (!reportedUser) {
      return res.status(404).json({ message: "REPORTED USER NOT FOUND" });
    }

    // Create report object
    const reportObj = {
      reporterId: userId,
      reportedUserId,
      reportText,
      createdAt: new Date()
    };

    // Save report 
    const report = new Report(reportObj);
    await report.save();

    // Optionally track in reporter’s profile
    const reporter = await User.findById(userId);
    if (reporter) {
      reporter.reportsGiven.push({
        reportedUserId,
        reportId: report._id
      });
      await reporter.save();
    }

    // Send email to reported user
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: reportedUser.email,
      subject: "YOU HAVE BEEN REPORTED",
      text: `Hello ${reportedUser.username},\n\nYou have been reported for the following reason:\n"${reportText}"\n\nOur team will review this report.\n\nRegards,\nSupport Team LUMIRO`
    };

    await transporter.sendMail(mailOptions);

    return res.json({ message: "USER REPORTED AND MAIL SENT SUCCESSFULLY" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

// END OF REPORT USER





// FOLLOW / UNFOLLOW USER 

exports.toggleFollowUser = async (req, res) => {
  try {
    const { targetUserId } = req.query;
    const { userId } = req.user;

    if (userId === targetUserId) {
      return res.status(400).json({ message: "YOU CANNOT FOLLOW YOURSELF" });
    }

    const [user, targetUser] = await Promise.all([
      User.findById(userId),
      User.findById(targetUserId)
    ]);

    if (!user || !targetUser) {
      return res.status(404).json({ message: "USER NOT FOUND" });
    }

    const isFollowing = user.following.includes(targetUserId);

    if (isFollowing) {
      // UNFOLLOW
      user.following.pull(targetUserId);
      targetUser.followers.pull(userId);
      await Promise.all([user.save(), targetUser.save()]);
      return res.json({ message: "UNFOLLOWED SUCCESSFULLY" });
    }

    // FOLLOW
    user.following.push(targetUserId);
    targetUser.followers.push(userId);
    await Promise.all([user.save(), targetUser.save()]);
    return res.json({ message: "FOLLOWED SUCCESSFULLY" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "SERVER ERROR" });
  }
};

// END OF FOLLOW/ UNFOLLOE





// UPDATE USER BIO

exports.updateUserBio = async (req, res) => {
  try {
    const { userId } = req.user;       
    const { bio } = req.body;        

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "USER NOT FOUND" });
    }

    user.bio = bio;                    
    await user.save();

    return res.json({ message: "BIO UPDATED SUCCESSFULLY", bio: user.bio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "SERVER ERROR" });
  }
};

// END OF UPDTAE USER BIO





// UPDATE PROFILE PICTURE
exports.uploadProfilePic = async (req, res) => {
  try {
    const { userId } = req.user;
    const fileUrl = req.file?.path; 

    if (!fileUrl) {
      return res.status(400).json({ message: "NO FILE UPLOADED" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "USER NOT FOUND" });

    user.profilePic = fileUrl;
    await user.save();

    res.json({ message: "PROFILE PICTURE UPDATED", profilePic: user.profilePic });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "SERVER ERROR" });
  }
};

// END OF UPDATE PROFILE PICTURE





