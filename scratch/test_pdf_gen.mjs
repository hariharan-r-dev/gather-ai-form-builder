import fs from "fs";

function createSamplePdfBlob(fileName = "Designathon2025.pdf") {
  const title = fileName.replace(/\.pdf$/i, "");
  const text = `BT
/F1 20 Tf
50 720 Td
(${title}) Tj
/F1 12 Tf
0 -30 Td
(Applicant Document: ${fileName}) Tj
0 -20 Td
(Candidate Portfolio & Resume Submission) Tj
0 -25 Td
(Key Qualifications & Project Highlights:) Tj
0 -20 Td
(- UX Design Lead - Hackathon Finalist 2025) Tj
0 -20 Td
(- 4+ Years Experience in User Research, Figma Prototyping & Design Systems) Tj
0 -20 Td
(- Education: Master's Degree in Human-Computer Interaction) Tj
ET`;

  const streamLength = Buffer.byteLength(text, "utf-8");

  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${text}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000350 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
450
%%EOF`;

  return Buffer.from(pdf, "utf-8");
}

const buffer = createSamplePdfBlob("Designathon2025.pdf");
fs.writeFileSync("scratch/test_generated.pdf", buffer);
console.log("SUCCESS: Generated PDF of size", buffer.length, "bytes");
