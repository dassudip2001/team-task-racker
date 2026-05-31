export interface OverduePerUser {
  assignee_id: string;
  username: string;
  email: string;
  overdue_count: number;
}

export interface AvgCompletionTime {
  assignee_id: string;
  username: string;
  avg_completion_seconds: number;
}

export interface AnalyticsResponse {
  overdue_per_user: OverduePerUser[];
  avg_completion_time: AvgCompletionTime[];
}
