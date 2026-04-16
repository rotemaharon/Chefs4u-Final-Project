const User = require("../models/User");
const Job = require("../models/Job");
const Message = require("../models/Message");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

exports.register = async (req, res) => {
  try {
    const schema = Joi.object({
      fullName: Joi.string().min(2).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(
          new RegExp(
            "^(?=.*[A-Z])(?=.*[a-z])(?=(.*\\d){4,})(?=.*[!@$#%^&*\\-_])[A-Za-z\\d!@$#%^&*\\-_]{8,}$",
          ),
        )
        .required(),
      phone: Joi.string().min(9).required(),
      role: Joi.string().valid("cook", "restaurant").required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: "שגיאת ולידציה: הנתונים שהוזנו אינם תקינים." });
    }

    const { fullName, email, password, phone, role } = req.body;

    let user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ message: "משתמש עם אימייל זה כבר קיים במערכת" });

    user = new User({ fullName, email, password, phone, role });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "4h" },
      (err, token) => {
        if (err) throw err;
        const userResponse = user.toObject();
        delete userResponse.password;
        res.json({ token, user: userResponse });
      },
    );
  } catch (err) {
    res.status(500).json({ message: "שגיאת שרת" });
  }
};

exports.login = async (req, res) => {
  try {
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(1).required(),
    });

    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: "שגיאת ולידציה: יש להזין אימייל וסיסמה תקינים." });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "פרטים שגויים" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "פרטים שגויים" });

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "4h" },
      (err, token) => {
        if (err) throw err;
        const userResponse = user.toObject();
        delete userResponse.password;
        res.json({ token, user: userResponse });
      },
    );
  } catch (err) {
    res.status(500).json({ message: "שגיאת שרת" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "שגיאת שרת" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profileUpdateSchema = Joi.object({
      fullName: Joi.string().min(2),
      phone: Joi.string().min(9),
      experienceYears: Joi.number().min(0).allow("", null),
      specialty: Joi.string().allow("", null),
      bio: Joi.string().max(1000).allow("", null),
    }).min(1);

    const { error } = profileUpdateSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: `שגיאת ולידציה: ${error.details[0].message}` });
    }

    const updateData = {};
    if (req.body.fullName !== undefined) updateData.fullName = req.body.fullName;
    if (req.body.phone !== undefined) updateData.phone = req.body.phone;
    if (req.body.experienceYears !== undefined)
      updateData.experienceYears = req.body.experienceYears;
    if (req.body.specialty !== undefined) updateData.specialty = req.body.specialty;
    if (req.body.bio !== undefined) updateData.bio = req.body.bio;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true },
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "שגיאת שרת בעדכון הפרופיל" });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "לא נבחר קובץ להעלאה" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "משתמש לא נמצא" });
    }

    if (user.profileImage) {
      const oldFileName = user.profileImage.split("/").pop();
      const oldFilePath = path.join(
        __dirname,
        "..",
        "uploads",
        "profiles",
        oldFileName,
      );
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    const imageUrl = `/uploads/profiles/${req.file.filename}`;
    user.profileImage = imageUrl;
    await user.save();

    res.json({ profileImage: imageUrl });
  } catch (err) {
    res.status(500).json({ message: "שגיאת שרת בהעלאת התמונה" });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const jobId = req.params.jobId;
    if (!user) return res.status(404).json({ message: "משתמש לא נמצא" });

    const index = user.favorites.indexOf(jobId);
    if (index === -1) {
      user.favorites.push(jobId);
    } else {
      user.favorites.splice(index, 1);
    }

    await user.save();
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: "שגיאת שרת בעדכון מועדפים" });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "favorites",
      populate: { path: "restaurantId", select: "fullName" },
    });
    if (!user) return res.status(404).json({ message: "משתמש לא נמצא" });
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: "שגיאת שרת בשליפת מועדפים" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "שגיאת שרת בשליפת משתמשים" });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const roleSchema = Joi.object({
      role: Joi.string().valid("cook", "restaurant", "admin").required(),
    });

    const { error } = roleSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: "שגיאת ולידציה: הרשאה לא תקינה." });
    }

    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "לא ניתן לשנות את ההרשאה של עצמך" });
    }

    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true },
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "שגיאת שרת בעדכון הרשאות משתמש" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (userId === req.user.id) {
      return res.status(400).json({ message: "לא ניתן למחוק את עצמך" });
    }

    await Job.deleteMany({ restaurantId: userId });

    await Message.deleteMany({
      $or: [{ sender: userId }, { recipient: userId }],
    });

    await User.findByIdAndDelete(userId);
    res.json({ message: "המשתמש נמחק בהצלחה" });
  } catch (err) {
    res.status(500).json({ message: "שגיאת שרת במחיקת משתמש" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "לא נמצא משתמש עם כתובת אימייל זו" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "איפוס סיסמה - Chefs4u",
      text: `הנך מקבל הודעה זו כי ביקשת (או מישהו אחר ביקש) לאפס את הסיסמה לחשבונך.\n\n
        אנא לחץ על הקישור הבא או הדבק אותו בדפדפן כדי להשלים את התהליך:\n\n
        ${resetUrl}\n\n
        אם לא ביקשת זאת, אנא התעלם מהודעה זו והסיסמה שלך תישאר ללא שינוי.\n`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "הודעת אימייל עם הוראות נשלחה לכתובת המבוקשת" });
  } catch (err) {
    res.status(500).json({ message: "שגיאת שרת בשליחת אימייל לשחזור" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "טוקן איפוס הסיסמה אינו תקין או שפג תוקפו" });
    }

    const { password } = req.body;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=(.*\d){4,})(?=.*[!@$#%^&*\-_])[A-Za-z\d!@$#%^&*\-_]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .json({ message: "הסיסמה החדשה אינה עומדת בדרישות האבטחה" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.json({ message: "הסיסמה שונתה בהצלחה" });
  } catch (err) {
    res.status(500).json({ message: "שגיאת שרת בעדכון הסיסמה החדשה" });
  }
};
