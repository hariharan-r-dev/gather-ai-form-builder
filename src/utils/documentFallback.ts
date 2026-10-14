import JSZip from "jszip";

/**
 * Creates a valid, well-formed PDF 1.4 binary Blob for previewing documents
 */
export function createSamplePdfBlob(fileName: string = "Document.pdf"): Blob {
  const title = fileName.replace(/\.pdf$/i, "");
  const text = `BT
/F1 18 Tf
50 720 Td
(${title}) Tj
/F1 11 Tf
0 -26 Td
(Uploaded Document: ${fileName}) Tj
0 -18 Td
(Candidate Portfolio & Resume Submission) Tj
0 -25 Td
(Professional Summary:) Tj
0 -16 Td
(Experienced professional with demonstrated expertise in product operations,) Tj
0 -16 Td
(user research, cross-functional collaboration, and technical leadership.) Tj
0 -24 Td
(Key Competencies & Highlights:) Tj
0 -16 Td
( - Lead UX / Product Designer - Hackathon Finalist 2025) Tj
0 -16 Td
( - 4+ Years Experience in User Research, Figma Prototyping & Design Systems) Tj
0 -16 Td
( - Education: Master's Degree in Human-Computer Interaction) Tj
0 -24 Td
(Project Experience:) Tj
0 -16 Td
( - Spearheaded design system architecture across 12 product modules) Tj
0 -16 Td
( - Improved applicant workflow conversion by 34% through usability testing) Tj
ET`;

  const streamLength = new TextEncoder().encode(text).length;

  const pdfContent = `%PDF-1.4
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

  return new Blob([pdfContent], { type: "application/pdf" });
}

/**
 * Creates a valid DOCX binary Blob for previewing Word documents
 */
export async function createSampleDocxBlob(docTitle: string = "Resume Document"): Promise<Blob> {
  const zip = new JSZip();

  // [Content_Types].xml
  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`
  );

  // _rels/.rels
  zip.file(
    "_rels/.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
  );

  // word/_rels/document.xml.rels
  zip.file(
    "word/_rels/document.xml.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`
  );

  // word/styles.xml
  zip.file(
    "word/styles.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
        <w:sz w:val="22"/>
        <w:color w:val="0F172A"/>
      </w:rPr>
    </w:rPrDefault>
  </w:docDefaults>
</w:styles>`
  );

  // word/document.xml
  zip.file(
    "word/document.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="36"/><w:color w:val="2563EB"/></w:rPr><w:t>CANDIDATE RESUME / CV</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:i/><w:sz w:val="24"/><w:color w:val="64748B"/></w:rPr><w:t>${docTitle}</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p>
      <w:r><w:rPr><w:b/><w:sz w:val="26"/><w:color w:val="0F172A"/></w:rPr><w:t>Professional Summary</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>Experienced professional with a demonstrated history of working in product operations, team leadership, and digital transformation. Skilled in customer success, project coordination, and workflow optimization.</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p>
      <w:r><w:rPr><w:b/><w:sz w:val="26"/><w:color w:val="0F172A"/></w:rPr><w:t>Core Competencies</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>• Human Resource Management &amp; People Operations</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>• Cross-functional Project Planning &amp; Agile Execution</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>• Process Automation &amp; Documentation</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>• Communication, Stakeholder Management, and Team Leadership</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p>
      <w:r><w:rPr><w:b/><w:sz w:val="26"/><w:color w:val="0F172A"/></w:rPr><w:t>Work Experience</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:b/></w:rPr><w:t>Senior Operations Associate</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:i/><w:color w:val="64748B"/></w:rPr><w:t>2022 - Present</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>- Led end-to-end recruitment pipelines, onboarding workflows, and internal communications.</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>- Configured attendance tracking, leave policies, and self-service employee portals.</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>- Streamlined submission and application review cycles with 99.8% compliance accuracy.</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p>
      <w:r><w:rPr><w:b/><w:sz w:val="26"/><w:color w:val="0F172A"/></w:rPr><w:t>Education &amp; Credentials</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:b/></w:rPr><w:t>Bachelor of Science in Information Systems</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>Certified Professional in Agile Project Management &amp; People Operations</w:t></w:r>
    </w:p>
  </w:body>
</w:document>`
  );

  return await zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

/**
 * Creates a valid Text Blob
 */
export function createSampleTxtBlob(fileName: string = "document.txt"): Blob {
  const content = `Document: ${fileName}
Submitted via Gather Application

---
Applicant Notes & Details:
- Candidate profile and portfolio submission
- Document verification completed
- Status: Attached and verified
`;
  return new Blob([content], { type: "text/plain;charset=utf-8" });
}
