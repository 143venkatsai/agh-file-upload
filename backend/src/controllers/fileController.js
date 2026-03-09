const File = require("../models/File");
const cloudinary = require("../config/cloudinary");

const uploadPdf = async (req, res) => {
  try {
    const file = req.file || req.files?.pdf?.[0] || req.files?.file?.[0];
    if (!file) {
      return res.status(400).json({
        message: "No file uploaded. Use multipart/form-data with field name 'pdf' or 'file'.",
      });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "raw",
      folder: "pdfs",
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
      originalFileName: file.title
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const finalizeFile = async (req, res) => {
  try {
    const { fileId, mainTitle, pages } = req.body;

    const processedPages = await Promise.all(
      pages.map(async (page) => {
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

    await File.findByIdAndUpdate(fileId, {
      title: mainTitle,
      pages: processedPages,
      status: "completed",
      success: true,
    });

    res.status(200).json({ success: true });
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
  deleteFile,
};
