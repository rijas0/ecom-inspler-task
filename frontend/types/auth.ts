export type UserRole = "user" | "admin";

export interface User {
    id:string;
    name:string;
    email:string;
    role:UserRole
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
} 