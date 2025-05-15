
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMentorProfile, getMentorCourses } from '@/services/mentorService';
import CoursesList from '@/components/mentor/CoursesList';

export default function MentorCoursesPage() {
  // Fetch the mentor profile
  const { data: profile } = useQuery({
    queryKey: ['mentorProfile'],
    queryFn: getMentorProfile,
  });
  
  // Fetch mentor courses
  const { data: courses = [], isLoading: isLoadingCourses } = useQuery({
    queryKey: ['mentorCourses'],
    queryFn: getMentorCourses,
  });
  
  // Calculate total enrollments for all courses
  const totalEnrollments = courses.reduce((sum, course) => {
    return sum + (course.enrollments?.[0]?.count || 0);
  }, 0);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {profile ? `${profile.full_name}'s Courses` : 'My Courses'}
        </h1>
        <p className="text-gray-600">Manage your courses and their content</p>
      </div>

      {/* Display courses list */}
      <CoursesList 
        courses={courses} 
        isLoading={isLoadingCourses} 
        totalEnrollments={totalEnrollments} 
      />
    </div>
  );
}
