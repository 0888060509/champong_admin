
import type { User, Role, Branch, AuditLog, Order, Booking, MenuItem, Banner, Campaign } from './types';

export const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', role: 'Admin' },
  { id: '2', name: 'Supervisor Sam', email: 'supervisor@example.com', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', role: 'Supervisor' },
  { id: '3', name: 'Staff Sarah', email: 'staff@example.com', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d', role: 'Staff' },
];

export const mockRoles: Role[] = [
  { id: '1', name: 'Admin', permissions: ['manage_all'] },
  { id: '2', name: 'Supervisor', permissions: ['manage_orders', 'manage_bookings', 'view_reports'] },
  { id: '3', name: 'Staff', permissions: ['view_orders', 'view_bookings'] },
];

export const mockBranches: Branch[] = [
  { id: '1', name: 'Main Street Cafe', address: '123 Main St, Anytown', phone: '555-1234', hours: '8am - 8pm' },
  { id: '2', name: 'Downtown Deli', address: '456 Oak Ave, Anytown', phone: '555-5678', hours: '9am - 9pm' },
  { id: '3', name: 'Seaside Grill', address: '789 Pine Ln, Anytown', phone: '555-9012', hours: '11am - 10pm' },
];

export const mockAuditLogs: AuditLog[] = [
  { id: '1', user: 'admin@example.com', action: 'Update Branch', details: 'Changed phone for Main Street Cafe', timestamp: '2023-10-27T10:00:00Z' },
  { id: '2', user: 'supervisor@example.com', action: 'Create Order', details: 'Order #1234 created', timestamp: '2023-10-27T11:30:00Z' },
  { id: '3', user: 'admin@example.com', action: 'Update Role', details: 'Permissions updated for Supervisor role', timestamp: '2023-10-26T15:00:00Z' },
];

export const mockOrders: Order[] = [];

export const mockBookings: Booking[] = [
    { id: 'B001', customerName: 'Emily Clark', bookingDate: '2023-11-15', bookingTime: '19:00', guests: 2, status: 'Confirmed' },
    { id: 'B002', customerName: 'Michael Brown', bookingDate: '2023-11-16', bookingTime: '20:00', guests: 4, status: 'Pending' },
    { id: 'B003', customerName: 'Sophia Loren', bookingDate: '2023-11-12', bookingTime: '18:30', guests: 3, status: 'Cancelled' },
];

export const mockMenuItems: MenuItem[] = [
    { id: 'M01', name: 'Classic Burger', category: 'Main Course', price: 12.99, description: 'A juicy beef patty with all the fixings.'},
    { id: 'M02', name: 'Caesar Salad', category: 'Appetizers', price: 8.99, description: 'Crisp romaine with creamy Caesar dressing.'},
    { id: 'M03', name: 'Chocolate Lava Cake', category: 'Desserts', price: 7.50, description: 'Warm chocolate cake with a molten center.'},
];

export const mockBanners: Banner[] = [
    { id: 'BNR01', title: 'Happy Hour Special', imageUrl: 'https://picsum.photos/seed/banner1/1080/400', isActive: true, startDate: '2023-10-01', endDate: '2023-10-31' },
    { id: 'BNR02', title: 'New Winter Menu', imageUrl: 'https://picsum.photos/seed/banner2/1080/400', isActive: false, startDate: '2023-11-01', endDate: '2023-11-30' },
];

export const mockCampaigns: Campaign[] = [
    { id: 'CMP01', name: 'Weekend Promo', targetSegment: 'Frequent Diners', message: 'Get 20% off this weekend!', status: 'Sent', sendDate: '2023-10-20' },
    { id: 'CMP02', name: 'New Customer Welcome', targetSegment: 'New Signups', message: 'Welcome! Enjoy a free appetizer on us.', status: 'Active', sendDate: '' },
    { id: 'CMP03', name: 'Holiday Special', targetSegment: 'All Customers', message: 'Book your holiday party with us!', status: 'Draft', sendDate: '' },
];
