const express = require("express");

const {
  createCompany,
  getCompany,
  checkcompany,
  updateCompany,
} = require("../controllers/companyController");
const requireAuth = require("../middleware/requireAuth");
const AdminAuth = require("../middleware/SystemAdmin");

const router = express.Router();

router.use(requireAuth);
router.post("/createcompany", createCompany, AdminAuth);
router.post("/checkcompany", checkcompany);
router.get("/:id", getCompany);
router.put("/update", updateCompany);
module.exports = router;
