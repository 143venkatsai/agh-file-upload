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
    
    publicId: { type: String, required: true },

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

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
      }
    ],

    // adminUser: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "AdminUser"
    // },

    pages: [pageSchema],
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending"
    },

    success: {
      type: Boolean,
      default: false
    },

    finalizedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
