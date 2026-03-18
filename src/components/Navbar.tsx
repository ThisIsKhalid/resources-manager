"use client";

import { useState } from "react";
import Link from "next/link";
import { HtmlFile } from "@/lib/resources";
import { FiFolder, FiMenu, FiX, FiFileText } from "react-icons/fi";

export default function Navbar({ files }: { files: HtmlFile[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#061E29]/80 backdrop-blur-xl border-b border-[#1D546D]/50 flex items-center justify-between px-6 z-40 transition-colors duration-300">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-[#1D546D] flex items-center justify-center text-white shadow-lg shadow-[#1D546D]/20">
            <FiFolder className="text-lg text-[#5F9598]" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            Resources Manager
          </span>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-5 py-2.5 bg-[#1D546D] hover:bg-[#5F9598] text-white rounded-lg font-semibold transition-all transform active:scale-95 shadow-md shadow-black/20"
        >
          <FiMenu className="text-lg" />
          <span className="hidden sm:inline">Browse Curated Resources</span>
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
          className={`bg-[#061E29] w-full max-w-lg md:max-w-3xl h-[80vh] md:h-[75vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-out border border-[#1D546D]/60 transform ${
            isModalOpen ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-8 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-[#1D546D]/40 bg-[#061E29]/50">
            <h2 className="text-xl font-bold text-white flex items-center tracking-tight">
              <span className="bg-[#1D546D]/40 text-[#5F9598] p-2.5 rounded-xl mr-3">
                <FiFolder />
              </span>
              Curated Materials
            </h2>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="p-2.5 bg-[#1D546D]/20 hover:bg-[#1D546D]/60 rounded-full transition-colors"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {files.map((file) => (
                  <Link
                    key={file.path}
                    href={`/${file.slug.join("/")}`}
                    onClick={() => setIsModalOpen(false)}
                    className="group flex flex-col p-5 bg-[#1D546D]/10 hover:bg-[#1D546D]/30 rounded-xl transition-all duration-200 border border-[#1D546D]/30 hover:border-[#5F9598]/60 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-[#1D546D]/40 flex items-center justify-center text-[#5F9598]">
                          <FiFileText className="opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="font-semibold text-gray-200 truncate capitalize text-lg">
                          {file.title}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-mono text-gray-400 truncate mt-auto bg-[#061E29] border border-[#1D546D]/40 px-2 py-1 rounded inline-block w-fit max-w-full">
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
