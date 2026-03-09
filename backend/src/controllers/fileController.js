const File = require("../models/File");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");

const uploadPdf = async (req, res) => {
  try {
    const file = req.file || req.files?.pdf?.[0] || req.files?.file?.[0];
    if (!file) {
      return res.status(400).json({
        message: "No file uploaded. Use multipart/form-data with field name 'pdf' or 'file'.",
      });
    }
    if (!file.buffer) {
      return res.status(400).json({ message: "Uploaded file buffer is missing." });
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
      return res.status(400).json({ message: "pages must be a non-empty array" });
    }

    const existingFile = await File.findById(fileId);
    if (!existingFile) {
      return res.status(404).json({ message: "File not found for finalize" });
    }

    const processedPages = await Promise.all(
      pages.map(async (page) => {
        if (!page?.imageData || typeof page.imageData !== "string") {
          throw new Error(`Invalid imageData for page ${page?.pageNumber || "unknown"}`);
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
      })
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
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getPdf = async (req, res) => {
  try {
    const data = await File.find({}).sort({ updatedAt: -1 });
    res.status(200).json({ data, message: "Data fetch successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    await cloudinary.uploader.destroy(file.pdfPublicId, {
      resource_type: "raw",
    });

    await File.findByIdAndDelete(req.params.id);

    res.json({
      message: "File deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  uploadPdf,
  getFileById,
  finalizeFile,
  getPdf,
  deleteFile,
};
