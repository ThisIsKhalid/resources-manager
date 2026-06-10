"use client";

import { HtmlFile } from "@/lib/resources";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  FiArrowRight,
  FiBookOpen,
  FiCode,
  FiCpu,
  FiFileText,
  FiFolder,
  FiGrid,
  FiLayers,
  FiList,
  FiSearch,
  FiStar,
  FiUsers,
} from "react-icons/fi";

const CATEGORY_CONFIG: Record<
  string,
  { emoji: string; color: string; icon: React.ReactNode }
> = {
  ai: {
    emoji: "🤖",
    color: "from-violet-500/20 to-indigo-500/20",
    icon: <FiCpu className="text-violet-400" />,
  },
  "c++": {
    emoji: "⚙️",
    color: "from-blue-500/20 to-cyan-500/20",
    icon: <FiCode className="text-blue-400" />,
  },
  go: {
    emoji: "🐹",
    color: "from-cyan-500/20 to-teal-500/20",
    icon: <FiCode className="text-cyan-400" />,
  },
  interview: {
    emoji: "💼",
    color: "from-amber-500/20 to-orange-500/20",
    icon: <FiUsers className="text-amber-400" />,
  },
  "system design": {
    emoji: "🏗️",
    color: "from-rose-500/20 to-pink-500/20",
    icon: <FiLayers className="text-rose-400" />,
  },
  uncategorized: {
    emoji: "📁",
    color: "from-gray-500/20 to-slate-500/20",
    icon: <FiFolder className="text-gray-400" />,
  },
};

function getCategoryConfig(category: string) {
  return (
    CATEGORY_CONFIG[category.toLowerCase()] || {
      emoji: "📄",
      color: "from-gray-500/20 to-slate-500/20",
      icon: <FiFileText className="text-gray-400" />,
    }
  );
}

export default function HomepageGrid({
  initialFiles,
}: {
  initialFiles: HtmlFile[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("html-renderer-favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleFavorite = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const isFav = prev.includes(path);
      const next = isFav ? prev.filter((p) => p !== path) : [...prev, path];
      localStorage.setItem("html-renderer-favorites", JSON.stringify(next));
      return next;
    });
  };

  const categories = useMemo(() => {
    const cats = new Set(initialFiles.map((f) => f.category));
    return Array.from(cats).sort();
  }, [initialFiles]);

  const filteredFiles = useMemo(() => {
    let result = initialFiles;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          (f.description && f.description.toLowerCase().includes(q)) ||
          f.category.toLowerCase().includes(q) ||
          f.path.toLowerCase().includes(q),
      );
    }

    if (activeCategory) {
      result = result.filter((f) => f.category === activeCategory);
    }

    return result;
  }, [initialFiles, searchQuery, activeCategory]);

  const groupedFiles = useMemo(() => {
    const groups: Record<string, HtmlFile[]> = {};
    const favGroup: HtmlFile[] = [];

    filteredFiles.forEach((f) => {
      if (favorites.includes(f.path)) favGroup.push(f);
      if (!groups[f.category]) groups[f.category] = [];
      groups[f.category].push(f);
    });

    return { groups, favGroup };
  }, [filteredFiles, favorites]);

  return (
    <div className="flex flex-col w-full">
      {/* ── Stats Bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        <StatCard
          icon={<FiBookOpen className="text-lg" />}
          label="Total Resources"
          value={initialFiles.length}
          color="from-[#1D546D] to-[#5F9598]"
        />
        <StatCard
          icon={<FiFolder className="text-lg" />}
          label="Categories"
          value={categories.length}
          color="from-violet-500/30 to-indigo-500/30"
        />
        <StatCard
          icon={<FiStar className="text-lg fill-current" />}
          label="Favorites"
          value={favorites.length}
          color="from-amber-500/30 to-orange-500/30"
        />
        <StatCard
          icon={<FiFileText className="text-lg" />}
          label="Showing"
          value={filteredFiles.length}
          color="from-emerald-500/30 to-teal-500/30"
        />
      </div>

      {/* ── Category Chips ── */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
        <button
          onClick={() => setActiveCategory(null)}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
            activeCategory === null
              ? "bg-gradient-to-r from-[#1D546D] to-[#5F9598] text-white border-transparent shadow-lg shadow-[#1D546D]/20"
              : "bg-white/[0.03] text-gray-400 border-[#1D546D]/30 hover:bg-white/[0.06] hover:text-white"
          }`}
        >
          All
        </button>
        {categories.map((cat) => {
          const config = getCategoryConfig(cat);
          const isActive = activeCategory === cat;
          const count = initialFiles.filter((f) => f.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(isActive ? null : cat)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border capitalize ${
                isActive
                  ? "bg-gradient-to-r from-[#1D546D] to-[#5F9598] text-white border-transparent shadow-lg shadow-[#1D546D]/20"
                  : "bg-white/[0.03] text-gray-400 border-[#1D546D]/30 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              <span>{config.emoji}</span>
              {cat}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-white/20" : "bg-[#1D546D]/30 text-[#5F9598]/80"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Search & Controls ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5F9598] text-sm" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.04] border border-[#1D546D]/40 focus:border-[#5F9598]/70 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <FiSearch className="text-sm" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-white/[0.04] border border-[#1D546D]/40 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 transition-colors ${
                viewMode === "grid"
                  ? "bg-[#1D546D]/40 text-white"
                  : "text-gray-500 hover:text-white"
              }`}
              aria-label="Grid view"
            >
              <FiGrid className="text-base" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 transition-colors ${
                viewMode === "list"
                  ? "bg-[#1D546D]/40 text-white"
                  : "text-gray-500 hover:text-white"
              }`}
              aria-label="List view"
            >
              <FiList className="text-base" />
            </button>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-[#1D546D]/30">
            <FiFolder className="text-[#5F9598] text-sm" />
            <span className="text-xs font-medium text-gray-300">
              {filteredFiles.length} resource
              {filteredFiles.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      {filteredFiles.length === 0 ? (
        <div className="p-12 sm:p-16 text-center rounded-3xl bg-white/[0.02] border border-dashed border-[#1D546D]/40">
          <div className="w-16 h-16 rounded-2xl bg-[#1D546D]/15 flex items-center justify-center mx-auto mb-5">
            <FiSearch className="text-3xl text-[#5F9598]/50" />
          </div>
          <h3 className="text-xl font-semibold text-gray-200 mb-2">
            {initialFiles.length === 0
              ? "No resources yet"
              : "No results found"}
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            {initialFiles.length === 0
              ? "Check back soon for curated learning materials."
              : `No resources match "${searchQuery}". Try a different search term.`}
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Favorites */}
          {groupedFiles.favGroup.length > 0 &&
            !searchQuery &&
            !activeCategory && (
              <CategorySection
                title="Favorites"
                emoji="⭐"
                count={groupedFiles.favGroup.length}
                files={groupedFiles.favGroup}
                favorites={favorites}
                onToggleFav={toggleFavorite}
                viewMode={viewMode}
              />
            )}

          {/* Categories */}
          {Object.entries(groupedFiles.groups)
            .sort()
            .map(([category, catFiles]) => {
              const config = getCategoryConfig(category);
              return (
                <CategorySection
                  key={category}
                  title={category}
                  emoji={config.emoji}
                  count={catFiles.length}
                  files={catFiles}
                  favorites={favorites}
                  onToggleFav={toggleFavorite}
                  viewMode={viewMode}
                />
              );
            })}
        </div>
      )}
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="p-4 rounded-2xl bg-white/[0.03] border border-[#1D546D]/30 hover:border-[#1D546D]/60 transition-colors">
      <div
        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 text-white`}
      >
        {icon}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

/* ── Category Section ── */
function CategorySection({
  title,
  emoji,
  count,
  files,
  favorites,
  onToggleFav,
  viewMode,
}: {
  title: string;
  emoji: string;
  count: number;
  files: HtmlFile[];
  favorites: string[];
  onToggleFav: (e: React.MouseEvent, path: string) => void;
  viewMode: "grid" | "list";
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="text-xl">{emoji}</span>
        <h2 className="text-lg font-bold text-white capitalize">{title}</h2>
        <span className="text-xs font-mono bg-[#1D546D]/25 text-[#5F9598] px-2 py-0.5 rounded-full">
          {count}
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-[#1D546D]/50 to-transparent" />
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            : "flex flex-col gap-3"
        }
      >
        {files.map((file) =>
          viewMode === "grid" ? (
            <GridCard
              key={file.path}
              file={file}
              isFavorite={favorites.includes(file.path)}
              onToggleFav={onToggleFav}
            />
          ) : (
            <ListCard
              key={file.path}
              file={file}
              isFavorite={favorites.includes(file.path)}
              onToggleFav={onToggleFav}
            />
          ),
        )}
      </div>
    </div>
  );
}

/* ── Grid Card ── */
function GridCard({
  file,
  isFavorite,
  onToggleFav,
}: {
  file: HtmlFile;
  isFavorite: boolean;
  onToggleFav: (e: React.MouseEvent, path: string) => void;
}) {
  const config = getCategoryConfig(file.category);

  return (
    <Link
      href={`/${file.slug.join("/")}`}
      className="group relative flex flex-col p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-[#1D546D]/30 hover:border-[#5F9598]/50 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
    >
      {/* Subtle glow */}
      <div
        className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${config.color} rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
      />

      {/* Header row */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="w-11 h-11 rounded-xl bg-[#1D546D]/25 flex items-center justify-center text-[#5F9598] group-hover:bg-[#1D546D]/40 group-hover:scale-105 transition-all shadow-inner border border-[#1D546D]/30">
          <FiFileText className="text-lg" />
        </div>
        <button
          onClick={(e) => onToggleFav(e, file.path)}
          className={`p-2 rounded-lg transition-colors ${
            isFavorite
              ? "text-yellow-400 hover:bg-yellow-400/10"
              : "text-gray-600 opacity-0 group-hover:opacity-100 hover:text-yellow-400 hover:bg-yellow-400/10"
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <FiStar className={`text-sm ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Title & description */}
      <h3 className="text-base font-bold text-white mb-1.5 capitalize line-clamp-1 relative z-10 group-hover:text-[#5F9598] transition-colors">
        {file.title}
      </h3>
      {file.description ? (
        <p className="text-xs text-gray-400 mb-5 line-clamp-2 relative z-10 leading-relaxed">
          {file.description}
        </p>
      ) : (
        <p className="text-xs text-gray-500 mb-5 truncate relative z-10 font-mono bg-white/[0.03] px-2 py-1 rounded-md w-fit max-w-full border border-[#1D546D]/20">
          {file.path}
        </p>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between text-[#5F9598] font-semibold text-sm group-hover:text-white transition-colors relative z-10 pt-3 border-t border-[#1D546D]/20">
        <span className="flex items-center gap-1.5">
          View
          <FiArrowRight className="transform group-hover:translate-x-1 transition-transform text-xs" />
        </span>
        <span className="text-[10px] font-mono text-gray-500 truncate max-w-[100px] bg-white/[0.03] px-2 py-0.5 rounded border border-[#1D546D]/20">
          {file.slug[file.slug.length - 1]}
        </span>
      </div>
    </Link>
  );
}

/* ── List Card ── */
function ListCard({
  file,
  isFavorite,
  onToggleFav,
}: {
  file: HtmlFile;
  isFavorite: boolean;
  onToggleFav: (e: React.MouseEvent, path: string) => void;
}) {
  return (
    <Link
      href={`/${file.slug.join("/")}`}
      className="group flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-[#1D546D]/30 hover:border-[#5F9598]/50 transition-all duration-200"
    >
      <div className="w-10 h-10 rounded-lg bg-[#1D546D]/25 flex items-center justify-center text-[#5F9598] shrink-0 group-hover:bg-[#1D546D]/40 transition-colors">
        <FiFileText className="text-base" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-200 truncate capitalize group-hover:text-white transition-colors">
          {file.title}
        </p>
        {file.description && (
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {file.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={(e) => onToggleFav(e, file.path)}
          className={`p-1.5 rounded-lg transition-colors ${
            isFavorite
              ? "text-yellow-400 hover:bg-yellow-400/10"
              : "text-gray-600 opacity-0 group-hover:opacity-100 hover:text-yellow-400 hover:bg-yellow-400/10"
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <FiStar className={`text-sm ${isFavorite ? "fill-current" : ""}`} />
        </button>
        <FiArrowRight className="text-gray-600 group-hover:text-[#5F9598] transition-colors" />
      </div>
    </Link>
  );
}
