import React, { useState, useMemo } from "react";
import { CourseWithOptions } from "@/client";
import CourseItem from "./course_item";
import AccordionHeader from "./accordion_header";
import EmptyState from "./empty_state";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface CourseAccordionProps {
    courses: CourseWithOptions[];
    totalCourses?: number;
    currentPage?: number;
    itemsPerPage?: number;
    onPageChange?: (page: number) => void;
}

const CourseAccordion: React.FC<CourseAccordionProps> = ({ 
    courses, 
    totalCourses, 
    currentPage: externalCurrentPage,
    itemsPerPage = 10,
    onPageChange 
}) => {
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());
    
    const currentPage = externalCurrentPage ?? 1;
    
    const totalCoursesCount = totalCourses ?? courses.length;
    
    const totalPages = Math.ceil(totalCoursesCount / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    const currentCourses = useMemo(() => {
        return onPageChange ? courses : courses.slice(startIndex, endIndex);
    }, [courses, startIndex, endIndex, onPageChange]);

    const toggleItem = (courseId: string) => {
        setOpenItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(courseId)) {
                newSet.delete(courseId);
            } else {
                newSet.add(courseId);
            }
            return newSet;
        });
    };

    const toggleAll = () => {
        if (openItems.size === currentCourses.length && currentCourses.every(course => openItems.has(course.id))) {
            const currentPageIds = new Set(currentCourses.map(course => course.id));
            setOpenItems(prev => {
                const newSet = new Set(prev);
                currentPageIds.forEach(id => newSet.delete(id));
                return newSet;
            });
        } else {
            setOpenItems(prev => {
                const newSet = new Set(prev);
                currentCourses.forEach(course => newSet.add(course.id));
                return newSet;
            });
        }
    };

    const goToPage = (page: number) => {
        if (onPageChange) {
            onPageChange(page);
        } else {
            console.warn('Client-side pagination not supported in this implementation');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    };

    if (!courses || courses.length === 0) {
        return <EmptyState />;
    }

    const allCurrentPageExpanded = currentCourses.every(course => openItems.has(course.id));
    const currentPageInfo = totalPages > 1 ? `Page ${currentPage} of ${totalPages}` : undefined;

    return (
        <div className="w-full">
            <AccordionHeader
                coursesCount={totalCoursesCount}
                allExpanded={allCurrentPageExpanded}
                onToggleAll={toggleAll}
                currentPageInfo={currentPageInfo}
            />

            <div className="space-y-0">
                {currentCourses.map((course) => (
                    <CourseItem
                        key={course.id}
                        course={course}
                        isOpen={openItems.has(course.id)}
                        onToggle={() => toggleItem(course.id)}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex items-center text-sm text-gray-700">
                        <span>
                            Showing {startIndex + 1}-{Math.min(endIndex, totalCoursesCount)} of {totalCoursesCount} courses
                        </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                                currentPage === 1
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                            } transition-colors duration-200`}
                        >
                            <FiChevronLeft className="mr-1" size={16} />
                            Previous
                        </button>

                        <div className="flex items-center space-x-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(page => {
                                    return (
                                        page === 1 ||
                                        page === totalPages ||
                                        Math.abs(page - currentPage) <= 1
                                    );
                                })
                                .map((page, index, array) => (
                                    <React.Fragment key={page}>
                                        {index > 0 && array[index - 1] !== page - 1 && (
                                            <span className="text-gray-400 px-2">...</span>
                                        )}
                                        <button
                                            onClick={() => goToPage(page)}
                                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                                                page === currentPage
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                            } transition-colors duration-200`}
                                        >
                                            {page}
                                        </button>
                                    </React.Fragment>
                                ))
                            }
                        </div>

                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                                currentPage === totalPages
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                            } transition-colors duration-200`}
                        >
                            Next
                            <FiChevronRight className="ml-1" size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseAccordion;
