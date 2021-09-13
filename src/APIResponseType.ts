export interface Repo {
  id: number;
  name: string;
  full_name: string;
  open_issues: number;
}

export interface Issue {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  assignee: User | null;
}

interface User {
  avatar_url: string;
}
