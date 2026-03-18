import { getHtmlContent } from "@/lib/resources";
import { FiFileText } from "react-icons/fi";

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-black">
        <div className="p-12 text-center rounded-3xl bg-white/50 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-2xl transform transition-transform hover:scale-[1.02] duration-300">
          <FiFileText className="text-6xl text-blue-500 mb-6 mx-auto opacity-80" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
            HTML Renderer
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-lg leading-relaxed">
            Click the <span className="font-semibold text-gray-700 dark:text-gray-200">Browse Files</span> button in the navigation bar to select and view an HTML file from the resources folder.
          </p>
        </div>
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
