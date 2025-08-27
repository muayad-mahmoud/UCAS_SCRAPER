import { fromPromise, createMachine, assign} from "xstate";
import { client } from "@/client/client.gen";
import { searchCoursesApiCoursesGet, CourseWithOptions } from "@/client";

interface CourseContext {
    courses: CourseWithOptions[] | null;
    error: string | null;
    providerId: string | null;
    limit: number | null;
    page: number | null;
    total: number | null;
}

type CourseEvents = 
    | { type: 'FETCH_COURSES'; providerId: string }
    | { type: 'CHANGE_PAGE'; page: number }
    | { type: 'CHANGE_LIMIT'; limit: number };

export const courseMachine = createMachine({
    id:'courses',
    initial: 'idle',
    types: {} as {
        context: CourseContext;
        events: CourseEvents;
    },
    context: {
        courses: null,
        error: null,
        providerId: null,
        limit: 10,
        page: 1
    } as CourseContext,
    states: {
        idle: {
            on: {
                FETCH_COURSES: {
                    target: 'loading',
                    actions: assign({
                        providerId: ({ event }) => event.providerId
                    })
                }
            }
        },
        loading: {
            invoke: {
                id: 'fetchCourses',
                src: fromPromise(async ({input} : {input: { providerId: string, limit: number , page: number }}) => {
                    const response = await searchCoursesApiCoursesGet({
                        client: client,
                        query: {
                            provider_id: input.providerId,
                            options: true,
                            limit: input.limit,
                            page: input.page
                        }
                    });
                    if(!response.data) throw new Error("No data found");
                    return response.data;
                }),
                input: ({ context }) => ({
                    providerId: context.providerId!,
                    limit: context.limit!,
                    page: context.page!
                }),
                onDone: {
                    target: 'success',
                    actions: assign({
                        courses: ({event}) => event.output.data,
                        total: ({event}) => event.output.total
                    })
                },
                onError: {
                    target: 'failure',
                    actions: assign({
                        error: ({event}) => {
                            return (event.error as Error)?.message || 'Error Fetching Courses';
                        },
                        courses: () => null
                    })
                }
            }
        },
        success: {
            on: {
                FETCH_COURSES: {
                    target: 'loading',
                    actions: assign({
                        providerId: ({event}) => event.providerId
                    })
                },
                CHANGE_PAGE: {
                    target: 'loading',
                    actions: assign({
                        page: ({event}) => event.page
                    })
                },
                CHANGE_LIMIT: {
                    target: 'loading',
                    actions: assign({
                        limit: ({event}) => event.limit,
                        page: () => 1
                    })
                }
            }
        },
        failure: {
            on: {
                FETCH_COURSES: {
                    target: 'loading',
                    actions: assign({
                        providerId: ({event}) => event.providerId
                    })
                }
            }
        }
    }
})