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

export interface Admin {
  id: number;
  name: string;
  email: string;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}
