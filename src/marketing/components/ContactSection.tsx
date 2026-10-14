import { useState } from "react";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 400);
  }

  return (
    <section
      id="contact"
      className="w-full relative flex flex-col items-start shrink-0 self-stretch border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 sm:px-8 lg:px-[80px] py-16 sm:py-20 lg:py-[96px]"
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column: Heading & Copy */}
        <div className="lg:col-span-6 flex flex-col justify-start">
          <h2
            className="text-3xl sm:text-4xl lg:text-[44px] leading-tight lg:leading-[57.2px] tracking-tight lg:tracking-[-0.88px] font-medium text-[#0F172B] mb-4 sm:mb-6"
            style={{
              fontFamily: "Geist, sans-serif",
            }}
          >
            Have a question? <br />
            Let&apos;s talk.
          </h2>

          <p
            className="text-sm sm:text-base text-[#62748E] leading-relaxed max-w-[440px]"
            style={{
              fontFamily: "Geist, sans-serif",
              fontWeight: 400,
            }}
          >
            Have feedback, a question, or need help with Gather? Send us a message and we&apos;ll get back to you.
          </p>
        </div>

        {/* Right Column: White Contact Form Card */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end w-full">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-xs w-full max-w-[540px]">
            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto font-bold">
                  ✓
                </div>
                <h3
                  style={{
                    color: "#0F172B",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                >
                  Message sent.
                </h3>
                <p
                  style={{
                    color: "#64748B",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "13px",
                  }}
                >
                  Thanks for reaching out. We&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    style={{
                      color: "#0F172B",
                      fontFamily: "Geist, sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    style={{
                      fontFamily: "Geist, sans-serif",
                    }}
                    className="w-full px-4 py-3 text-[13px] bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all placeholder:text-[#94A3B8]"
                  />
                </div>

                <div>
                  <label
                    style={{
                      color: "#0F172B",
                      fontFamily: "Geist, sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={{
                      fontFamily: "Geist, sans-serif",
                    }}
                    className="w-full px-4 py-3 text-[13px] bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all placeholder:text-[#94A3B8]"
                  />
                </div>

                <div>
                  <label
                    style={{
                      color: "#0F172B",
                      fontFamily: "Geist, sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us how we can help..."
                    style={{
                      fontFamily: "Geist, sans-serif",
                    }}
                    className="w-full px-4 py-3 text-[13px] bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all resize-none placeholder:text-[#94A3B8] h-[120px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    fontFamily: "Geist, sans-serif",
                  }}
                  className="w-full py-3.5 px-4 bg-[#155DFC] hover:bg-[#124bce] disabled:bg-[#93C5FD] text-white text-[13.5px] font-medium rounded-xl transition-all shadow-2xs cursor-pointer flex items-center justify-center"
                >
                  {loading ? "Sending..." : "Send message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
