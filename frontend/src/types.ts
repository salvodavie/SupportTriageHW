export type UserRole = 'admin' | 'instructor' | 'student' | 'observer';

export type FeedbackCategory = 'support-request' | 'bug-report' | 'product-feedback';

export type FeedbackSeverity = 'low' | 'medium' | 'high' | 'mission-blocking';

export type FeedbackStatus = 'open' | 'in-progress' | 'resolved';

export type ClientError = {
  message: string;
  source: 'client' | 'network' | 'server';
  at: number;
};

export type FeedbackContext = {
  browser?: string;
  viewport?: string;
  recentClientErrors?: ClientError[];
  [key: string]: unknown;
};

export type CreateSupportFeedbackInput = {
  category: FeedbackCategory;
  severity: FeedbackSeverity;
  subject: string;
  details: string;
  pagePath: string;
  sessionId?: string | null;
  context?: FeedbackContext;
};

export type SupportFeedbackTicket = CreateSupportFeedbackInput & {
  id: string;
  ticketNumber: number;
  status: FeedbackStatus;
  createdBy: {
    id: string;
    role: UserRole;
  };
  context: FeedbackContext;
  createdAt: string;
  updatedAt: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  errors?: string[];
  timestamp: number;
};

