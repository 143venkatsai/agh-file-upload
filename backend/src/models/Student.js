const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  collegeName: {
    type: String,
    required: true
  },
  ugOrPg: {
    type: String,
    enum: ["UG", "PG"],
    required: true
  },
  year: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Student", studentSchema);