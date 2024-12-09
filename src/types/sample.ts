export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface SampleFeedback {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: User;
}

export interface Sample {
  id: string;
  productName: string;
  requestedBy: User;
  status: 'pending' | 'approved' | 'shipped' | 'delivered' | 'feedback_received';
  requestDate: string;
  trackingNumber?: string;
  image: string;
  description?: string;
  quantity: number;
  feedback?: SampleFeedback;
}