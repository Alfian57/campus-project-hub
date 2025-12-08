"use server";

import { revalidatePath } from "next/cache";

// In-memory storage for likes (replace with database in production)
const likesStore = new Map<string, number>();

export async function toggleLike(projectId: string, currentLikes: number) {
  try {
    // Get current likes from store or use the passed value
    const storedLikes = likesStore.get(projectId) ?? currentLikes;
    
    // Toggle (increment for now, in real app you'd track user's like state)
    const newLikes = storedLikes + 1;
    
    // Update store
    likesStore.set(projectId, newLikes);
    
    // Revalidate the page to show updated data
    revalidatePath("/");
    revalidatePath(`/project/${projectId}`);
    
    return {
      success: true,
      likes: newLikes,
    };
  } catch (error) {
    console.error("Toggle like error:", error);
    return {
      success: false,
      likes: currentLikes,
    };
  }
}

export async function addComment(
  projectId: string,
  content: string,
  userId: string = "guest"
) {
  try {
    // In a real app, save to database
    // For now, just simulate success
    
    revalidatePath(`/project/${projectId}`);
    
    return {
      success: true,
      comment: {
        id: Date.now().toString(),
        content,
        createdAt: new Date(),
      },
    };
  } catch (error) {
    console.error("Add comment error:", error);
    return {
      success: false,
      error: "Failed to add comment",
    };
  }
}
