const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    pageNo: {
      type: Number,
      required: true,
      min: 1
    },

    imageUrl: {
      type: String,
      required: true
    },

    title: {
      type: String,
      trim: true
    },

    description: {
      type: String,
      trim: true
    }
  },
  { _id: false }
);

const fileSchema = new mongoose.Schema(
  {
    originalPdf: {
      type: String,
      required: true
    },

    pdfPublicId: {
      type: String,
      required: true
    },

    title: {
      type: String,
      default: ""
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    pages: [pageSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
