const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.post("/", auth, jobController.createJob);
router.get("/", jobController.getAllJobs);
router.get("/restaurant", auth, jobController.getRestaurantJobs);
router.get("/my-applications", auth, jobController.getMyApplications);
router.get("/stats/favorites", auth, admin, jobController.getJobFavoritesStats);
router.post("/:id/apply", auth, jobController.applyForJob);
router.delete("/:id/apply", auth, jobController.cancelApplication);
router.put(
  "/:jobId/applicants/:cookId/status",
  auth,
  jobController.updateApplicantStatus,
);
router.get("/:id", jobController.getJobById);
router.put("/:id", auth, jobController.updateJob);
router.delete("/:id", auth, jobController.deleteJob);
router.patch("/:id/toggle-status", auth, jobController.toggleJobStatus);

module.exports = router;
