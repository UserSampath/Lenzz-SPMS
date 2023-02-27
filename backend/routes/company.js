const express = require("express");

const {
  createCompany,
  checkcompany,
} = require("../controllers/companyController");
const requireAuth = require("../middleware/requireAuth");
const AdminAuth = require("../middleware/SystemAdmin");

const router = express.Router();

router.use(requireAuth);
router.post("/createcompany", createCompany, AdminAuth);
router.post("/checkcompany", checkcompany);
module.exports = router;
