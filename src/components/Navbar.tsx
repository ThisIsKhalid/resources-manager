"use client";

import { useState } from "react";
import Link from "next/link";
import { HtmlFile } from "@/lib/resources";
import { FiFolder, FiMenu, FiX, FiFileText } from "react-icons/fi";

export default function Navbar({ files }: { files: HtmlFile[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white/70 dark:bg-black/70 backdrop-blur-md border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-6 z-40 transition-colors duration-300">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <FiFolder className="text-lg" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            HTML Renderer
          </span>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition-transform transform active:scale-95 shadow-md shadow-blue-500/20"
        >
          <FiMenu className="text-lg" />
          <span className="hidden sm:inline">Browse Files</span>
        </button>
      </nav>

      {/* Modal Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300 ${
          isModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsModalOpen(false)}
      >
        {/* Modal Content */}
        <div 
          className={`bg-white dark:bg-zinc-900 w-full max-w-lg md:max-w-2xl h-[80vh] md:h-[70vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-out border border-white/20 transform ${
            isModalOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 p-2 rounded-lg mr-3">
                <FiFolder />
              </span>
              Available Projects
            </h2>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-full transition-colors"
            >
              <FiX className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {files.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 space-y-4">
                <FiFolder className="text-6xl opacity-30" />
                <p>No HTML files found in src/resources</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {files.map((file) => (
                  <Link
                    key={file.path}
                    href={`/${file.slug.join("/")}`}
                    onClick={() => setIsModalOpen(false)}
                    className="group flex flex-col p-4 bg-gray-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-500/30"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <FiFileText className="text-blue-500 opacity-70 group-hover:opacity-100 transition-opacity" />
                      <span className="font-medium text-gray-800 dark:text-gray-200 truncate capitalize">
                        {file.title}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 truncate mt-auto">
                      {file.path}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
