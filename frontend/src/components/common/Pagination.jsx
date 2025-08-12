import { ChevronLeft, ChevronRight } from "lucide-react"

const Pagination = ({
  currentPage,
  hasNext,
  hasPrevious,
  onNextPage,
  onPreviousPage,
  totalItems,
  itemsPerPage = 10,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems || 0)

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={onPreviousPage}
          disabled={!hasPrevious}
          className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
            !hasPrevious ? "cursor-not-allowed opacity-50" : "hover:bg-gray-50"
          }`}
        >
          Previous
        </button>
        <button
          onClick={onNextPage}
          disabled={!hasNext}
          className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
            !hasNext ? "cursor-not-allowed opacity-50" : "hover:bg-gray-50"
          }`}
        >
          Next
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            {totalItems ? (
              <>
                Showing <span className="font-medium">{startItem}</span> to{" "}
                <span className="font-medium">{endItem}</span> of <span className="font-medium">{totalItems}</span>{" "}
                results
              </>
            ) : (
              `Page ${currentPage}`
            )}
          </p>
        </div>

        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={onPreviousPage}
              disabled={!hasPrevious}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                !hasPrevious ? "cursor-not-allowed opacity-50" : "hover:bg-gray-50 focus:bg-gray-50"
              }`}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
              {currentPage}
            </span>

            <button
              onClick={onNextPage}
              disabled={!hasNext}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                !hasNext ? "cursor-not-allowed opacity-50" : "hover:bg-gray-50 focus:bg-gray-50"
              }`}
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Pagination
