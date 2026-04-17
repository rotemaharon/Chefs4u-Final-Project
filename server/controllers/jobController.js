const Job = require("../models/Job");
const Joi = require("joi");
const User = require("../models/User");

const jobCreateSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  location: Joi.string().min(2).required(),
  hourlyWage: Joi.number().min(1).required(),
  shiftDate: Joi.date().greater("now").required().messages({
    "date.greater": "תאריך המשמרת חייב להיות בעתיד",
  }),
  requiredWorkers: Joi.number().min(1).default(1),
});

const jobUpdateSchema = Joi.object({
  title: Joi.string().min(2).max(100),
  description: Joi.string().min(10).max(1000),
  location: Joi.string().min(2),
  hourlyWage: Joi.number().min(1),
  shiftDate: Joi.date(),
  requiredWorkers: Joi.number().min(1),
}).min(1);

exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== "restaurant" && req.user.role !== "admin") {
      return res.status(403).json({ message: "אין לך הרשאה לפרסם משרות" });
    }

    const { error } = jobCreateSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: `שגיאת ולידציה: ${error.details[0].message}` });
    }

    const job = new Job({
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      hourlyWage: req.body.hourlyWage,
      shiftDate: req.body.shiftDate,
      requiredWorkers: req.body.requiredWorkers,
      restaurantId: req.user.id,
    });

    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: "שגיאה ביצירת המשרה" });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .populate("restaurantId", "fullName email phone profileImage")
      .select("-applicants");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בטעינת המשרות" });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    if (req.user.role !== "cook") {
      return res
        .status(403)
        .json({ message: "רק טבחים יכולים לצפות במועמדויות" });
    }

    const jobs = await Job.find({ "applicants.cookId": req.user.id })
      .sort({ createdAt: -1 })
      .populate("restaurantId", "fullName phone email profileImage");

    const myApps = jobs.map((job) => {
      const myApp = job.applicants.find(
        (app) => app.cookId && app.cookId.toString() === req.user.id,
      );
      return {
        _id: job._id,
        title: job.title,
        location: job.location,
        hourlyWage: job.hourlyWage,
        shiftDate: job.shiftDate,
        isActive: job.isActive,
        restaurantId: job.restaurantId,
        status: myApp ? myApp.status : "pending",
      };
    });

    res.json(myApps);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בטעינת המועמדויות" });
  }
};

exports.applyForJob = async (req, res) => {
  try {
    if (req.user.role !== "cook") {
      return res.status(403).json({ message: "רק טבחים יכולים להגיש מועמדות" });
    }

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "המשרה לא נמצאה" });

    if (!job.isActive) {
      return res
        .status(400)
        .json({ message: "המשרה סגורה ולא ניתן להגיש אליה מועמדות" });
    }

    const isAlreadyApplied = job.applicants.some(
      (applicant) => applicant.cookId.toString() === req.user.id,
    );

    if (isAlreadyApplied) {
      return res.status(400).json({ message: "כבר הגשת מועמדות למשרה זו" });
    }

    job.applicants.push({ cookId: req.user.id });
    await job.save();
    res.json({ message: "המועמדות הוגשה בהצלחה! בהצלחה " });
  } catch (err) {
    res.status(500).json({ message: "שגיאה בהגשת המועמדות" });
  }
};

exports.cancelApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndUpdate(
      id,
      { $pull: { applicants: { cookId: req.user.id } } },
      { new: true },
    );

    if (!job) return res.status(404).json({ message: "המשרה לא נמצאה" });

    res.json({ message: "המועמדות בוטלה בהצלחה" });
  } catch (err) {
    res.status(500).json({ message: "שגיאה בביטול המועמדות" });
  }
};

exports.getRestaurantJobs = async (req, res) => {
  try {
    if (req.user.role !== "restaurant" && req.user.role !== "admin") {
      return res.status(403).json({ message: "אין לך הרשאה לצפות בדשבורד זה" });
    }

    const jobs = await Job.find({ restaurantId: req.user.id })
      .sort({ createdAt: -1 })
      .populate(
        "applicants.cookId",
        "fullName phone email experienceYears specialty bio profileImage",
      );

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בטעינת משרות המסעדה" });
  }
};

exports.updateApplicantStatus = async (req, res) => {
  try {
    if (req.user.role !== "restaurant" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "אין לך הרשאה לעדכן סטטוס מועמד" });
    }

    const { jobId, cookId } = req.params;
    const { status } = req.body;

    const statusSchema = Joi.object({
      status: Joi.string().valid("pending", "accepted", "rejected").required(),
    });

    const { error } = statusSchema.validate({ status });
    if (error) {
      return res.status(400).json({ message: "שגיאת ולידציה: סטטוס לא תקין." });
    }

    const query =
      req.user.role === "admin"
        ? { _id: jobId }
        : { _id: jobId, restaurantId: req.user.id };

    const job = await Job.findOne(query);
    if (!job)
      return res
        .status(404)
        .json({ message: "המשרה לא נמצאה או שאין לך הרשאה" });

    const applicant = job.applicants.find(
      (app) => app.cookId.toString() === cookId,
    );
    if (!applicant)
      return res.status(404).json({ message: "המועמד לא נמצא במשרה זו" });

    applicant.status = status;
    await job.save();
    res.json({
      message: "סטטוס המועמד עודכן בהצלחה!",
      status: applicant.status,
    });
  } catch (err) {
    res.status(500).json({ message: "שגיאה בעדכון הסטטוס" });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("restaurantId", "fullName email phone profileImage")
      .select("-applicants");
    if (!job) return res.status(404).json({ message: "המשרה לא נמצאה" });

    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בטעינת המשרה" });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const { error } = jobUpdateSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: `שגיאת ולידציה: ${error.details[0].message}` });
    }

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "המשרה לא נמצאה" });

    if (
      req.user.role !== "admin" &&
      req.user.id !== job.restaurantId.toString()
    ) {
      return res.status(403).json({ message: "אין לך הרשאה לערוך משרה זו" });
    }

    if (req.body.title !== undefined) job.title = req.body.title;
    if (req.body.description !== undefined)
      job.description = req.body.description;
    if (req.body.location !== undefined) job.location = req.body.location;
    if (req.body.hourlyWage !== undefined) job.hourlyWage = req.body.hourlyWage;
    if (req.body.shiftDate !== undefined) job.shiftDate = req.body.shiftDate;
    if (req.body.requiredWorkers !== undefined)
      job.requiredWorkers = req.body.requiredWorkers;

    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בעדכון המשרה" });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "המשרה לא נמצאה" });

    if (
      req.user.role !== "admin" &&
      req.user.id !== job.restaurantId.toString()
    ) {
      return res.status(403).json({ message: "אין לך הרשאה למחוק משרה זו" });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "המשרה נמחקה בהצלחה" });
  } catch (err) {
    res.status(500).json({ message: "שגיאה במחיקת המשרה" });
  }
};

exports.toggleJobStatus = async (req, res) => {
  try {
    if (req.user.role !== "restaurant" && req.user.role !== "admin") {
      return res.status(403).json({ message: "אין לך הרשאה לשנות סטטוס משרה" });
    }

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "המשרה לא נמצאה" });

    if (
      req.user.role !== "admin" &&
      req.user.id !== job.restaurantId.toString()
    ) {
      return res.status(403).json({ message: "אין לך הרשאה לסגור משרה זו" });
    }

    job.isActive = !job.isActive;
    await job.save();

    res.json({
      message: job.isActive ? "המשרה נפתחה מחדש" : "המשרה נסגרה",
      isActive: job.isActive,
    });
  } catch (err) {
    res.status(500).json({ message: "שגיאה בשינוי סטטוס המשרה" });
  }
};

exports.getJobFavoritesStats = async (req, res) => {
  try {
    const popularJobs = await Job.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "favorites",
          as: "favoritedBy",
        },
      },
      {
        $project: {
          title: 1,
          location: 1,
          hourlyWage: 1,
          restaurantId: 1,
          favoritesCount: { $size: "$favoritedBy" },
        },
      },
      { $sort: { favoritesCount: -1 } },
    ]);

    await User.populate(popularJobs, {
      path: "restaurantId",
      select: "fullName",
    });

    res.json(popularJobs);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בשליפת סטטיסטיקת מועדפים" });
  }
};
