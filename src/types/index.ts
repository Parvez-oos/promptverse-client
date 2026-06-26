export interface IUser {
  _id: string;
  name: string;
  email: string;
  photoURL: string;
  role: 'user' | 'creator' | 'admin';
  isPremium: boolean;
  premiumExpiry?: string;
  totalPrompts?: number;
  createdAt: string;
}

export interface IPrompt {
  _id: string;
  title: string;
  description: string;
  content: string;
  usageInstructions?: string;
  category: string;
  aiTool: string;
  tags: string[];
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Pro';
  thumbnail: string;
  visibility: 'public' | 'private';
  copyCount: number;
  forkCount: number;
  status: 'pending' | 'approved' | 'rejected';
  rejectionFeedback?: string;
  isFeatured: boolean;
  trendingScore?: number;
  creator: IUser;
  originalPrompt?: string | IPrompt;
  averageRating?: number;
  reviewCount?: number;
  isBookmarked?: boolean;
  isLocked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface INotification {
  _id: string;
  type: 'bookmark' | 'review' | 'fork' | 'status' | 'system';
  message: string;
  promptId?: string;
  read: boolean;
  createdAt: string;
}

export interface IReview {
  _id: string;
  prompt: string | IPrompt;
  user: IUser;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface IBookmark {
  _id: string;
  prompt: IPrompt;
  user: string;
  createdAt: string;
}

export interface IReport {
  _id: string;
  prompt: IPrompt;
  user: IUser;
  reason: string;
  description?: string;
  status: 'pending' | 'dismissed' | 'action_taken';
  createdAt: string;
}

export interface IPayment {
  _id: string;
  user: IUser;
  stripePaymentId: string;
  amount: number;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: IUser;
    accessToken: string;
    refreshToken: string;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export type ReportReason = 'Inappropriate Content' | 'Spam' | 'Copyright Violation' | 'Other';
