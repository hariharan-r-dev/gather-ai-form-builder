import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "What is Gather?",
    answer:
      "Gather is an AI application builder. You describe what you need to collect, and Gather generates a ready-to-publish application including sections, questions, field types, and helpful instructions.",
  },
  {
    question: "How does Gather create an application?",
    answer:
      "Gather uses AI to translate your natural language description into structured sections, relevant questions, input types, and helpful placeholder text.",
  },
  {
    question: "What can I describe to Gather?",
    answer:
      "You can describe any type of application—job applications, grant proposals, event registrations, speaker submissions, scholarships, and more.",
  },
  {
    question: "Can I edit an application after it is generated?",
    answer:
      "Yes. You can edit any question, section, field type, or validation rule manually in the editor, or use AI to update it for you.",
  },
  {
    question: "Can I preview an application before publishing?",
    answer:
      "Yes. You can preview exactly how your application will look to applicants before making it live.",
  },
  {
    question: "How do I share an application?",
    answer:
      "Once published, Gather generates a unique link that you can share with applicants or embed on your website.",
  },
  {
    question: "Where can I see submissions?",
    answer:
      "All submissions appear in real-time in your Gather dashboard, where you can view individual responses and export data.",
  },
  {
    question: "What happens after someone submits an application?",
    answer:
      "Submissions are securely stored in your dashboard, and you can review responses, check status, and filter candidates anytime.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggleFAQ(idx: number) {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  }

  return (
    <section
      id="faq"
      className="w-full relative flex flex-col items-start shrink-0 self-stretch border-b border-[#E2E8F0] bg-white px-5 sm:px-8 lg:px-[80px] py-16 sm:py-20 lg:py-[96px]"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
        {/* Centered Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2
            className="text-3xl sm:text-4xl lg:text-[44px] leading-tight lg:leading-[57.2px] tracking-tight lg:tracking-[-0.88px] font-medium text-[#0F172B] mb-3"
            style={{
              fontFamily: "Geist, sans-serif",
            }}
          >
            Frequently asked questions
          </h2>
          <p
            className="text-sm sm:text-base text-[#62748E] leading-relaxed"
            style={{
              fontFamily: "Geist, sans-serif",
              fontWeight: 400,
            }}
          >
            Everything you need to know about creating applications with Gather.
          </p>
        </div>

        {/* Accordion Single Card Container */}
        <div className="max-w-3xl w-full bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden divide-y divide-[#F1F5F9]">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={faq.question} className="transition-colors">
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-[#F8FAFD] transition-colors"
                >
                  <span
                    style={{
                      color: "#0F172B",
                      fontFamily: "Geist, sans-serif",
                      fontSize: "14.5px",
                      fontWeight: 600,
                    }}
                  >
                    {faq.question}
                  </span>

                  <span className="flex items-center justify-center flex-shrink-0 w-6 h-6">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#94A3B8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform duration-200 ${
                        isOpen ? "rotate-45 stroke-[#0F172B]" : ""
                      }`}
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div
                    className="px-6 pb-6 pt-0 text-[13.5px] leading-[22px] font-normal text-[#62748E]"
                    style={{
                      fontFamily: "Geist, sans-serif",
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
