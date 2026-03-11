const express = require("express");
const router = express.Router();

const upload = require("../middlewares/uploade");
const {
  uploadPdf,
  getFileById,
  finalizeFile,
  getFiles,
  deleteFile,
  addStudent,
  fileAccessStudentsByFileId,
  getAllStudentsWithFileAccess,
  removeStudentAccess,
  updateFileStudentsAccess,
} = require("../controllers/fileController");

router.post(
  "/upload",
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  uploadPdf,
);
router.get("/get-pdf/:id", getFileById);
router.put("/finalize", finalizeFile);
router.get("/get-pdf", getFiles);
router.delete("/:id", deleteFile);

router.post("/add-student", addStudent)
router.get("/students/access/:id", fileAccessStudentsByFileId)
router.put("/students/access/:id", updateFileStudentsAccess)
router.get("/:id/students", getAllStudentsWithFileAccess)
router.patch("/:id/remove-access",removeStudentAccess)


module.exports = router;
