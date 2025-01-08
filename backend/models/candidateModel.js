const { Schema, model } = require("mongoose");

const candidateSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobileno: { type: String },
    dob: { type: String },
    experience: { type: String },
    resume: { type: String },
    curLocation: { type: String },
    postalAddress: { type: String },
    curEmployer: { type: String },
    curDesignation: { type: String },
  },
  { timestamps: true }
);

module.exports = model("Data", candidateSchema);
