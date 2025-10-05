export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Admin' | 'Supervisor' | 'Staff';
};

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

export type Order = {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: 'Completed' | 'Processing' | 'Cancelled';
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
}

export type Campaign = {
    id: string;
    name: string;
    targetSegment: string;
    message: string;
    status: 'Active' | 'Draft' | 'Sent';
    sendDate: string;
}
