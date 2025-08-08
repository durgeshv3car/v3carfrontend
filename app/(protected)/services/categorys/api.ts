// This talks to our internal Next.js API routes — no CORS/mixed-content issues
export const fetchCategories = async () => {
  try {
    const response = await fetch("/api/category");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const addCategory = async (title: string) => {
  try {
    const response = await fetch("/api/category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error adding category:", error);
    return { success: false };
  }
};

export const updateCategory = async (id: string, title: string) => {
  try {
    const response = await fetch(`/api/category?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false };
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const response = await fetch(`/api/category?id=${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false };
  }
};
