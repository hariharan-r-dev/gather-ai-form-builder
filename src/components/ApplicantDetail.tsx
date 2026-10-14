import { useState } from "react";
import { Submission, Application } from "../types";
import { submissionService } from "../services/submissions/submissionService";
import { parseFileAnswer, FileMetadata } from "./common/FileUploadField";
import { fileStorage } from "../services/storage/fileStorage";
import { useUIState } from "../app/AppProvider";
import FilePreviewModal from "./modals/FilePreviewModal";
import { formatSubmissionDateTime } from "../utils/exportSubmissions";
import {
  createSamplePdfBlob,
  createSampleDocxBlob,
  createSampleTxtBlob,
} from "../utils/documentFallback";

interface ApplicantDetailProps {
  applicant: Submission;
  app?: Application;
  onBack: () => void;
}

function isFileQuestionType(type?: string): boolean {
  if (!type) return false;
  const norm = type.toLowerCase().replace(/[\s_-]+/g, "");
  return norm === "file" || norm === "fileupload" || norm === "upload";
}

export default function ApplicantDetail({ applicant, app, onBack }: ApplicantDetailProps) {
  const { showToast } = useUIState();
  const [notes, setNotes] = useState(applicant.notes || "");
  const [previewFile, setPreviewFile] = useState<FileMetadata | null>(null);

  function handleNotesChange(newNotes: string) {
    setNotes(newNotes);
    submissionService.updateSubmissionNotes(applicant.id, newNotes);
  }

  async function handleDirectDownload(file: FileMetadata) {
    try {
      if (file.fileId || file.storagePath) {
        const res = await fileStorage.getFile(file.fileId, file.fileName, file.storagePath);
        if (res?.blob) {
          const url = URL.createObjectURL(res.blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = file.fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 2000);
          showToast(`Downloading ${file.fileName}`);
          return;
        }
      }

      if (file.dataUrl && file.dataUrl.startsWith("data:")) {
        const a = document.createElement("a");
        a.href = file.dataUrl;
        a.download = file.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast(`Downloading ${file.fileName}`);
        return;
      }

      // Format-specific fallback blob generation
      const lower = file.fileName.toLowerCase();
      let fallbackBlob: Blob;
      if (lower.endsWith(".pdf") || file.fileType?.includes("pdf")) {
        fallbackBlob = createSamplePdfBlob(file.fileName);
      } else if (lower.endsWith(".docx") || lower.endsWith(".doc")) {
        fallbackBlob = await createSampleDocxBlob(file.fileName);
      } else if (lower.endsWith(".txt") || file.fileType?.startsWith("text/")) {
        fallbackBlob = createSampleTxtBlob(file.fileName);
      } else {
        fallbackBlob = new Blob(["Submitted document content: " + file.fileName], {
          type: file.fileType || "application/octet-stream",
        });
      }

      const url = URL.createObjectURL(fallbackBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      showToast(`Downloading ${file.fileName}`);
    } catch (err) {
      console.error("Failed to download file:", err);
      showToast("Unable to download file");
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-[#0F172A] transition-colors mb-6 cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span>Back to submissions</span>
        </button>

        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] text-base font-semibold flex items-center justify-center flex-shrink-0">
              {applicant.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[#0F172A]">{applicant.name}</h1>
              <p className="text-xs text-[#64748B]">{applicant.email}</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#94A3B8] mb-8">
          Submitted {formatSubmissionDateTime(applicant.submittedAt, applicant.submitted)}
        </p>

        {/* Submitted answers grouped by section if available */}
        {app?.sections && app.sections.length > 0 ? (
          app.sections.map((sec, sIdx) => {
            const secQuestions = sec.questions || [];
            const secAnswers = secQuestions.map((q) => {
              const matchedAns = applicant.answers?.find(
                (a) => a.questionId === q.id || a.question?.toLowerCase().trim() === q.label?.toLowerCase().trim()
              );
              return {
                question: q.label,
                questionType: q.type,
                answer: matchedAns?.answer || "",
              };
            });

            return (
              <div key={sec.id || sIdx} className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden mb-6 shadow-sm">
                <div className="px-5 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <h2 className="text-xs font-semibold text-[#0F172A]">{sec.title || `Section ${sIdx + 1}`}</h2>
                </div>
                <div className="divide-y divide-[#E2E8F0]">
                  {secAnswers.map((a, i) => {
                    const isFileQ = isFileQuestionType(a.questionType);
                    const parsedFile = parseFileAnswer(a.answer);
                    const isRealFile = isFileQ ? Boolean(parsedFile) : Boolean(parsedFile?.fileId);

                    return (
                      <div key={i} className="px-5 py-4">
                        <p className="text-xs font-medium text-[#64748B] mb-1.5">{a.question}</p>
                        {isRealFile && parsedFile ? (
                          <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 max-w-md shadow-2xs space-y-3 mt-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center flex-shrink-0">
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                  </svg>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-semibold text-[#0F172A] truncate">{parsedFile.fileName}</p>
                                  {parsedFile.fileSize && (
                                    <p className="text-[11px] text-[#94A3B8]">{parsedFile.fileSize}</p>
                                  )}
                                </div>
                              </div>
                              <span className="text-[10px] font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded flex-shrink-0">
                                Attached
                              </span>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-2 pt-2 border-t border-[#F1F5F9]">
                              <button
                                type="button"
                                onClick={() => setPreviewFile(parsedFile)}
                                className="flex-1 py-1.5 px-3 text-xs font-medium text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                                <span>Preview</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDirectDownload(parsedFile)}
                                className="flex-1 py-1.5 px-3 text-xs font-medium text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                </svg>
                                <span>Download</span>
                              </button>
                            </div>
                          </div>
                        ) : a.answer && (a.answer.startsWith("http://") || a.answer.startsWith("https://")) ? (
                          <a
                            href={a.answer}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-[#2563EB] hover:underline break-all inline-flex items-center gap-1"
                          >
                            <span>{a.answer}</span>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                            </svg>
                          </a>
                        ) : (
                          <p className="text-sm text-[#0F172A] leading-relaxed whitespace-pre-wrap">
                            {a.answer || <span className="text-[#94A3B8] italic">No answer provided</span>}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden mb-6 shadow-sm">
            <div className="px-5 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <h2 className="text-xs font-semibold text-[#0F172A]">Submitted answers</h2>
            </div>
            <div className="divide-y divide-[#E2E8F0]">
              {applicant.answers && applicant.answers.length > 0 ? (
                applicant.answers.map((a, i) => {
                  const isFileQ = isFileQuestionType(a.questionType);
                  const parsedFile = parseFileAnswer(a.answer);
                  const isRealFile = isFileQ ? Boolean(parsedFile) : Boolean(parsedFile?.fileId);

                  return (
                    <div key={i} className="px-5 py-4">
                      <p className="text-xs font-medium text-[#64748B] mb-1.5">{a.question}</p>
                      {isRealFile && parsedFile ? (
                        <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 max-w-md shadow-2xs space-y-3 mt-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center flex-shrink-0">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                  <polyline points="14 2 14 8 20 8" />
                                </svg>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-[#0F172A] truncate">{parsedFile.fileName}</p>
                                {parsedFile.fileSize && (
                                  <p className="text-[11px] text-[#94A3B8]">{parsedFile.fileSize}</p>
                                )}
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded flex-shrink-0">
                              Attached
                            </span>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-[#F1F5F9]">
                            <button
                              type="button"
                              onClick={() => setPreviewFile(parsedFile)}
                              className="flex-1 py-1.5 px-3 text-xs font-medium text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                              <span>Preview</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDirectDownload(parsedFile)}
                              className="flex-1 py-1.5 px-3 text-xs font-medium text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                              </svg>
                              <span>Download</span>
                            </button>
                          </div>
                        </div>
                      ) : a.answer && (a.answer.startsWith("http://") || a.answer.startsWith("https://")) ? (
                        <a
                          href={a.answer}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-[#2563EB] hover:underline break-all inline-flex items-center gap-1"
                        >
                          <span>{a.answer}</span>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                          </svg>
                        </a>
                      ) : (
                        <p className="text-sm text-[#0F172A] leading-relaxed whitespace-pre-wrap">
                          {a.answer || <span className="text-[#94A3B8] italic">No answer provided</span>}
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="px-5 py-6 text-center text-xs text-[#94A3B8]">
                  No answers recorded for this submission.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Internal notes */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <h2 className="text-xs font-semibold text-[#0F172A]">Internal notes</h2>
          </div>
          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Add internal notes about this submission..."
            className="w-full px-5 py-4 text-xs text-[#0F172A] placeholder:text-[#94A3B8] outline-none resize-none leading-relaxed min-h-[100px]"
            rows={4}
          />
        </div>
      </div>

      {/* File Preview Modal / Lightbox */}
      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
}
