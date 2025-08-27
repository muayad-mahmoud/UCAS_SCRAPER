import { fromPromise ,createMachine, assign } from "xstate";
import { client } from "@/client/client.gen";
import { getProvidersApiProvidersGet, ProviderWithAddress, searchProvidersApiProvidersSearchGet} from "@/client";

interface ProviderContext {
    providers: ProviderWithAddress[] | null;
    error: string | null;
    total: number | null;
    limit: number | null;
    page: number | null;
    searchQuery: string | null;
}

type ProviderEvents = 
    | { type: 'FETCH_PROVIDERS' }
    | { type: 'SEARCH', query: string }
    | { type: 'CHANGE_PAGE'; page: number }
    | { type: 'CHANGE_LIMIT'; limit: number }
    | { type: 'RETRY_FETCH_PROVIDERS' }

export const providerMachine = createMachine({
    id: 'providers',
    initial: 'idle',
    types: {} as {
        context: ProviderContext;
        events: ProviderEvents;
    },
    context: {
        providers: null,
        error: null,
        total: null,
        limit: 10,
        page: 1,
        searchQuery: null
    } as ProviderContext,
    states: {
        idle: {
            on: {
                FETCH_PROVIDERS: 'loading',
                SEARCH: {
                    target: 'searching',
                    actions: assign({
                        searchQuery: ({ event }) => event.query,
                        page: () => 1
                    })
                }
            }
        },
        loading: {
            invoke: {
                id: 'fetchProviders',
                src: fromPromise(async ({input}: {input: { limit: number, page: number }}) => {
                    const response = await getProvidersApiProvidersGet({
                        client: client,
                        query: {
                            page: input.page,
                            limit: input.limit,
                            addresses: true
                            
                        }
                    });
                    return response.data;
                }),
                input: ({ context }) => ({
                    limit: context.limit!,
                    page: context.page!
                }),
                onDone: {
                    target: 'success',
                    actions: assign({
                        providers: ({event}) => {
                            return event.output.data;
                        },
                        total: ({event}) => event.output.total,
                        searchQuery: () => null
                    })
                },
                onError: {
                    target: 'failure',
                    actions: assign({
                        error: ({ event }) => {
                            return (event.error as Error)?.message || 'Error Fetching Providers';
                        },
                        providers: () => null
                    })
                }
            }
        },
        searching: {
            invoke: {
                id: 'searchProviders',
                src: fromPromise(async ({input}: {input: { name: string, limit: number, page: number }}) => {
                    const response = await searchProvidersApiProvidersSearchGet({
                        client: client,
                        query: {
                            name: input.name
                        }
                    });
                    return response.data;
                }),
                input: ({ context }) => ({
                    name: context.searchQuery!,
                    limit: context.limit!,
                    page: context.page!
                }),
                onDone: {
                    target: 'searchSuccess',
                    actions: assign({
                        providers: ({event}) => {
                            return event.output

                        },
                        total: ({event}) => {
                            if (Array.isArray(event.output)) {
                                return event.output.length;
                            } else if (event.output?.total) {
                                return event.output.total;
                            }
                            return 0;
                        }
                    })
                },
                onError: {
                    target: 'failure',
                    actions: assign({
                        error: ({ event }) => {
                            return (event.error as Error)?.message || 'Error Searching Providers';
                        },
                        providers: () => null
                    })
                }
            }
        },
        success: {
            on: {
                FETCH_PROVIDERS: 'loading',
                SEARCH: {
                    target: 'searching',
                    actions: assign({
                        searchQuery: ({ event }) => event.query,
                        page: () => 1
                    })
                },
                RETRY_FETCH_PROVIDERS: 'loading',
                CHANGE_PAGE: {
                    target: 'loading',
                    actions: assign({
                        page: ({ event }) => event.page
                    })
                },
                CHANGE_LIMIT: {
                    target: 'loading',
                    actions: assign({
                        limit: ({ event }) => event.limit,
                        page: () => 1
                    })
                }
            }
        },
        searchSuccess: {
            on: {
                FETCH_PROVIDERS: {
                    target: 'loading',
                    actions: assign({
                        searchQuery: () => null
                    })
                },
                SEARCH: {
                    target: 'searching',
                    actions: assign({
                        searchQuery: ({ event }) => event.query,
                        page: () => 1
                    })
                },
                RETRY_FETCH_PROVIDERS: 'searching',
                CHANGE_PAGE: {
                    target: 'searching',
                    actions: assign({
                        page: ({ event }) => event.page
                    })
                },
                CHANGE_LIMIT: {
                    target: 'searching',
                    actions: assign({
                        limit: ({ event }) => event.limit,
                        page: () => 1
                    })
                }
            }
        },
        failure: {
            on: {
                RETRY_FETCH_PROVIDERS: 'loading'
            }
        }
    }
})