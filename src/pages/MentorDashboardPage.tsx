
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import EnrollmentChart from '@/components/EnrollmentChart';
import StatsCard from '@/components/StatsCard';
import RecentModules from '@/components/RecentModules';
import { BookOpen, DollarSign, Filter, PlusCircle, Search, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getMentorProfile, getMentorCourses, getMentorFollowersCount } from '@/services/mentorService';
import { toast } from '@/hooks/use-toast';

// Function to format currency values
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

const MentorDashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<string | null>(null);
  
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
  
  // Fetch follower count
  const { data: followersCount = 0 } = useQuery({
    queryKey: ['mentorFollowers'],
    queryFn: getMentorFollowersCount,
  });
  
  // Stats calculations
  const totalCourses = courses.length;
  const totalEnrollments = courses.reduce((sum, course) => {
    return sum + (course.enrollments?.[0]?.count || 0);
  }, 0);
  
  // Calculate estimated revenue (for paid courses)
  const totalRevenue = courses.reduce((sum, course) => {
    if (course.is_paid && course.price) {
      return sum + (course.price * (course.enrollments?.[0]?.count || 0));
    }
    return sum;
  }, 0);
  
  // Filter courses based on search query and visibility filter
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (course.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    
    const matchesFilter = visibilityFilter === null || 
                         (visibilityFilter === 'public' && course.is_public) ||
                         (visibilityFilter === 'private' && !course.is_public) ||
                         (visibilityFilter === 'paid' && course.is_paid) ||
                         (visibilityFilter === 'free' && !course.is_paid);
                         
    return matchesSearch && matchesFilter;
  });
  
  // Handle course filtering
  const handleFilterChange = (value: string) => {
    if (value === 'all') {
      setVisibilityFilter(null);
    } else {
      setVisibilityFilter(value);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {profile ? `Welcome back, ${profile.full_name || 'Mentor'}!` : 'Mentor Dashboard'}
        </h1>
        <p className="text-gray-600">Manage your courses and track your performance</p>
      </div>

      {/* Stats Section */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Followers" 
          value={followersCount}
          icon={<Users />} 
          description="People who follow your profile" 
        />
        <StatsCard 
          title="Courses" 
          value={totalCourses} 
          icon={<BookOpen />} 
          description="Total courses created" 
        />
        <StatsCard 
          title="Total Enrollments" 
          value={totalEnrollments} 
          icon={<Users />} 
          description="Students across all courses" 
        />
        <StatsCard 
          title="Estimated Revenue" 
          value={formatCurrency(totalRevenue)} 
          icon={<DollarSign />} 
          description="From paid courses" 
        />
      </div>

      {/* Analytics Section */}
      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <EnrollmentChart />
        <RecentModules />
      </div>

      {/* Courses Section */}
      <div className="mb-8">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold">My Courses</h2>
            <p className="text-sm text-muted-foreground">Manage and track all your courses</p>
          </div>
          <Link to="/mentor/courses/new"> 
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Course
            </Button>
          </Link>
        </div>
        
        {/* Filters and Search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Tabs defaultValue="all" className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all" onClick={() => handleFilterChange('all')}>All</TabsTrigger>
              <TabsTrigger value="public" onClick={() => handleFilterChange('public')}>Public</TabsTrigger>
              <TabsTrigger value="private" onClick={() => handleFilterChange('private')}>Private</TabsTrigger>
              <TabsTrigger value="paid" onClick={() => handleFilterChange('paid')}>Paid</TabsTrigger>
              <TabsTrigger value="free" onClick={() => handleFilterChange('free')}>Free</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Courses List */}
        {isLoadingCourses ? (
          <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-muted-foreground">Loading your courses...</p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      {course.image_url ? (
                        <img 
                          src={course.image_url} 
                          alt={course.title} 
                          className="w-16 h-16 rounded object-cover" 
                        />
                      ) : (
                        <div className="w-16 h-16 rounded bg-muted flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <CardTitle>{course.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={course.is_public ? "outline" : "secondary"}>
                            {course.is_public ? 'Public' : 'Private'}
                          </Badge>
                          <Badge variant={course.is_paid ? "default" : "outline"}>
                            {course.is_paid ? `$${course.price?.toFixed(2)}` : 'Free'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Enrollments</span>
                      <span className="text-sm font-medium">{course.enrollments?.[0]?.count || 0}</span>
                    </div>
                    <Progress 
                      value={course.enrollments?.[0]?.count || 0} 
                      max={totalEnrollments > 0 ? totalEnrollments : 10}
                      className="h-2"
                    />
                  </div>
                  {course.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  )}
                </CardContent>
                <div className="flex justify-between p-6 pt-0">
                  <Button variant="outline" asChild>
                    <Link to={`/mentor/courses/${course.id}`}>View Details</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to={`/mentor/courses/${course.id}/edit`}>Edit Course</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-xl font-medium text-gray-900">
              {searchQuery || visibilityFilter ? 'No courses match your filters' : 'No courses created yet'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || visibilityFilter ? 'Try changing your search or filters' : 'Start sharing your knowledge!'}
            </p>
            {!searchQuery && !visibilityFilter && (
              <div className="mt-6">
                <Link to="/mentor/courses/new">
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Course
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorDashboardPage;
