"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { HtmlFile } from "@/lib/resources";
import { FiFolder, FiMenu, FiX, FiFileText, FiSearch, FiStar } from "react-icons/fi";

export default function Navbar({ files }: { files: HtmlFile[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  
  useEffect(() => {
    const saved = localStorage.getItem("html-renderer-favorites");
    if (saved) {
      try { setFavorites(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const toggleFavorite = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setFavorites(prev => {
      const isFav = prev.includes(path);
      const next = isFav ? prev.filter(p => p !== path) : [...prev, path];
      localStorage.setItem("html-renderer-favorites", JSON.stringify(next));
      return next;
    });
  };

  const filteredFiles = useMemo(() => {
    if (!searchQuery) return files;
    const lowerQuery = searchQuery.toLowerCase();
    return files.filter(f => 
      f.title.toLowerCase().includes(lowerQuery) || 
      (f.description && f.description.toLowerCase().includes(lowerQuery)) ||
      f.category.toLowerCase().includes(lowerQuery) ||
      f.path.toLowerCase().includes(lowerQuery)
    );
  }, [files, searchQuery]);

  const groupedFiles = useMemo(() => {
    const groups: Record<string, HtmlFile[]> = {};
    const favGroup: HtmlFile[] = [];
    
    filteredFiles.forEach(f => {
      if (favorites.includes(f.path)) {
        favGroup.push(f);
      }
      
      if (!groups[f.category]) {
        groups[f.category] = [];
      }
      groups[f.category].push(f);
    });
    
    return { groups, favGroup };
  }, [filteredFiles, favorites]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#061E29]/80 backdrop-blur-xl border-b border-[#1D546D]/50 flex items-center justify-between px-6 z-40 transition-colors duration-300">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-[#1D546D] flex items-center justify-center text-white shadow-lg shadow-[#1D546D]/20">
            <FiFolder className="text-lg text-[#5F9598]" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            Resources Manager
          </span>
        </Link>
        
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
          <div className="flex flex-col p-6 border-b border-[#1D546D]/40 bg-[#061E29]/50 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center tracking-tight">
                <span className="bg-[#1D546D]/40 text-[#5F9598] p-2.5 rounded-xl mr-3">
                  <FiFolder />
                </span>
                Curated Materials
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2.5 bg-[#1D546D]/20 hover:bg-[#1D546D]/60 rounded-full transition-colors hidden sm:block"
              >
                <FiX className="text-gray-300" />
              </button>
            </div>
            
            <div className="relative w-full text-gray-300">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-[#5F9598]" />
              </div>
              <input
                type="text"
                placeholder="Search resources, categories, descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1D546D]/20 border border-[#1D546D]/50 focus:border-[#5F9598] rounded-xl pl-10 pr-4 py-2.5 outline-none transition-colors"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {filteredFiles.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                <FiSearch className="text-6xl opacity-30 text-[#5F9598]" />
                <p>No resources found matching your search</p>
              </div>
            ) : (
              <div className="flex flex-col space-y-8 pb-4">
                {/* Favorites Section */}
                {groupedFiles.favGroup.length > 0 && !searchQuery && (
                  <div className="space-y-4">
                    <h3 className="text-sm uppercase tracking-wider font-bold text-[#5F9598] pl-2 flex items-center">
                      <FiStar className="mr-2 fill-current" /> Favorites
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {groupedFiles.favGroup.map((file) => (
                        <FileCard 
                          key={`fav-${file.path}`} 
                          file={file} 
                          isFavorite={true} 
                          onToggleFav={toggleFavorite} 
                          onClick={() => setIsModalOpen(false)} 
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Categories */}
                {Object.entries(groupedFiles.groups).sort().map(([category, catFiles]) => (
                  <div key={category} className="space-y-4">
                    <h3 className="text-sm uppercase tracking-wider font-bold text-[#5F9598] pl-2">
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {catFiles.map((file) => (
                        <FileCard 
                          key={file.path} 
                          file={file} 
                          isFavorite={favorites.includes(file.path)} 
                          onToggleFav={toggleFavorite} 
                          onClick={() => setIsModalOpen(false)} 
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function FileCard({ 
  file, 
  isFavorite, 
  onToggleFav, 
  onClick 
}: { 
  file: HtmlFile, 
  isFavorite: boolean, 
  onToggleFav: (e: React.MouseEvent, path: string) => void,
  onClick: () => void 
}) {
  return (
    <Link
      href={`/${file.slug.join("/")}`}
      onClick={onClick}
      className="group flex flex-col p-5 bg-[#1D546D]/10 hover:bg-[#1D546D]/30 rounded-xl transition-all duration-200 border border-[#1D546D]/30 hover:border-[#5F9598]/60 shadow-sm hover:shadow-md relative overflow-hidden"
    >
      <button 
        onClick={(e) => onToggleFav(e, file.path)}
        className={`absolute top-4 right-4 z-20 p-2 rounded-full transition-colors ${
          isFavorite 
            ? "text-yellow-400 hover:bg-yellow-400/10" 
            : "text-gray-500 opacity-0 group-hover:opacity-100 hover:text-yellow-400 hover:bg-yellow-400/10"
        }`}
      >
        <FiStar className={isFavorite ? "fill-current" : ""} />
      </button>
      
      <div className="flex items-center justify-between mb-3 pr-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[#1D546D]/40 flex items-center justify-center text-[#5F9598] shrink-0">
            <FiFileText className="opacity-80 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-semibold text-gray-200 truncate capitalize text-lg">
            {file.title}
          </span>
        </div>
      </div>
      
      {file.description ? (
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {file.description}
        </p>
      ) : null}
      
      <span className="text-xs font-mono text-[#5F9598] truncate mt-auto bg-[#061E29] border border-[#1D546D]/40 px-2 py-1 rounded inline-block w-fit max-w-full">
        {file.slug[file.slug.length - 1]}
      </span>
    </Link>
  );
}
