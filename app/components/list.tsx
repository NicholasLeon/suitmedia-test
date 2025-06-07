"use client";

import { useEffect, useState } from "react";
import { fetchIdeas, Idea } from "@/lib/ideas";
import Image from "next/image";
import Link from "next/link";

const perPageOptions = [10, 20, 50];
const sortOptions = [
  { label: "Newest", value: "-published_at" },
  { label: "Oldest", value: "published_at" },
];

export default function IdeasList() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentSort, setCurrentSort] = useState("-published_at");
  const [totalRecords, setTotalRecords] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const retrieveIdeas = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const { data: ideaData, meta: paginationMeta } = await fetchIdeas({
          page: currentPage,
          size: itemsPerPage,
          sort: currentSort,
        });

        if (paginationMeta) {
          setTotalRecords(paginationMeta.total);
        } else {
          console.warn("Meta data for pagination is missing.");
          setTotalRecords(ideaData.length);
        }
        setIdeas(ideaData);
      } catch (err: any) {
        console.error("Gagal mengambil ide:", err);
        setFetchError("Mohon maaf, kami gagal memuat ide. Coba lagi nanti.");
      } finally {
        setIsLoading(false);
      }
    };

    retrieveIdeas();
  }, [currentPage, itemsPerPage, currentSort]);

  const totalPages = Math.ceil(totalRecords / itemsPerPage);
  const displayStart = (currentPage - 1) * itemsPerPage + 1;
  const displayEnd = Math.min(displayStart + itemsPerPage - 1, totalRecords);

  const renderPaginationControls = () => {
    const pageNumberButtons: any[] = [];
    const maxVisiblePages = 5;

    let pageRangeStart = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    let pageRangeEnd = Math.min(
      totalPages,
      pageRangeStart + maxVisiblePages - 1
    );

    if (pageRangeEnd - pageRangeStart + 1 < maxVisiblePages) {
      pageRangeStart = Math.max(1, pageRangeEnd - maxVisiblePages + 1);
    }

    if (totalPages <= 1 && totalRecords > 0) return null;
    if (totalRecords === 0) return null;

    return (
      <nav className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Halaman Sebelumnya"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5 text-gray-700"
          >
            <path
              fillRule="evenodd"
              d="M11.72 15.72a.75.75 0 0 1-.97.02l-.04-.02-4.25-4.5a.75.75 0 0 1 0-1.06l4.25-4.5a.75.75 0 0 1 1.06 1.06L7.81 10l3.91 4.19a.75.75 0 0 1-.02 1.04Z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {pageRangeStart > 1 && (
          <>
            <button
              onClick={() => setCurrentPage(1)}
              className="px-4 py-2 rounded-md hover:bg-gray-100"
            >
              1
            </button>
            {pageRangeStart > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pageNumberButtons.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`px-4 py-2 rounded-md ${
              currentPage === number
                ? "bg-orange-500 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {number}
          </button>
        ))}

        {pageRangeEnd < totalPages && (
          <>
            {pageRangeEnd < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => setCurrentPage(totalPages)}
              className="px-4 py-2 rounded-md hover:bg-gray-100"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage === totalPages}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Halaman Berikutnya"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5 text-gray-700"
          >
            <path
              fillRule="evenodd"
              d="M8.28 15.72a.75.75 0 0 0 .97-.02l.04-.02 4.25-4.5a.75.75 0 0 0 0-1.06l-4.25-4.5a.75.75 0 0 0-1.06 1.06L12.19 10l-3.91 4.19a.75.75 0 0 0 .02 1.04Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </nav>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 text-sm">
        <span className="text-gray-600">
          Show {displayStart} - {displayEnd} from {totalRecords}
        </span>

        <div className="flex items-center gap-4">
          <label className="flex items-center">
            <span className="mr-2">Show per page:</span>
            <div className="relative">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:border-blue-500"
              >
                {perPageOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </label>

          <label className="flex items-center">
            <span className="mr-2">Sort by:</span>
            <div className="relative">
              <select
                value={currentSort}
                onChange={(e) => {
                  setCurrentSort(e.target.value);
                  setCurrentPage(1);
                }}
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:border-blue-500"
              >
                {sortOptions.map((option) => (
                  <option value={option.value} key={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </label>
        </div>
      </div>

      {isLoading && (
        <div className="text-center text-gray-500 text-lg py-10">
          Loading...
        </div>
      )}
      {fetchError && (
        <div className="text-center text-red-500 text-lg py-10">
          Terjadi kesalahan: {fetchError}
        </div>
      )}

      {!isLoading && !fetchError && totalRecords === 0 && (
        <div className="text-center text-gray-500 text-lg py-10">
          No article found.
        </div>
      )}

      {!isLoading && !fetchError && ideas.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ideas.map((idea) => (
            <Link
              href={`/ideas/${idea.slug}`}
              key={idea.id}
              className="group block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
            >
              <div className="aspect-[4/3] relative w-full overflow-hidden">
                <Image
                  src={idea.medium_image?.[0]?.url ?? "/placeholder.jpg"}
                  alt={idea.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-1">
                  {new Date(idea.published_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <h3 className="text-lg font-semibold line-clamp-3 text-gray-800">
                  {idea.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!isLoading &&
        !fetchError &&
        totalPages > 1 &&
        renderPaginationControls()}
    </div>
  );
}
