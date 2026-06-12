import HomepageGrid from "@/components/HomepageGrid";
import { getHtmlContent, getHtmlFiles } from "@/lib/resources";
import Link from "next/link";
import {
  FiArrowRight,
  FiBookOpen,
  FiCode,
  FiLayout,
  FiStar,
  FiZap,
} from "react-icons/fi";

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    const files = getHtmlFiles();

    return (
      <div className="w-full h-full overflow-y-auto bg-teal-dark custom-scrollbar">
        {/* ── Hero Section ── */}
        <section className="relative px-4 sm:px-6 pt-20 pb-16 sm:pt-28 sm:pb-20 overflow-hidden flex flex-col items-center text-center">
          {/* Ambient gradients */}
          <div className="absolute top-[-20%] left-[-15%] w-[50%] h-[50%] bg-teal-mid/25 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-[10%] right-[-15%] w-[40%] h-[60%] bg-teal-light/15 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[30%] bg-teal-mid/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-mid/20 border border-[#1D546D]/60 text-[#5F9598] text-xs sm:text-sm font-medium mb-6 sm:mb-8">
              <FiStar className="text-[#5F9598] fill-current" />
              <span>Learning & Resource Directory</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 sm:mb-6 text-white leading-[1.1]">
              Explore Our
              <br className="hidden sm:block" />{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5F9598] via-[#1D546D] to-[#5F9598] bg-[length:200%_auto] animate-gradient">
                Curated Materials
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-xl mb-8 sm:mb-10 leading-relaxed font-light px-4">
              Browse through a comprehensive library of resources, interactive
              guides, and documentation designed for your growth.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
              <a
                href="#resources"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#1D546D] to-[#5F9598] hover:from-[#5F9598] hover:to-[#1D546D] transition-all shadow-lg shadow-[#1D546D]/25 active:scale-[0.97]"
              >
                <FiBookOpen className="text-base" />
                Browse Resources
              </a>
              <span className="text-xs text-gray-500 font-mono">
                {files.length} files available
              </span>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="px-4 sm:px-6 py-10 sm:py-12 border-y border-[#1D546D]/25 relative z-10">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <FeatureCard
              icon={<FiZap />}
              title="Instant Access"
              description="View all documentation and interactive materials with zero loading times."
            />
            <FeatureCard
              icon={<FiLayout />}
              title="Beautifully Crafted"
              description="Experience a seamless interface carefully crafted for readability."
            />
            <FeatureCard
              icon={<FiCode />}
              title="Structured Library"
              description="Browse organized directories to find exactly what you need."
            />
          </div>
        </section>

        {/* ── Resources Grid ── */}
        <section
          id="resources"
          className="px-4 sm:px-6 py-12 sm:py-16 max-w-6xl mx-auto relative z-10 w-full flex-1"
        >
          <HomepageGrid initialFiles={files} />
        </section>
      </div>
    );
  }

  const content = getHtmlContent(slug);

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-teal-dark px-4">
        <div className="p-8 sm:p-10 text-center bg-white/[0.03] rounded-3xl shadow-xl border border-[#1D546D]/30 max-w-sm w-full">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-5">
            <span className="text-3xl font-bold text-red-400">404</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Not Found</h1>
          <p className="text-gray-400 text-sm mb-6">
            The requested resource could not be found.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#1D546D] hover:bg-teal-light transition-colors"
          >
            <FiArrowRight className="rotate-180 text-sm" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-teal-dark">
      <iframe
        src={`/api/html/${slug.join("/")}`}
        title={slug.join(" ")}
        className="w-full h-full border-0 bg-white"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-5 sm:p-6 space-y-3 rounded-2xl bg-white/2 border border-teal-mid/20 hover:border-teal-mid/50 transition-colors">
      <div className="w-12 h-12 rounded-xl bg-teal-mid/20 flex items-center justify-center text-teal-light text-xl border border-teal-mid/30">
        {icon}
      </div>
      <h3 className="text-base font-bold text-white">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
