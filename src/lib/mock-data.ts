

import { Timestamp } from 'firebase/firestore';
import type { User, Role, Branch, AuditLog, Order, Booking, MenuItem, Banner, Campaign, Customer } from './types';

export const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', role: 'Admin' },
  { id: '2', name: 'Supervisor Sam', email: 'supervisor@example.com', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', role: 'Supervisor' },
  { id: '3', name: 'Staff Sarah', email: 'staff@example.com', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d', role: 'Staff' },
];

export const mockCustomers: Customer[] = [
    { id: 'cust_1', name: 'Liam Johnson', email: 'liam@example.com', totalSpent: 1250.50, totalVisits: 15, lastVisit: Timestamp.fromDate(new Date('2024-07-25T14:00:00Z')), avatarUrl: 'https://i.pravatar.cc/150?u=liam' },
    { id: 'cust_2', name: 'Olivia Smith', email: 'olivia@example.com', totalSpent: 850.75, totalVisits: 10, lastVisit: Timestamp.fromDate(new Date('2024-07-28T19:30:00Z')), avatarUrl: 'https://i.pravatar.cc/150?u=olivia' },
    { id: 'cust_3', name: 'Noah Williams', email: 'noah@example.com', totalSpent: 2300.00, totalVisits: 22, lastVisit: Timestamp.fromDate(new Date('2024-07-29T12:15:00Z')), avatarUrl: 'https://i.pravatar.cc/150?u=noah' },
    { id: 'cust_4', name: 'Emma Brown', email: 'emma@example.com', totalSpent: 450.20, totalVisits: 5, lastVisit: Timestamp.fromDate(new Date('2024-06-15T18:45:00Z')), avatarUrl: 'https://i.pravatar.cc/150?u=emma' },
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

export const mockOrders: Order[] = [
    {
        id: 'ord_1',
        customerName: 'John Doe',
        date: Timestamp.fromDate(new Date('2024-07-29T10:00:00Z')),
        total: 34.98,
        status: 'Completed',
        items: [
            { id: 'item_1', name: 'Classic Burger', quantity: 2, price: 12.99 },
            { id: 'item_2', name: 'Fries', quantity: 2, price: 4.50 },
        ],
        history: [
            { id: 'hist_1', timestamp: Timestamp.fromDate(new Date('2024-07-29T10:05:00Z')), user: 'admin@example.com', action: 'Status changed from Processing to Completed' },
            { id: 'hist_2', timestamp: Timestamp.fromDate(new Date('2024-07-29T10:00:00Z')), user: 'system', action: 'Order created' },
        ]
    },
    {
        id: 'ord_2',
        customerName: 'Jane Smith',
        date: Timestamp.fromDate(new Date('2024-07-29T11:30:00Z')),
        total: 17.49,
        status: 'Processing',
        items: [
            { id: 'item_3', name: 'Caesar Salad', quantity: 1, price: 8.99 },
            { id: 'item_4', name: 'Iced Tea', quantity: 1, price: 8.50 },
        ],
         history: [
            { id: 'hist_3', timestamp: Timestamp.fromDate(new Date('2024-07-29T11:30:00Z')), user: 'system', action: 'Order created' },
        ]
    },
    {
        id: 'ord_3',
        customerName: 'Peter Jones',
        date: Timestamp.fromDate(new Date('2024-07-28T18:00:00Z')),
        total: 7.50,
        status: 'Cancelled',
        items: [
            { id: 'item_5', name: 'Chocolate Lava Cake', quantity: 1, price: 7.50 },
        ],
         history: [
            { id: 'hist_4', timestamp: Timestamp.fromDate(new Date('2024-07-28T18:05:00Z')), user: 'admin@example.com', action: 'Status changed from Pending to Cancelled' },
            { id: 'hist_5', timestamp: Timestamp.fromDate(new Date('2024-07-28T18:00:00Z')), user: 'system', action: 'Order created' },
        ]
    }
];

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
    { id: 'BNR01', title: 'Happy Hour Special', imageUrl: 'https://picsum.photos/seed/banner1/1080/400', isActive: true, startDate: '2023-10-01', endDate: '2023-10-31', linkType: 'url', link: 'https://example.com/specials' },
    { id: 'BNR02', title: 'New Winter Menu', imageUrl: 'https://picsum.photos/seed/banner2/1080/400', isActive: false, startDate: '2023-11-01', endDate: '2023-11-30', linkType: 'deeplink', link: 'app://menu/winter' },
];

export const mockCampaigns: Campaign[] = [
    { id: 'CMP01', name: 'Weekend Promo', targetSegment: 'Frequent Diners', message: 'Get 20% off this weekend!', status: 'Sent', sendDate: '2023-10-20' },
    { id: 'CMP02', name: 'New Customer Welcome', targetSegment: 'New Signups', message: 'Welcome! Enjoy a free appetizer on us.', status: 'Active', sendDate: '' },
    { id: 'CMP03', name: 'Holiday Special', targetSegment: 'All Customers', message: 'Book your holiday party with us!', status: 'Draft', sendDate: '' },
];
