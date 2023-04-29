const express = require("express");
const {
  createCompany,
  checkcompany,
  randomkey,
  companyUsers,
  getCompanyById,
} = require("../controllers/companyController");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();

router.post("/createcompany", requireAuth, createCompany);
router.post("/checkcompany", requireAuth, checkcompany);
router.get("/companyUsers", requireAuth, companyUsers);
router.get("/:id", requireAuth, getCompanyById);
router.get("/randomkey", randomkey);
module.exports = router;
