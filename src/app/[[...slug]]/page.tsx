import { getHtmlContent, getHtmlFiles } from "@/lib/resources";
import { FiFileText, FiFolder, FiCode, FiLayout, FiArrowRight, FiZap } from "react-icons/fi";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    const files = getHtmlFiles();
    
    return (
      <div className="w-full h-full overflow-y-auto bg-[#061E29] custom-scrollbar">
        {/* Hero Section */}
        <section className="relative px-6 py-24 md:py-32 overflow-hidden flex flex-col items-center text-center">
          {/* Detailed Ambient Gradients */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1D546D]/30 blur-[100px] rounded-full mix-blend-lighten pointer-events-none"></div>
          <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-[#5F9598]/20 blur-[120px] rounded-full mix-blend-lighten pointer-events-none"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#1D546D]/20 border border-[#1D546D] text-[#5F9598] text-sm font-medium mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#5F9598] animate-pulse"></span>
              <span>Learning & Resource Directory</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-white">
              Explore Our <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5F9598] to-[#1D546D]">
                Curated Materials
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-10 leading-relaxed font-light">
              Browse through a comprehensive library of resources, interactive guides, and documentation designed for you.
            </p>
          </div>
        </section>

        {/* Features / Stats Section */}
        <section className="px-6 py-12 bg-[#061E29]/80 backdrop-blur-sm border-y border-[#1D546D]/40 relative z-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#1D546D]/20 flex items-center justify-center text-[#5F9598] text-2xl shadow-inner border border-[#1D546D]/30">
                <FiZap />
              </div>
              <h3 className="text-xl font-bold text-white">Instant Access</h3>
              <p className="text-gray-400 leading-relaxed">View all documentation and interactive materials instantly with zero loading times.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#1D546D]/20 flex items-center justify-center text-[#5F9598] text-2xl shadow-inner border border-[#1D546D]/30">
                <FiLayout />
              </div>
              <h3 className="text-xl font-bold text-white">Beautifully Crafted</h3>
              <p className="text-gray-400 leading-relaxed">Experience a seamless and visually stunning interface carefully crafted for readability.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#1D546D]/20 flex items-center justify-center text-[#5F9598] text-2xl shadow-inner border border-[#1D546D]/30">
                <FiCode />
              </div>
              <h3 className="text-xl font-bold text-white">Structured Library</h3>
              <p className="text-gray-400 leading-relaxed">Browse gracefully organized directories to find exactly what you need.</p>
            </div>
          </div>
        </section>

        {/* Available Files Section */}
        <section className="px-6 py-20 max-w-6xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Available Resources</h2>
              <p className="text-gray-400 font-medium">Select a project below to preview</p>
            </div>
            <div className="hidden sm:flex items-center space-x-2 bg-[#1D546D]/20 border border-[#1D546D]/50 shadow-sm py-2 px-4 rounded-xl">
              <FiFolder className="text-[#5F9598]" />
              <span className="text-gray-200 font-semibold">{files.length} Resources</span>
            </div>
          </div>

          {files.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-[#1D546D]/10 border border-dashed border-[#1D546D]/50 backdrop-blur-sm">
              <FiFileText className="text-6xl text-[#1D546D] mb-6 mx-auto opacity-50" />
              <h3 className="text-2xl font-semibold text-gray-200 mb-2">No resources available</h3>
              <p className="text-gray-400">Please check back later for exciting educational materials.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {files.map((file) => (
                <Link
                  href={`/${file.slug.join("/")}`}
                  key={file.path}
                  className="group relative flex flex-col p-6 bg-[#061E29] rounded-2xl shadow-sm border border-[#1D546D]/50 hover:border-[#5F9598]/80 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#1D546D]/10 rounded-full blur-[40px] group-hover:bg-[#1D546D]/30 transition-colors pointer-events-none"></div>
                  
                  <div className="w-12 h-12 rounded-xl bg-[#1D546D]/30 text-[#5F9598] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner border border-[#1D546D]/50 relative z-10">
                    <FiFileText className="text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 capitalize line-clamp-1 relative z-10 tracking-tight">{file.title}</h3>
                  <p className="text-sm text-gray-400 mb-6 truncate relative z-10 font-mono bg-[#1D546D]/10 px-2 py-1 rounded w-fit max-w-full border border-[#1D546D]/30">{file.path}</p>
                  
                  <div className="mt-auto flex items-center text-[#5F9598] font-semibold group-hover:text-white transition-colors relative z-10">
                    <span>View Resource</span>
                    <FiArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  const content = getHtmlContent(slug);

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-gray-50 dark:bg-black">
        <div className="p-8 text-center bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-red-100 dark:border-red-900/30">
          <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">The requested HTML file could not be found.</p>
        </div>
      </div>
    );
  }

  // The raw HTML file is served via the API route. We embed it here using an iframe.
  return (
    <iframe
      src={`/api/html/${slug.join("/")}`}
      title={slug.join(" ")}
      className="w-full h-full border-0 bg-white"
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
    />
  );
}
