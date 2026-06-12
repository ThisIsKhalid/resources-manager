import HomepageGrid from "@/components/HomepageGrid";
import { getHtmlContent, getHtmlFiles } from "@/lib/resources";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    const files = getHtmlFiles();

    return <HomepageGrid initialFiles={files} />;
  }

  const content = getHtmlContent(slug);

  if (!content) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-[#f6f1e8] px-4">
        <div className="w-full max-w-sm rounded-[8px] border border-[#ded2c0] bg-[#fffaf0] p-8 text-center shadow-[0_24px_70px_rgba(83,64,42,0.12)] sm:p-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[6px] bg-[#201a14]">
            <span className="text-2xl font-bold text-[#fffaf0]">404</span>
          </div>
          <h1 className="mb-2 text-2xl font-semibold text-[#201a14]">
            Not Found
          </h1>
          <p className="mb-6 text-sm text-[#786a59]">
            The requested resource could not be found.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#201a14] px-5 py-2.5 text-sm font-semibold text-[#fffaf0] transition hover:bg-[#3a3027]"
          >
            <FiArrowRight className="rotate-180 text-sm" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-[#201a14]">
      <iframe
        src={`/api/html/${slug.join("/")}`}
        title={slug.join(" ")}
        className="w-full h-full border-0 bg-white"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
}
