
import React from "react";
import MentorSidebar from "@/components/mentor/MentorSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import MentorCard from "@/components/MentorCard";
import ProfilePage from "@/components/profile/ProfilePage";

const MentorProfilePage = () => {
  // Mock data for visual purposes only
  const mockCourses = [
    { 
      id: "1", 
      title: "Introdução ao React", 
      image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      enrollment_count: 125
    },
    { 
      id: "2", 
      title: "TypeScript Avançado", 
      image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      enrollment_count: 89
    },
    { 
      id: "3", 
      title: "UI/UX para Desenvolvedores", 
      image_url: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      enrollment_count: 212
    },
    { 
      id: "4", 
      title: "Node.js do Zero ao Deploy", 
      image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      enrollment_count: 156
    }
  ];

  return (
    <div className="flex">
      <MentorSidebar />
      <div className="flex-1">
        {/* Banner section */}
        <div className="relative w-full">
          {/* Banner Image */}
          <div className="w-full h-[350px] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=1500&q=80"
              alt="Banner profile" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Profile image overlapping banner */}
          <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
            <div className="relative group">
              <div className="w-[130px] h-[130px] md:w-[150px] md:h-[150px] rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
                <Avatar className="w-full h-full">
                  <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" alt="Profile picture" className="object-cover" />
                  <AvatarFallback>MX</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
        
        {/* Name and follow section */}
        <div className="mt-24 max-w-5xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800">Guilherme Ramalho</h1>
          <p className="text-gray-600 mt-1">Mentor de Desenvolvimento Web e Mobile</p>
          
          <div className="flex justify-center mt-4 gap-4 items-center">
            <Button className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white px-6 rounded-full shadow-md transition-all hover:shadow-lg">
              Seguir
            </Button>
            
            <div className="flex gap-2">
              <a href="#" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <Instagram className="h-5 w-5 text-gray-700" />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <Facebook className="h-5 w-5 text-gray-700" />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <Youtube className="h-5 w-5 text-gray-700" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Tabs for About and Courses */}
        <div className="max-w-5xl mx-auto mt-8 px-4">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="profile" className="text-base">Sobre Mim</TabsTrigger>
              <TabsTrigger value="courses" className="text-base">Meus Cursos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-4">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <ProfilePage userRole="mentor" />
              </div>
            </TabsContent>
            
            <TabsContent value="courses" className="mt-4">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Cursos Publicados</h2>
                
                <Carousel className="w-full">
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {mockCourses.map((course) => (
                      <CarouselItem key={course.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                          <div className="h-48 overflow-hidden">
                            <img 
                              src={course.image_url} 
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-lg">{course.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {course.enrollment_count} alunos matriculados
                            </p>
                            <Button variant="outline" className="mt-3 w-full">
                              Ver mais
                            </Button>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="flex justify-center gap-2 mt-8">
                    <CarouselPrevious />
                    <CarouselNext />
                  </div>
                </Carousel>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MentorProfilePage;
