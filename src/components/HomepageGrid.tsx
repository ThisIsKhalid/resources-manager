"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { HtmlFile } from "@/lib/resources";
import { FiFileText, FiFolder, FiArrowRight, FiSearch, FiStar } from "react-icons/fi";

export default function HomepageGrid({ initialFiles }: { initialFiles: HtmlFile[] }) {
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
    if (!searchQuery) return initialFiles;
    const lowerQuery = searchQuery.toLowerCase();
    return initialFiles.filter(f => 
      f.title.toLowerCase().includes(lowerQuery) || 
      (f.description && f.description.toLowerCase().includes(lowerQuery)) ||
      f.category.toLowerCase().includes(lowerQuery) ||
      f.path.toLowerCase().includes(lowerQuery)
    );
  }, [initialFiles, searchQuery]);

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
    <div className="flex flex-col w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Available Resources</h2>
          <p className="text-gray-400 font-medium">Select a project below to preview</p>
        </div>
        
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-[#5F9598]" />
            </div>
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1D546D]/20 border border-[#1D546D]/50 focus:border-[#5F9598] rounded-xl pl-10 pr-4 py-2.5 outline-none transition-colors text-white"
            />
          </div>
          
          <div className="hidden sm:flex items-center space-x-2 bg-[#1D546D]/20 border border-[#1D546D]/50 shadow-sm py-2 px-4 rounded-xl whitespace-nowrap">
            <FiFolder className="text-[#5F9598]" />
            <span className="text-gray-200 font-semibold">{initialFiles.length} Resources</span>
          </div>
        </div>
      </div>

      {filteredFiles.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-[#1D546D]/10 border border-dashed border-[#1D546D]/50 backdrop-blur-sm mt-8">
          <FiSearch className="text-6xl text-[#1D546D] mb-6 mx-auto opacity-50" />
          <h3 className="text-2xl font-semibold text-gray-200 mb-2">
            {initialFiles.length === 0 ? "No resources available" : "No results found"}
          </h3>
          <p className="text-gray-400">
            {initialFiles.length === 0 
              ? "Please check back later for exciting educational materials." 
              : `No resources match "${searchQuery}". Try a different search term.`}
          </p>
        </div>
      ) : (
        <div className="flex flex-col space-y-12">
          {/* Favorites Section */}
          {groupedFiles.favGroup.length > 0 && !searchQuery && (
            <div className="space-y-6">
              <h3 className="text-lg uppercase tracking-wider font-black text-[#5F9598] pl-2 flex items-center border-l-4 border-[#5F9598]">
                <FiStar className="mr-3 fill-current" /> Favorites
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedFiles.favGroup.map((file) => (
                  <FileCard 
                    key={`fav-${file.path}`} 
                    file={file} 
                    isFavorite={true} 
                    onToggleFav={toggleFavorite} 
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Categories */}
          {Object.entries(groupedFiles.groups).sort().map(([category, catFiles]) => (
            <div key={category} className="space-y-6">
              <h3 className="text-lg uppercase tracking-wider font-black text-[#5F9598] pl-2 border-l-4 border-[#1D546D]">
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {catFiles.map((file) => (
                  <FileCard 
                    key={file.path} 
                    file={file} 
                    isFavorite={favorites.includes(file.path)} 
                    onToggleFav={toggleFavorite} 
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FileCard({ 
  file, 
  isFavorite, 
  onToggleFav
}: { 
  file: HtmlFile, 
  isFavorite: boolean, 
  onToggleFav: (e: React.MouseEvent, path: string) => void
}) {
  return (
    <Link
      href={`/${file.slug.join("/")}`}
      className="group relative flex flex-col p-6 bg-[#061E29] rounded-2xl shadow-sm border border-[#1D546D]/50 hover:border-[#5F9598]/80 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#1D546D]/10 rounded-full blur-[40px] group-hover:bg-[#1D546D]/30 transition-colors pointer-events-none"></div>
      
      <button 
        onClick={(e) => onToggleFav(e, file.path)}
        className={`absolute top-6 right-6 z-20 p-2 rounded-full transition-colors ${
          isFavorite 
            ? "text-yellow-400 hover:bg-yellow-400/10" 
            : "text-gray-500 opacity-0 group-hover:opacity-100 hover:text-yellow-400 hover:bg-yellow-400/10"
        }`}
      >
        <FiStar className={`text-xl ${isFavorite ? "fill-current" : ""}`} />
      </button>
      
      <div className="w-12 h-12 rounded-xl bg-[#1D546D]/30 text-[#5F9598] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner border border-[#1D546D]/50 relative z-10 shrink-0">
        <FiFileText className="text-xl" />
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2 capitalize line-clamp-1 relative z-10 tracking-tight pr-8">
        {file.title}
      </h3>
      
      {file.description ? (
        <p className="text-sm text-gray-400 mb-6 line-clamp-2 relative z-10">
          {file.description}
        </p>
      ) : (
        <p className="text-sm text-gray-400 mb-6 truncate relative z-10 font-mono bg-[#1D546D]/10 px-2 py-1 rounded w-fit max-w-full border border-[#1D546D]/30">
          {file.path}
        </p>
      )}
      
      <div className="mt-auto flex items-center justify-between text-[#5F9598] font-semibold group-hover:text-white transition-colors relative z-10 pt-4">
        <span className="flex items-center">
          View Resource
          <FiArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
        </span>
        
        {file.description && (
          <span className="text-xs font-mono text-[#1D546D] truncate bg-[#061E29] border border-[#1D546D]/40 px-2 py-1 rounded inline-block max-w-[120px]">
            {file.slug[file.slug.length - 1]}
          </span>
        )}
      </div>
    </Link>
  );
}
