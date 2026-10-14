import { Link, useLocation, useNavigate } from "react-router-dom";

export default function MarketingFooter() {
  const location = useLocation();
  const navigate = useNavigate();

  function scrollToContact(e: React.MouseEvent) {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/#contact");
      setTimeout(() => {
        const el = document.getElementById("contact");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      const el = document.getElementById("contact");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  return (
    <footer
      className="w-full relative flex flex-col items-start shrink-0 self-stretch border-t border-white/10 bg-[#0F172B] px-5 sm:px-8 lg:px-[80px] py-8"
    >
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left: Gather Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-white hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-2xs">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
              <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
              <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
              <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
            </svg>
          </div>
          <span
            style={{
              color: "#FFFFFF",
              fontFamily: "Geist, sans-serif",
              fontSize: "17px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Gather
          </span>
        </Link>

        {/* Right: Navigation Links */}
        <nav className="flex flex-wrap items-center justify-center gap-7 sm:gap-9">
          <Link
            to="/blog"
            style={{
              color: "#8FA0B8",
              fontFamily: "Geist, sans-serif",
              fontSize: "13.5px",
              fontWeight: 400,
            }}
            className="hover:text-white transition-colors"
          >
            Blog
          </Link>
          <Link
            to="/whats-new"
            style={{
              color: "#8FA0B8",
              fontFamily: "Geist, sans-serif",
              fontSize: "13.5px",
              fontWeight: 400,
            }}
            className="hover:text-white transition-colors"
          >
            What&apos;s new
          </Link>
          <Link
            to="/terms"
            style={{
              color: "#8FA0B8",
              fontFamily: "Geist, sans-serif",
              fontSize: "13.5px",
              fontWeight: 400,
            }}
            className="hover:text-white transition-colors"
          >
            Terms
          </Link>
          <Link
            to="/legal"
            style={{
              color: "#8FA0B8",
              fontFamily: "Geist, sans-serif",
              fontSize: "13.5px",
              fontWeight: 400,
            }}
            className="hover:text-white transition-colors"
          >
            Legal policy
          </Link>
          <a
            href="#contact"
            onClick={scrollToContact}
            style={{
              color: "#8FA0B8",
              fontFamily: "Geist, sans-serif",
              fontSize: "13.5px",
              fontWeight: 400,
            }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Contact us
          </a>
        </nav>
      </div>
    </footer>
  );
}
