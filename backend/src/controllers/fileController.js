const File = require("../models/File");
const cloudinary = require("../config/cloudinary");
const Students = require("../models/Students");
const mongoose = require("mongoose");

const deleteCloudinaryAsset = async (publicId, options = {}) => {
  if (!publicId) return;

  const result = await cloudinary.uploader.destroy(publicId, options);
  if (result?.result === "ok" || result?.result === "not found") {
    return;
  }

  throw new Error(`Failed to delete Cloudinary asset: ${publicId}`);
};

const deleteRelatedCloudinaryFiles = async (file) => {
  const deletionTasks = [];

  if (file?.pdfPublicId) {
    deletionTasks.push(
      deleteCloudinaryAsset(file.pdfPublicId, { resource_type: "raw" }),
    );
  }

  if (Array.isArray(file?.pages) && file.pages.length) {
    deletionTasks.push(
      ...file.pages
        .map((page) => page?.publicId)
        .filter(Boolean)
        .map((publicId) => deleteCloudinaryAsset(publicId)),
    );
  }

  await Promise.all(deletionTasks);
};

const uploadPdf = async (req, res) => {
  try {
    const file = req.file || req.files?.pdf?.[0] || req.files?.file?.[0];
    if (!file) {
      return res.status(400).json({
        message:
          "No file uploaded. Use multipart/form-data with field name 'pdf' or 'file'.",
      });
    }
    if (!file.buffer) {
      return res
        .status(400)
        .json({ message: "Uploaded file buffer is missing." });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "pdfs",
        },
        (error, uploadResult) => {
          if (error) return reject(error);
          return resolve(uploadResult);
        },
      );

      stream.end(file.buffer);
    });

    const newFile = await File.create({
      originalPdf: result.secure_url,
      title: file.originalname,
      pdfPublicId: result.public_id,
    });

    res.status(200).json({
      fileId: newFile._id,
      pdfUrl: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    res.status(200).json({
      fileId: file._id,
      pdfUrl: file.originalPdf,
      originalFileName: file.title,
      status: file.status,
      success: file.success,
      finalizedAt: file.finalizedAt,
      pages: file.pages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const finalizeFile = async (req, res) => {
  try {
    const { fileId, mainTitle, pages } = req.body;
    if (!fileId) {
      return res.status(400).json({ message: "fileId is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ message: "Invalid fileId format" });
    }
    if (!Array.isArray(pages) || pages.length === 0) {
      return res
        .status(400)
        .json({ message: "pages must be a non-empty array" });
    }

    const existingFile = await File.findById(fileId);
    if (!existingFile) {
      return res.status(404).json({ message: "File not found for finalize" });
    }

    const processedPages = await Promise.all(
      pages.map(async (page) => {
        if (!page?.imageData || typeof page.imageData !== "string") {
          throw new Error(
            `Invalid imageData for page ${page?.pageNumber || "unknown"}`,
          );
        }

        const uploadRes = await cloudinary.uploader.upload(page.imageData, {
          folder: "watermarked_pages",
        });

        return {
          pageNo: page.pageNumber,
          imageUrl: uploadRes.secure_url,
          publicId: uploadRes.public_id,
          title: page.pageTitle,
          description: page.description,
        };
      }),
    );

    existingFile.title = (mainTitle || "").trim();
    existingFile.pages = processedPages;
    existingFile.status = "completed";
    existingFile.success = true;
    existingFile.finalizedAt = new Date();
    const updatedFile = await existingFile.save();

    res.status(200).json({
      success: true,
      fileId: updatedFile._id,
      status: updatedFile.status,
      finalizedAt: updatedFile.finalizedAt,
      pageCount: updatedFile.pages.length,
      message: "File Uploaded Successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFiles = async (req, res) => {
  try {
    const files = await File.find({
      success: true,
      "pages.0": { $exists: true },
    }).sort({ createdAt: -1 });
    res.status(200).json({ files, message: "Files fetch successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid fileId format" });
    }

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    await deleteRelatedCloudinaryFiles(file);

    await File.findByIdAndDelete(id);

    res.json({
      message: "File deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const addStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      collegeName,
      ugOrPg,
      year,
      department,
      email,
    } = req.body;

    const newStudent = new Student({
      firstName,
      lastName,
      collegeName,
      ugOrPg,
      year,
      department,
      email,
    });
    const savedStudent = await newStudent.save();
    res.status(201).json({
      message: "Student added successfully",
      data: savedStudent,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding student",
      error: error.message,
    });
  }
};

const fileAccessStudentByFileId = async (req, res) => {
  try {
    const { id } = req.params;
    const { search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let searchFilter = {};
    if (search) {
      const regex = new RegExp(search, "i");
      searchFilter = {
        $or: [{ firstName: regex }, { email: regex }, { collegeName: regex }],
      };
    }

    const file = await File.findById(id)
      .select("students")
      .populate({
        path: "students",
        select: "firstName lastName email department year collegeName ugOrPg",
        match: searchFilter,
        options: {
          limit: limit,
          skip: skip,
        },
      });

    if (!file) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    const totalMatchingStudents = await File.findById(id).then((doc) => {
      return Students.countDocuments({
        _id: { $in: doc.students },
        ...searchFilter,
      });
    });

    const totalPages = Math.ceil(totalMatchingStudents / limit);

    res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: {
        students: file.students,
        pagination: {
          totalStudents: totalMatchingStudents,
          totalPages: totalPages,
          currentPage: page,
          pageSize: file.students.length,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllStudentsWithFileAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const { search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const targetFile = await File.findById(id).select("students");
    if (!targetFile) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }
    const authorizedIds = targetFile.students.map((id) => id.toString());
    let searchFilter = {};
    if (search) {
      const regex = new RegExp(search, "i");
      searchFilter = {
        $or: [{ firstName: regex }, { email: regex }, { collegeName: regex }],
      };
    }
    const allStudents = await Students.find(searchFilter)
      .limit(limit)
      .skip(skip)
      .sort({ firstName: 1 })
      .lean();

    const totalStudents = await Students.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalStudents / limit);
    const studentsWithStatus = allStudents.map((student) => ({
      ...student,
      hasAccess: authorizedIds.includes(student._id.toString()),
    }));
    res.status(200).json({
      success: true,
      message: "Students fetched with access status",
      data: {
        students: studentsWithStatus,
        pagination: {
          totalStudents,
          totalPages,
          currentPage: page,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeStudentAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;

    if (!fileId || !studentId) {
      return res.status(400).json({
        success: false,
        message: "File ID and Student ID are required.",
      });
    }

    const updatedFile = await File.findByIdAndUpdate(
      fileId,
      { $pull: { students: studentId } },
      { new: true },
    );

    if (!updatedFile) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Access removed successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateStudentFileAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentIds } = req.body;

    if (!id || !Array.isArray(studentIds)) {
      return res.status(400).json({
        success: false,
        message: "File ID and an array of Student IDs are required.",
      });
    }

    const updatedFile = await File.findByIdAndUpdate(
      id,
      { $addToSet: { students: { $each: studentIds } } },
      { new: true },
    ).select("students");

    if (!updatedFile) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: `${studentIds.length} students' access updated successfully.`,
      totalAuthorized: updatedFile.students.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateFileStudentsAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentIds } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file ID format.",
      });
    }

    if (!Array.isArray(studentIds)) {
      return res.status(400).json({
        success: false,
        message: "studentIds must be an array.",
      });
    }

    const validStudentIds = studentIds.filter((studentId) =>
      mongoose.Types.ObjectId.isValid(studentId),
    );

    const updatedFile = await File.findByIdAndUpdate(
      id,
      { $set: { students: [...new Set(validStudentIds)] } },
      { new: true },
    );

    if (!updatedFile) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Access updated successfully.",
      studentCount: updatedFile.students.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
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
  updateFileStudentsAccess
};
