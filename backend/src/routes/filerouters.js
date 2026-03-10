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
  fileAccessStudentByFileId,
  getAllStudentsWithFileAccess,
  removeStudentAccess,
  updateStudentFileAccess,
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
router.get("/students/access/:id", fileAccessStudentByFileId)
router.post("/students/access/:id", updateFileStudentsAccess)
router.get("/:id/students", getAllStudentsWithFileAccess)
router.patch("/:id/remove-access",removeStudentAccess)
router.patch("/:id/add-access",updateStudentFileAccess)


module.exports = router;
