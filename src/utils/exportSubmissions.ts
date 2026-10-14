import ExcelJS from "exceljs";
import { Application, Submission } from "../types";
import { stripHtml } from "./application";
import { parseFileAnswer } from "../components/common/FileUploadField";

export function formatSubmittedDate(submittedAt?: string, fallbackSubmitted?: string): string {
  if (submittedAt) {
    const d = new Date(submittedAt);
    if (!isNaN(d.getTime())) {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const m = months[d.getMonth()];
      const day = String(d.getDate()).padStart(2, "0");
      return `${m} ${day}, ${d.getFullYear()}`;
    }
  }
  return fallbackSubmitted || "";
}

export function formatSubmittedTime(submittedAt?: string): string {
  if (submittedAt) {
    const d = new Date(submittedAt);
    if (!isNaN(d.getTime())) {
      let hours = d.getHours();
      const minutes = String(d.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
    }
  }
  return "";
}

export function formatSubmissionDateTime(submittedAt?: string, fallbackSubmitted?: string): string {
  const dateStr = formatSubmittedDate(submittedAt, fallbackSubmitted);
  const timeStr = formatSubmittedTime(submittedAt);
  if (dateStr && timeStr) {
    return `${dateStr}, ${timeStr}`;
  }
  return dateStr || fallbackSubmitted || "";
}

export interface QuestionColumnDef {
  sectionTitle: string;
  questionId: string;
  questionLabel: string;
  questionType: string;
  required: boolean;
}

export function getFormQuestionColumns(app: Application): QuestionColumnDef[] {
  const columns: QuestionColumnDef[] = [];
  const sections = app.sections || [];

  for (const s of sections) {
    const sectionTitle = stripHtml(s.title) || "Section";
    for (const q of s.questions) {
      columns.push({
        sectionTitle,
        questionId: q.id,
        questionLabel: stripHtml(q.label) || "Untitled Question",
        questionType: q.type,
        required: q.required,
      });
    }
  }

  return columns;
}

/**
 * Generates and downloads a rich, multi-sheet, two-level header Excel workbook (.xlsx).
 */
export async function exportSubmissionsToExcel(app: Application, submissions: Submission[]): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Gather";
  workbook.lastModifiedBy = "Gather";
  workbook.created = new Date();
  workbook.modified = new Date();

  const questionColumns = getFormQuestionColumns(app);
  const appTitle = stripHtml(app.name) || "Application";

  // ----------------------------------------------------
  // SHEET 1: Submissions
  // ----------------------------------------------------
  const wsSubmissions = workbook.addWorksheet("Submissions", {
    views: [{ state: "frozen", xSplit: 0, ySplit: 2 }],
  });

  // Base fixed columns: 1 to 5
  const baseHeaders = ["Submission ID", "Submitted Date", "Submitted Time", "Name", "Email"];

  // Build Row 1 (Section Groups) & Row 2 (Question Labels)
  const row1Values: string[] = [];
  const row2Values: string[] = [];

  // Base section header
  for (let i = 0; i < baseHeaders.length; i++) {
    row1Values.push("Submission Information");
    row2Values.push(baseHeaders[i]);
  }

  // Question section headers
  for (const col of questionColumns) {
    row1Values.push(col.sectionTitle);
    row2Values.push(col.questionLabel);
  }

  const row1 = wsSubmissions.addRow(row1Values);
  const row2 = wsSubmissions.addRow(row2Values);

  // Style Row 1 (Section Header)
  row1.height = 26;
  row1.eachCell((cell) => {
    cell.font = { name: "Segoe UI", size: 11, bold: true, color: { argb: "FF1E3A8A" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFEFF6FF" }, // Soft blue
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin", color: { argb: "FFBFDBFE" } },
      left: { style: "thin", color: { argb: "FFBFDBFE" } },
      bottom: { style: "thin", color: { argb: "FFBFDBFE" } },
      right: { style: "thin", color: { argb: "FFBFDBFE" } },
    };
  });

  // Style Row 2 (Question Header)
  row2.height = 24;
  row2.eachCell((cell) => {
    cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF0F172A" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF8FAFC" }, // Slate 50
    };
    cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
    cell.border = {
      top: { style: "thin", color: { argb: "FFE2E8F0" } },
      left: { style: "thin", color: { argb: "FFE2E8F0" } },
      bottom: { style: "medium", color: { argb: "FFCBD5E1" } },
      right: { style: "thin", color: { argb: "FFE2E8F0" } },
    };
  });

  // Merge Row 1 cells by section group
  // 1. Merge Base columns (1 to 5)
  wsSubmissions.mergeCells(1, 1, 1, 5);

  // 2. Merge each section's columns
  let currentColIndex = 6;
  const sections = app.sections || [];
  for (const s of sections) {
    const qCount = s.questions.length;
    if (qCount > 0) {
      const startCol = currentColIndex;
      const endCol = currentColIndex + qCount - 1;
      if (startCol < endCol) {
        wsSubmissions.mergeCells(1, startCol, 1, endCol);
      }
      currentColIndex += qCount;
    }
  }

  // Populate Submission Rows
  const uploadedFilesList: Array<{
    submissionId: string;
    applicantName: string;
    section: string;
    question: string;
    fileName: string;
    fileSize: string;
    submittedAt: string;
    downloadUrl?: string;
  }> = [];

  for (const sub of submissions) {
    const rowData: any[] = [
      sub.id,
      formatSubmittedDate(sub.submittedAt, sub.submitted),
      formatSubmittedTime(sub.submittedAt),
      sub.name,
      sub.email,
    ];

    for (const qDef of questionColumns) {
      const match = sub.answers.find(
        (a) => a.questionId === qDef.questionId || a.question === qDef.questionLabel
      );
      const answerVal = match?.answer ? String(match.answer).trim() : "";
      const normType = (qDef.questionType || "").toLowerCase().replace(/[\s_-]+/g, "");

      if (!answerVal) {
        rowData.push("");
        continue;
      }

      if (normType === "file" || normType === "fileupload" || normType === "upload") {
        const parsed = parseFileAnswer(answerVal);
        if (parsed && parsed.fileName) {
          uploadedFilesList.push({
            submissionId: sub.id,
            applicantName: sub.name,
            section: qDef.sectionTitle,
            question: qDef.questionLabel,
            fileName: parsed.fileName,
            fileSize: parsed.fileSize || "",
            submittedAt: formatSubmittedDate(sub.submittedAt, sub.submitted),
            downloadUrl: parsed.dataUrl,
          });

          if (parsed.dataUrl && parsed.dataUrl.startsWith("http")) {
            rowData.push({
              text: parsed.fileName,
              hyperlink: parsed.dataUrl,
            });
          } else {
            rowData.push(parsed.fileName);
          }
        } else {
          rowData.push(answerVal);
        }
      } else if (normType === "url" && (answerVal.startsWith("http://") || answerVal.startsWith("https://"))) {
        rowData.push({
          text: answerVal,
          hyperlink: answerVal,
        });
      } else {
        rowData.push(answerVal);
      }
    }

    const dataRow = wsSubmissions.addRow(rowData);
    dataRow.height = 22;
    dataRow.eachCell((cell, colNumber) => {
      cell.font = { name: "Segoe UI", size: 10, color: { argb: "FF334155" } };
      cell.alignment = { vertical: "middle", wrapText: true };
      cell.border = {
        top: { style: "thin", color: { argb: "FFF1F5F9" } },
        left: { style: "thin", color: { argb: "FFF1F5F9" } },
        bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
        right: { style: "thin", color: { argb: "FFF1F5F9" } },
      };

      // Style clickable hyperlink cells
      if (typeof cell.value === "object" && cell.value && (cell.value as any).hyperlink) {
        cell.font = { name: "Segoe UI", size: 10, color: { argb: "FF2563EB" }, underline: true };
      }
    });
  }

  // Adjust column widths based on contents
  wsSubmissions.columns.forEach((col, idx) => {
    let maxLength = 14;
    col.eachCell?.({ includeEmpty: true }, (cell, rowIdx) => {
      if (rowIdx > 1) {
        const val = typeof cell.value === "object" && cell.value ? (cell.value as any).text : String(cell.value || "");
        if (val.length > maxLength) {
          maxLength = Math.min(val.length, 45);
        }
      }
    });
    col.width = Math.max(maxLength + 3, 16);
  });

  // Enable AutoFilter across Row 2
  const totalCols = baseHeaders.length + questionColumns.length;
  wsSubmissions.autoFilter = {
    from: { row: 2, column: 1 },
    to: { row: Math.max(submissions.length + 2, 2), column: totalCols },
  };

  // ----------------------------------------------------
  // SHEET 2: Form Structure
  // ----------------------------------------------------
  const wsStructure = workbook.addWorksheet("Form Structure");
  wsStructure.addRow(["Section", "Question", "Question Type", "Required"]);
  const structHeader = wsStructure.getRow(1);
  structHeader.height = 24;
  structHeader.eachCell((cell) => {
    cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF0F172A" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF1F5F9" } };
    cell.alignment = { vertical: "middle" };
    cell.border = { bottom: { style: "medium", color: { argb: "FFCBD5E1" } } };
  });

  for (const qDef of questionColumns) {
    const sRow = wsStructure.addRow([
      qDef.sectionTitle,
      qDef.questionLabel,
      qDef.questionType || "Short text",
      qDef.required ? "Yes" : "No",
    ]);
    sRow.height = 20;
    sRow.eachCell((cell) => {
      cell.font = { name: "Segoe UI", size: 10, color: { argb: "FF334155" } };
      cell.border = { bottom: { style: "thin", color: { argb: "FFF1F5F9" } } };
    });
  }

  wsStructure.columns.forEach((col) => {
    col.width = 28;
  });

  // ----------------------------------------------------
  // SHEET 3: Files (if any uploaded files exist)
  // ----------------------------------------------------
  if (uploadedFilesList.length > 0) {
    const wsFiles = workbook.addWorksheet("Files");
    wsFiles.addRow([
      "Submission ID",
      "Applicant Name",
      "Section",
      "Question",
      "File Name",
      "File Size",
      "Submitted Date",
      "Download Link",
    ]);

    const filesHeader = wsFiles.getRow(1);
    filesHeader.height = 24;
    filesHeader.eachCell((cell) => {
      cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF0F172A" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF1F5F9" } };
      cell.alignment = { vertical: "middle" };
      cell.border = { bottom: { style: "medium", color: { argb: "FFCBD5E1" } } };
    });

    for (const fileItem of uploadedFilesList) {
      const fRow = wsFiles.addRow([
        fileItem.submissionId,
        fileItem.applicantName,
        fileItem.section,
        fileItem.question,
        fileItem.fileName,
        fileItem.fileSize,
        fileItem.submittedAt,
        fileItem.downloadUrl && fileItem.downloadUrl.startsWith("http")
          ? { text: "Download File", hyperlink: fileItem.downloadUrl }
          : fileItem.fileName,
      ]);
      fRow.height = 20;
      fRow.eachCell((cell) => {
        cell.font = { name: "Segoe UI", size: 10, color: { argb: "FF334155" } };
        cell.border = { bottom: { style: "thin", color: { argb: "FFF1F5F9" } } };
        if (typeof cell.value === "object" && cell.value && (cell.value as any).hyperlink) {
          cell.font = { name: "Segoe UI", size: 10, color: { argb: "FF2563EB" }, underline: true };
        }
      });
    }

    wsFiles.columns.forEach((col) => {
      col.width = 24;
    });
  }

  // Trigger Excel file download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${app.slug || "application"}-submissions.xlsx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads a properly structured CSV file with a dedicated column per question.
 */
export function exportSubmissionsToCSV(app: Application, submissions: Submission[]): void {
  const questionColumns = getFormQuestionColumns(app);

  // Headers: Base + Each Question
  const headers = [
    "Submission ID",
    "Submitted Date",
    "Submitted Time",
    "Name",
    "Email",
    ...questionColumns.map((q) => `"${q.sectionTitle} - ${q.questionLabel.replace(/"/g, '""')}"`),
  ];

  const rows = submissions.map((sub) => {
    const rowValues = [
      sub.id,
      `"${formatSubmittedDate(sub.submittedAt, sub.submitted)}"`,
      `"${formatSubmittedTime(sub.submittedAt)}"`,
      `"${(sub.name || "").replace(/"/g, '""')}"`,
      `"${(sub.email || "").replace(/"/g, '""')}"`,
    ];

    for (const qDef of questionColumns) {
      const match = sub.answers.find(
        (a) => a.questionId === qDef.questionId || a.question === qDef.questionLabel
      );
      const answerVal = match?.answer ? String(match.answer).trim() : "";
      const normType = (qDef.questionType || "").toLowerCase().replace(/[\s_-]+/g, "");

      if (!answerVal) {
        rowValues.push('""');
        continue;
      }

      if (normType === "file" || normType === "fileupload" || normType === "upload") {
        const parsed = parseFileAnswer(answerVal);
        if (parsed && parsed.fileName) {
          const fileStr = parsed.fileSize ? `${parsed.fileName} (${parsed.fileSize})` : parsed.fileName;
          rowValues.push(`"${fileStr.replace(/"/g, '""')}"`);
        } else {
          rowValues.push(`"${answerVal.replace(/"/g, '""')}"`);
        }
      } else {
        rowValues.push(`"${answerVal.replace(/"/g, '""')}"`);
      }
    }

    return rowValues.join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${app.slug || "application"}-submissions.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
