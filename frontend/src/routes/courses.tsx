import { courseMachine } from "@/state_machine/courses_machine";
import { useMachine } from "@xstate/react";
import { useEffect } from "react";
import CourseAccordion from "@/components/course_accordion";
import { FiLoader, FiAlertCircle } from "react-icons/fi";

const Courses = () => {
    const [state, send] = useMachine(courseMachine)

    useEffect(() => {

        const providerId = window.location.pathname.split('/')[1];
        if (providerId) {
            send({ type: 'FETCH_COURSES', providerId: providerId });
        }
    }, [send])

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4">
            <div className="max-w-4xl mx-auto">
                {state.matches('loading') ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <FiLoader className="animate-spin text-blue-600 mb-4" size={32} />
                        <p className="text-gray-600">Loading courses...</p>
                    </div>
                ) : state.matches('failure') ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <FiAlertCircle className="text-red-600 mb-4" size={32} />
                        <div className="text-center">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Courses</h2>
                            <p className="text-gray-600 mb-4">{state.context.error}</p>
                            <button
                                onClick={() => {
                                    const providerId = window.location.pathname.split('/')[1];
                                    if (providerId) {
                                        send({ type: 'FETCH_COURSES', providerId: providerId });
                                    }
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : (
                    <CourseAccordion 
                        courses={state.context.courses || []} 
                        totalCourses={state.context.total || 0}
                        currentPage={state.context.page || 1}
                        itemsPerPage={state.context.limit || 10}
                        onPageChange={(page) => send({ type: 'CHANGE_PAGE', page })}
                    />
                )}
            </div>
        </div>
    )
};

export default Courses;
