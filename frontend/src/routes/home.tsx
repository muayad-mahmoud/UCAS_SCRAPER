import Card from "@/components/university_card";
import UniversityHeader from "@/components/university_header";
import UniversityPagination from "@/components/university_pagination";
import UniversitySearch from "@/components/university_search";
import { providerMachine } from "@/state_machine/providers_machine"
import { useMachine } from "@xstate/react"
import { useEffect } from "react";
import { FiLoader, FiAlertCircle } from "react-icons/fi";

export function Home() {
  const [state, send] = useMachine(providerMachine);

  useEffect(() => {
    send({ type: 'FETCH_PROVIDERS' })
  }, [send])

  const totalUniversities = state.context.total || 0;
  const currentPage = state.context.page || 1;
  const itemsPerPage = state.context.limit || 10;
  const totalPages = Math.ceil(totalUniversities / itemsPerPage);
  const currentPageInfo = totalPages > 1 ? `Page ${currentPage} of ${totalPages}` : undefined;
  const isSearching = state.matches('searching') || state.matches('searchSuccess');
  const currentSearchQuery = state.context.searchQuery;

  const handlePageChange = (page: number) => {
    send({ type: 'CHANGE_PAGE', page });
  };

  const handleItemsPerPageChange = (limit: number) => {
    send({ type: 'CHANGE_LIMIT', limit });
  };

  const handleSearch = (query: string) => {
    send({ type: 'SEARCH', query });
  };

  const handleClearSearch = () => {
    send({ type: 'FETCH_PROVIDERS' });
  };

  
  return (
    <div className='mx-auto mt-8 flex flex-col items-center gap-6 px-1 transition-all duration-300 md:mt-12 md:px-0 p-4 max-w-7xl'>
      {(state.matches('loading') || state.matches('searching')) ? (
        <div className="flex flex-col items-center justify-center py-12">
          <FiLoader className="animate-spin text-blue-600 mb-4" size={32} />
          <p className="text-gray-600">
            {state.matches('searching') ? 'Searching universities...' : 'Loading universities...'}
          </p>
        </div>
      ) : state.matches('failure') ? (
        <div className="flex flex-col items-center justify-center py-12">
          <FiAlertCircle className="text-red-600 mb-4" size={32} />
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Universities</h2>
            <p className="text-gray-600 mb-4">{state.context.error}</p>
            <button
              onClick={() => send({ type: 'RETRY_FETCH_PROVIDERS' })}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (state.matches('success') || state.matches('searchSuccess')) ? (
        <div className="w-full">
          <UniversityHeader 
            universitiesCount={totalUniversities}
            currentPageInfo={currentPageInfo}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            isSearching={isSearching}
          />
          
          <UniversitySearch
            onSearch={handleSearch}
            onClear={handleClearSearch}
            currentQuery={currentSearchQuery || ""}
            placeholder="Search universities by name..."
          />
          
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
            {(() => {
              const providers = state.context.providers;
              
              if (!providers) {
                return (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">No data loaded yet</p>
                  </div>
                );
              }
              
              if (providers.length === 0) {
                return (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">Found 0 providers</p>
                  </div>
                );
              }
              
              return providers.map((provider) => (
                <Card key={provider.id} provider={provider} />
              ));
            })()}
          </div>

          {state.context.providers?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {isSearching 
                  ? `No universities found matching "${currentSearchQuery}"`
                  : "No universities found"
                }
              </p>
              {isSearching && (
                <button
                  onClick={handleClearSearch}
                  className="mt-4 text-blue-600 hover:text-blue-800 underline"
                >
                  Clear search and show all universities
                </button>
              )}
            </div>
          )}

          {totalUniversities > 0 && !isSearching && (
            <UniversityPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalUniversities}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      ) : null}
    </div>
  )
}
