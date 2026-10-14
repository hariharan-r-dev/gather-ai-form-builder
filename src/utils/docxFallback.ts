import JSZip from "jszip";

export async function createSampleDocxBlob(docTitle: string = "ZOHO PEOPLE zoho"): Promise<Blob> {
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
      <w:r><w:t>• Human Resource Management &amp; People Operations (Zoho People, HRMS)</w:t></w:r>
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
      <w:r><w:rPr><w:b/></w:rPr><w:t>Senior Operations Associate | Zoho People Ecosystem</w:t></w:r>
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
