import { useState } from "react";
import { Submission } from "../types";
import { submissionService } from "../services/submissions/submissionService";

interface ApplicantDetailProps {
  applicant: Submission;
  onBack: () => void;
}

export default function ApplicantDetail({ applicant, onBack }: ApplicantDetailProps) {
  const [notes, setNotes] = useState(applicant.notes || "");

  function handleNotesChange(newNotes: string) {
    setNotes(newNotes);
    submissionService.updateSubmissionNotes(applicant.id, newNotes);
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

        <p className="text-xs text-[#94A3B8] mb-8">Submitted {applicant.submitted}</p>

        {/* Submitted answers */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden mb-6 shadow-sm">
          <div className="px-5 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <h2 className="text-xs font-semibold text-[#0F172A]">Submitted answers</h2>
          </div>
          <div className="divide-y divide-[#E2E8F0]">
            {applicant.answers && applicant.answers.length > 0 ? (
              applicant.answers.map((a, i) => (
                <div key={i} className="px-5 py-4">
                  <p className="text-xs font-medium text-[#64748B] mb-1">{a.question}</p>
                  <p className="text-sm text-[#0F172A] leading-relaxed whitespace-pre-wrap">
                    {a.answer || <span className="text-[#94A3B8] italic">No answer provided</span>}
                  </p>
                </div>
              ))
            ) : (
              <div className="px-5 py-6 text-center text-xs text-[#94A3B8]">
                No answers recorded for this submission.
              </div>
            )}
          </div>
        </div>

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
    </div>
  );
}
