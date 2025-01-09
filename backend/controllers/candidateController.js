const Candidate = require("../models/candidateModel");
const xlsx = require("xlsx");
const fs = require("fs");
const async = require("async");

exports.uploadCandidates = async (req, res) => {
  if (!req.file) 
  return res.status(400).json({ error: "No file uploaded" });

  const filePath = req.file.path;
  try {
    // read excel file
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    // console.log(sheet);
    const data = xlsx.utils.sheet_to_json(sheet);
   console.log(data);
    // process each candidate row 
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
          // check duplicate email
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
        } catch (error) {
          console.error("Error prosessing row:", error.message);
          callback(error);
        }
      },
      (err) => {
        if (err) {
          console.error("error processing file:", err.message);
          return res.status(500).json({ error: "Error processing file" });
        }

        fs.unlinkSync(filePath);
        res.status(200).json({
          message: "Candidates uploaded successfully",
          duplicates: dups,
        });
      }
    );
  } catch (err) {
     // Delete uploaded file on error
    fs.unlinkSync(filePath);
    res
      .status(500)
      .json({ error: "Error reading Excel file", details: err.message });
  }
};
