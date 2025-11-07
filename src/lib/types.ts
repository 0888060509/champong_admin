

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Admin' | 'Supervisor' | 'Staff';
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  totalSpent: number;
  totalVisits: number;
  lastVisit: any;
  membershipTier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}

export type Role = {
  id: string;
  name: 'Admin' | 'Supervisor' | 'Staff';
  permissions: string[];
};

export type Branch = {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
};

export type AuditLog = {
  id: string;
  user: string;
  action: string;
  details: string;
  timestamp: string;
};

export type Topping = {
    id: string;
    name: string;
    price: number;
}

export type SideDish = {
    id: string;
    name: string;
    price: number;
}

export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  isEditing?: boolean;
  originalPrice?: number;
  note?: string;
  toppings?: Topping[];
  sideDishes?: SideDish[];
};

export type OrderHistory = {
  id: string;
  timestamp: any;
  user: string;
  action: string;
}

export type Order = {
  id: string;
  customerName: string;
  date: any;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  items: OrderItem[];
  history?: OrderHistory[];
  note?: string;
  shippingAddress?: string;
  paymentMethod?: string;
  
  // Financial fields
  subtotal: number;
  discount?: number;
  shippingFee?: number;
  total: number;
  amountPaid?: number;
  remainingAmount?: number;
};

export type Booking = {
    id: string;
    customerName: string;
    bookingDate: string;
    bookingTime: string;
    guests: number;
    status: 'Confirmed' | 'Pending' | 'Cancelled';
};

export type MenuItem = {
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
}

export type Banner = {
    id: string;
    title: string;
    imageUrl: string;
    isActive: boolean;
    startDate: string;
    endDate: string;
    linkType: 'url' | 'deeplink';
    link: string;
}

export type CampaignPerformanceData = {
    hour: number;
    opens: number;
    clicks: number;
};

export type Campaign = {
    id: string;
    name: string;
    description?: string;
    targetSegment: string[];
    title: string;
    message: string;
    status: 'Draft' | 'Scheduled' | 'Sending' | 'Completed' | 'Canceled';
    scheduleDate: string | null;
    sentCount: number;
    openRate: number;
    ctr: number; // Click-Through Rate
    redemptionRate?: number;
    performanceData?: CampaignPerformanceData[];
    onClickAction: {
      type: 'None' | 'Link to Product' | 'Link to Voucher' | 'Custom Web Link' | 'Link to Collection';
      value?: string;
    };
}

export type Tier = {
    id: string;
    name: string;
    description: string;
    minSpend: number;
    maxSpend: number | null;
    benefits: string[];
};

export type StampCardConfig = {
    isEnabled: boolean;
    stampsNeeded: number;
    reward: string;
};

export type Reward = {
    id: string;
    title: string;
    description: string;
    pointsCost: number;
};

export type Notification = {
  id: string;
  title: string;
  description: string;
  read: boolean;
  timestamp: string;
};

export type ChatMessage = {
  id: string;
  senderType: 'Customer' | 'Staff' | 'System';
  senderName: string;
  message: string;
  timestamp: any;
};

export type ChatSession = {
  id: string;
  customerId: string;
  customerName: string;
  branchName: string;
  staffName: string;
  status: 'Open' | 'Closed';
  lastUpdatedAt: any;
  messages: ChatMessage[];
};
