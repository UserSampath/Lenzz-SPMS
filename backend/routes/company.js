const express = require("express");
const {
  createCompany,
  checkcompany,
  randomkey,
  companyUsers,
  updateCompanyData,
  getCompanyById,
  sendInvitation
} = require("../controllers/companyController");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();

router.post("/createcompany", requireAuth, createCompany);
router.post("/checkcompany", requireAuth, checkcompany);
router.get("/companyUsers", requireAuth, companyUsers);

router.get("/randomkey", randomkey);
router.put("/updateCompanyData", updateCompanyData);
router.get("/:id", requireAuth, getCompanyById);
router.post("/sendInvitation", sendInvitation);

module.exports = router;
