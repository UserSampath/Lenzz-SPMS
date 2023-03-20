const express = require("express");
const {
  createCompany,
  checkcompany,
  randomkey,
} = require("../controllers/companyController");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();

router.post("/createcompany", requireAuth, createCompany);
router.post("/checkcompany", requireAuth, checkcompany);
router.get("/randomkey", randomkey);
module.exports = router;
