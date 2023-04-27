const express = require("express");
const {
  createCompany,
  checkcompany,
  randomkey,
  companyUsers,
  updateCompany,
  getCompanyById,
} = require("../controllers/companyController");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();

router.post("/createcompany", requireAuth, createCompany);
router.post("/checkcompany", requireAuth, checkcompany);
router.get("/companyUsers", requireAuth, companyUsers);
router.put("/updateCompany", requireAuth, updateCompany);
router.get("/randomkey", randomkey);
router.get("/:id", requireAuth, getCompanyById);
module.exports = router;
