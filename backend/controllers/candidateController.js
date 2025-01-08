const Candidate = require("../models/candidateModel");
const xlsx = require("xlsx");
const fs = require("fs");
const async = require("async");

exports.uploadCandidates = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const filePath = req.file.path;

  try {
    // Read Excel File
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Process each candidate row
    let dups = 0;
    async.eachSeries(
      data,
      async (row, callback) => {
        try {
          const {
            name,
            email,
            mobileno,
            dob,
            experience,
            resume,
            curLocation,
            postalAddress,
            curEmployer,
            curDesignation,
          } = row;
          // console.log(row);
          // Check for duplicate email
          const exists = await Candidate.findOne({ email });
          if (!exists) {
            await Candidate.create({
              name,
              email,
              mobileno,
              dob,
              experience,
              resume,
              curLocation,
              postalAddress,
              curEmployer,
              curDesignation,
            });
          } else {
            dups += 1;
          }
          // Proceed to the next record
        } catch (error) {
          console.error("Error processing row:", error.message);
          callback(error); // Stop on error
        }
      },
      (err) => {
        if (err) {
          console.error("Error processing file:", err.message);
          return res.status(500).json({ error: "Error processing file" });
        }

        fs.unlinkSync(filePath); // Delete uploaded file
        res.status(200).json({
          message: "Candidates uploaded successfully",
          duplicates: dups,
        });
      }
    );
  } catch (err) {
    fs.unlinkSync(filePath); // Delete uploaded file on error
    res
      .status(500)
      .json({ error: "Error reading Excel file", details: err.message });
  }
};
