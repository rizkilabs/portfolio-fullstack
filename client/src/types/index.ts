export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  techStack: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}
