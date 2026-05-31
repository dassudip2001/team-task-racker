export interface IAssignUser {
  id: number;
  org: Org;
  user: User;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Org {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
}
