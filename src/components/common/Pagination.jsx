import React from 'react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5
}) => {
  if (totalPages <= 0) return null;

  const getPageRange = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = start + maxVisiblePages - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageRange = getPageRange();

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
      <div className="hidden md:-mt-px md:flex">
        {/* First page button */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
            currentPage === 1
              ? 'cursor-not-allowed border-transparent text-gray-300'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
          }`}
        >
          <FiChevronsLeft className="mr-2 h-5 w-5" />
          First
        </button>

        {/* Previous page button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`ml-3 inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
            currentPage === 1
              ? 'cursor-not-allowed border-transparent text-gray-300'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
          }`}
        >
          <FiChevronLeft className="mr-2 h-5 w-5" />
          Previous
        </button>

        {/* Page numbers */}
        {pageRange.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
              page === currentPage
                ? 'border-violet-500 text-violet-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next page button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`ml-3 inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
            currentPage === totalPages
              ? 'cursor-not-allowed border-transparent text-gray-300'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
          }`}
        >
          Next
          <FiChevronRight className="ml-2 h-5 w-5" />
        </button>

        {/* Last page button */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`ml-3 inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
            currentPage === totalPages
              ? 'cursor-not-allowed border-transparent text-gray-300'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
          }`}
        >
          Last
          <FiChevronsRight className="ml-2 h-5 w-5" />
        </button>
      </div>

      {/* Mobile pagination */}
      <div className="flex w-full items-center justify-between md:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium ${
            currentPage === 1
              ? 'cursor-not-allowed bg-gray-100 text-gray-400'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <FiChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </button>
        <div className="text-sm text-gray-700">
          Page <span className="font-medium">{currentPage}</span> of{' '}
          <span className="font-medium">{totalPages}</span>
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium ${
            currentPage === totalPages
              ? 'cursor-not-allowed bg-gray-100 text-gray-400'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Next
          <FiChevronRight className="ml-1 h-4 w-4" />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;