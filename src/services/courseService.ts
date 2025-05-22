
export async function getCourseById(courseId: string) {
  try {
    const { data, error } = await supabase
      .from("cursos")
      .select("id, title, description, is_paid, price, discount, discounted_price, image_url, is_public, is_published, category") 
      .eq("id", courseId)
      .single();
      
    if (error) {
      console.error("Erro ao buscar curso:", error);
      throw error;
    }
    
    // Convert the course data to form data format
    const courseFormData: CourseFormData = {
      name: data.title,
      description: data.description || "",
      category: data.category || "",
      image: data.image_url || "",
      type: data.is_paid ? "paid" : "free",
      price: data.price || 0,
      currency: "BRL", 
      discount: data.discount || 0,
      visibility: data.is_public ? "public" : "private",
      isPublished: data.is_published || false,
    };
    
    console.log("Dados do curso carregados:", courseFormData);
    return courseFormData;
  } catch (error) {
    console.error("Erro ao buscar curso:", error);
    throw error;
  }
}
