"use client";

import { HtmlFile } from "@/lib/resources";
import gsap from "gsap";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiArrowRight,
  FiBookOpen,
  FiBookmark,
  FiCheck,
  FiFileText,
  FiGrid,
  FiList,
  FiSearch,
  FiStar,
} from "react-icons/fi";

const CATEGORY_TONES = [
  "border-[#d8c7a0] bg-[#fffaf0] text-[#6f4f1f]",
  "border-[#b7cec6] bg-[#f3fbf8] text-[#315f55]",
  "border-[#c7c1df] bg-[#f7f5ff] text-[#51467f]",
  "border-[#e8b9a8] bg-[#fff6f1] text-[#8a432d]",
  "border-[#b8c7df] bg-[#f4f8ff] text-[#34557d]",
];

function categoryTone(category: string) {
  const total = category
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return CATEGORY_TONES[total % CATEGORY_TONES.length];
}

export default function HomepageGrid({
  initialFiles,
}: {
  initialFiles: HtmlFile[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(
        localStorage.getItem("html-renderer-favorites") || "[]",
      );
    } catch {
      return [];
    }
  });

  const heroRef = useRef<HTMLElement>(null);
  const shelfRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(
    () => Array.from(new Set(initialFiles.map((file) => file.category))).sort(),
    [initialFiles],
  );

  const filteredFiles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return initialFiles.filter((file) => {
      const matchesSearch =
        !query ||
        file.title.toLowerCase().includes(query) ||
        file.description?.toLowerCase().includes(query) ||
        file.category.toLowerCase().includes(query) ||
        file.path.toLowerCase().includes(query);

      const matchesCategory =
        !activeCategory || file.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [activeCategory, initialFiles, searchQuery]);

  const featuredFile = filteredFiles[0] ?? initialFiles[0];
  const groupedFiles = useMemo(() => {
    return filteredFiles.reduce<Record<string, HtmlFile[]>>((groups, file) => {
      groups[file.category] = groups[file.category] || [];
      groups[file.category].push(file);
      return groups;
    }, {});
  }, [filteredFiles]);

  const toggleFavorite = (event: React.MouseEvent, path: string) => {
    event.preventDefault();
    event.stopPropagation();

    setFavorites((current) => {
      const next = current.includes(path)
        ? current.filter((item) => item !== path)
        : [...current, path];
      localStorage.setItem("html-renderer-favorites", JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    if (!heroRef.current) return;

    const context = gsap.context(() => {
      gsap.from(".home-reveal", {
        y: 22,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
      });

      gsap.to(".reading-line", {
        scaleX: 1,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.35,
      });

      gsap.to(".quiet-page", {
        y: -10,
        rotate: 0.6,
        duration: 4.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.24,
      });
    }, heroRef);

    return () => context.revert();
  }, []);

  useEffect(() => {
    if (!shelfRef.current) return;

    const cards = shelfRef.current.querySelectorAll(".resource-card");
    gsap.fromTo(
      cards,
      { y: 14, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.45,
        ease: "power2.out",
        stagger: 0.035,
        overwrite: true,
      },
    );
  }, [filteredFiles, viewMode]);

  return (
    <div className="min-h-full bg-[#f6f1e8] text-[#201a14]">
      <section
        ref={heroRef}
        className="relative overflow-hidden px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-16"
      >
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <div className="home-reveal mb-5 inline-flex items-center gap-2 rounded-full border border-[#d8c7a0] bg-[#fffaf0]/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#7b6138]">
              <FiBookOpen />
              Reading desk
            </div>

            <h1 className="home-reveal text-4xl font-semibold leading-[1.05] tracking-tight text-[#201a14] sm:text-6xl lg:text-7xl">
              A calmer place to collect what you are learning.
            </h1>

            <div className="reading-line home-reveal mt-6 h-px w-48 origin-left scale-x-0 bg-[#201a14]" />

            <p className="home-reveal mt-6 max-w-xl text-base leading-8 text-[#665a4d] sm:text-lg">
              Browse focused guides, roadmaps, and reference notes in a quiet
              interface built for reading first.
            </p>

            <div className="home-reveal mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#library"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#201a14] px-5 py-3 text-sm font-semibold text-[#fffaf0] shadow-[0_14px_35px_rgba(32,26,20,0.18)] transition hover:-translate-y-0.5 hover:bg-[#3a3027]"
              >
                Start reading
                <FiArrowRight />
              </a>
              {featuredFile && (
                <Link
                  href={`/${featuredFile.slug.join("/")}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d5c8b5] bg-white/50 px-5 py-3 text-sm font-semibold text-[#3a3027] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Continue with first note
                </Link>
              )}
            </div>
          </div>

          <div className="home-reveal relative min-h-[360px] lg:min-h-[520px]">
            <div className="absolute inset-x-8 bottom-8 h-12 rounded-[50%] bg-[#8f7658]/20 blur-2xl" />
            <div className="quiet-page absolute left-4 top-8 w-[72%] rounded-[6px] border border-[#d6c8b3] bg-[#fffdf8] p-6 shadow-[0_30px_90px_rgba(84,63,38,0.16)]">
              <div className="mb-8 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a7a4c]">
                  Library
                </span>
                <FiBookmark className="text-[#9a7a4c]" />
              </div>
              <div className="space-y-3">
                <div className="h-3 w-10/12 rounded-full bg-[#d9cbb9]" />
                <div className="h-3 w-8/12 rounded-full bg-[#eadfce]" />
                <div className="h-3 w-11/12 rounded-full bg-[#eadfce]" />
              </div>
              <div className="mt-10 grid grid-cols-2 gap-3">
                <MiniMetric label="Notes" value={initialFiles.length} />
                <MiniMetric label="Shelves" value={categories.length} />
              </div>
            </div>

            <div className="quiet-page absolute bottom-4 right-1 w-[72%] rounded-[6px] border border-[#d6c8b3] bg-[#fbf4e7] p-6 shadow-[0_28px_80px_rgba(84,63,38,0.14)]">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#7b6138]">
                Focus queue
              </p>
              <div className="space-y-4">
                {initialFiles.slice(0, 4).map((file) => (
                  <div key={file.path} className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#201a14] text-[10px] text-white">
                      <FiCheck />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold capitalize text-[#201a14]">
                        {file.title}
                      </p>
                      <p className="text-xs text-[#867768]">{file.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="library"
        className="border-t border-[#ded2c0] bg-[#fffaf0] px-4 py-8 sm:px-6 sm:py-10"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#90724c]">
                Resource shelf
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#201a14] sm:text-3xl">
                Choose a note and settle in.
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative block sm:w-80">
                <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8d7d69]" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search notes"
                  className="h-12 w-full rounded-full border border-[#d7c9b6] bg-white pl-11 pr-4 text-sm text-[#201a14] outline-none transition placeholder:text-[#a59683] focus:border-[#201a14]"
                />
              </label>

              <div className="grid h-12 grid-cols-2 rounded-full border border-[#d7c9b6] bg-white p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex w-10 items-center justify-center rounded-full transition ${
                    viewMode === "grid"
                      ? "bg-[#201a14] text-white"
                      : "text-[#8d7d69] hover:text-[#201a14]"
                  }`}
                  aria-label="Grid view"
                >
                  <FiGrid />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex w-10 items-center justify-center rounded-full transition ${
                    viewMode === "list"
                      ? "bg-[#201a14] text-white"
                      : "text-[#8d7d69] hover:text-[#201a14]"
                  }`}
                  aria-label="List view"
                >
                  <FiList />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <CategoryButton
              active={!activeCategory}
              label="All"
              count={initialFiles.length}
              onClick={() => setActiveCategory(null)}
            />
            {categories.map((category) => (
              <CategoryButton
                key={category}
                active={activeCategory === category}
                label={category}
                count={
                  initialFiles.filter((file) => file.category === category)
                    .length
                }
                onClick={() =>
                  setActiveCategory(
                    activeCategory === category ? null : category,
                  )
                }
              />
            ))}
          </div>

          <div className="flex items-center justify-between border-y border-[#eadfce] py-3 text-sm text-[#786a59]">
            <span>
              Showing {filteredFiles.length} of {initialFiles.length} resources
            </span>
            <span>{favorites.length} saved</span>
          </div>

          <div ref={shelfRef} className="space-y-10">
            {filteredFiles.length === 0 ? (
              <div className="rounded-[8px] border border-dashed border-[#d7c9b6] bg-white/55 px-6 py-16 text-center">
                <FiSearch className="mx-auto mb-4 text-3xl text-[#a59683]" />
                <h3 className="text-lg font-semibold text-[#201a14]">
                  No notes found
                </h3>
                <p className="mt-2 text-sm text-[#786a59]">
                  Try another phrase or clear the active shelf.
                </p>
              </div>
            ) : (
              Object.entries(groupedFiles)
                .sort()
                .map(([category, files]) => (
                  <section key={category} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6f5d48]">
                        {category}
                      </h3>
                      <span className="rounded-full border border-[#d7c9b6] px-2 py-0.5 text-xs text-[#8d7d69]">
                        {files.length}
                      </span>
                      <div className="h-px flex-1 bg-[#eadfce]" />
                    </div>

                    <div
                      className={
                        viewMode === "grid"
                          ? "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
                          : "grid grid-cols-1 gap-3"
                      }
                    >
                      {files.map((file) => (
                        <ResourceCard
                          key={file.path}
                          file={file}
                          dense={viewMode === "list"}
                          isFavorite={favorites.includes(file.path)}
                          onToggleFavorite={toggleFavorite}
                        />
                      ))}
                    </div>
                  </section>
                ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[6px] border border-[#e6d9c8] bg-white/70 p-3">
      <p className="text-2xl font-semibold text-[#201a14]">{value}</p>
      <p className="text-xs text-[#867768]">{label}</p>
    </div>
  );
}

function CategoryButton({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold capitalize transition ${
        active
          ? "border-[#201a14] bg-[#201a14] text-white"
          : "border-[#d7c9b6] bg-white/65 text-[#594b3d] hover:border-[#201a14]"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-1.5 py-0.5 text-[11px] ${
          active ? "bg-white/15 text-white" : "bg-[#f1e7d6] text-[#786a59]"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function ResourceCard({
  file,
  dense,
  isFavorite,
  onToggleFavorite,
}: {
  file: HtmlFile;
  dense: boolean;
  isFavorite: boolean;
  onToggleFavorite: (event: React.MouseEvent, path: string) => void;
}) {
  return (
    <Link
      href={`/${file.slug.join("/")}`}
      className={`resource-card group rounded-[8px] border border-[#ded2c0] bg-white p-5 shadow-[0_18px_45px_rgba(83,64,42,0.06)] transition hover:-translate-y-1 hover:border-[#b9a98f] hover:shadow-[0_24px_60px_rgba(83,64,42,0.1)] ${
        dense ? "flex items-center gap-4" : "flex min-h-48 flex-col"
      }`}
    >
      <div
        className={`flex items-start justify-between gap-4 ${
          dense ? "contents" : ""
        }`}
      >
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[6px] border ${categoryTone(
            file.category,
          )}`}
        >
          <FiFileText />
        </div>

        <button
          onClick={(event) => onToggleFavorite(event, file.path)}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
            isFavorite
              ? "bg-[#201a14] text-white"
              : "text-[#b1a28d] hover:bg-[#f6f1e8] hover:text-[#201a14]"
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <FiStar className={isFavorite ? "fill-current" : ""} />
        </button>
      </div>

      <div className={dense ? "min-w-0 flex-1" : "mt-6 flex-1"}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#90724c]">
          {file.category}
        </p>
        <h4 className="mt-2 line-clamp-2 text-lg font-semibold capitalize leading-snug text-[#201a14]">
          {file.title}
        </h4>
        {file.description ? (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#786a59]">
            {file.description}
          </p>
        ) : (
          <p className="mt-3 truncate text-xs font-medium text-[#9b8a75]">
            {file.path}
          </p>
        )}
      </div>

      <div
        className={`flex items-center gap-2 text-sm font-semibold text-[#201a14] ${
          dense ? "shrink-0" : "mt-6"
        }`}
      >
        Read
        <FiArrowRight className="transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
