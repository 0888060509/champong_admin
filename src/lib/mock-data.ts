

import { Timestamp } from 'firebase/firestore';
import type { User, Role, Branch, AuditLog, Order, Booking, MenuItem, Banner, Campaign, Customer, Notification, ChatSession, OptionGroup } from './types';
import type { Collection } from '@/app/(dashboard)/collections/collections-context';

export const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', role: 'Admin' },
  { id: '2', name: 'Supervisor Sam', email: 'supervisor@example.com', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', role: 'Supervisor' },
  { id: '3', name: 'Staff Sarah', email: 'staff@example.com', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d', role: 'Staff' },
];

export const mockCustomers: Customer[] = [
    { id: 'cust_1', name: 'Liam Johnson', email: 'liam@example.com', phone: '555-0101', totalSpent: 1250.50, totalVisits: 15, lastVisit: Timestamp.fromDate(new Date('2024-07-25T14:00:00Z')), avatarUrl: 'https://i.pravatar.cc/150?u=liam', membershipTier: 'Silver' },
    { id: 'cust_2', name: 'Olivia Smith', email: 'olivia@example.com', phone: '555-0102', totalSpent: 850.75, totalVisits: 10, lastVisit: Timestamp.fromDate(new Date('2024-07-28T19:30:00Z')), avatarUrl: 'https://i.pravatar.cc/150?u=olivia', membershipTier: 'Silver' },
    { id: 'cust_3', name: 'Noah Williams', email: 'noah@example.com', phone: '555-0103', totalSpent: 2300.00, totalVisits: 22, lastVisit: Timestamp.fromDate(new Date('2024-07-29T12:15:00Z')), avatarUrl: 'https://i.pravatar.cc/150?u=noah', membershipTier: 'Gold' },
    { id: 'cust_4', name: 'Emma Brown', email: 'emma@example.com', phone: '555-0104', totalSpent: 450.20, totalVisits: 5, lastVisit: Timestamp.fromDate(new Date('2024-06-15T18:45:00Z')), avatarUrl: 'https://i.pravatar.cc/150?u=emma', membershipTier: 'Bronze' },
    { id: 'cust_5', name: 'John Doe', email: 'john.doe@example.com', phone: '555-0105', totalSpent: 182.30, totalVisits: 3, lastVisit: Timestamp.fromDate(new Date('2024-07-20T11:00:00Z')), avatarUrl: 'https://i.pravatar.cc/150?u=john', membershipTier: 'Bronze' },
    { id: 'cust_6', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '555-0106', totalSpent: 320.80, totalVisits: 8, lastVisit: Timestamp.fromDate(new Date('2024-07-22T20:00:00Z')), avatarUrl: 'https://i.pravatar.cc/150?u=jane', membershipTier: 'Bronze' },
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
        status: 'Completed',
        note: 'Please provide extra napkins and disposable utensils.',
        shippingAddress: '123 Ocean View, Anytown, 12345',
        paymentMethod: 'Credit Card (**** **** **** 4242)',
        items: [
            { 
                id: 'item_1', 
                name: 'Classic Burger', 
                quantity: 2, 
                price: 12.99,
                note: 'One well-done, one medium-rare. No onions on the medium-rare one.',
                toppings: [
                    { id: 'top_1', name: 'Extra Cheese', price: 1.50 },
                    { id: 'top_2', name: 'Bacon', price: 2.00 }
                ],
                crossSellItems: [
                    { id: 'M06', name: 'Fries', price: 0 },
                ]
            },
            { 
                id: 'item_2', 
                name: 'Fries', 
                quantity: 1, 
                price: 4.50 
            },
            {
                id: 'item_combo_1',
                name: 'Caesar Salad',
                quantity: 1,
                price: 8.99,
                sideDishes: [
                    { id: 'side_1', name: 'Grilled Chicken', price: 4.00 }
                ]
            }
        ],
        subtotal: 50.47,
        discount: 5.00,
        shippingFee: 3.50,
        total: 48.97,
        amountPaid: 48.97,
        remainingAmount: 0.00,
        history: [
            { id: 'hist_1', timestamp: new Date('2024-07-29T10:05:00Z'), user: 'admin@example.com', action: 'Status changed from Processing to Completed' },
            { id: 'hist_2', timestamp: new Date('2024-07-29T10:00:00Z'), user: 'system', action: 'Order created' },
        ]
    },
    {
        id: 'ord_2',
        customerName: 'Jane Smith',
        date: Timestamp.fromDate(new Date('2024-07-29T11:30:00Z')),
        status: 'Processing',
        items: [
            { id: 'item_3', name: 'Caesar Salad', quantity: 1, price: 8.99 },
            { id: 'item_4', name: 'Iced Tea', quantity: 1, price: 8.50 },
        ],
        subtotal: 17.49,
        discount: 0,
        shippingFee: 5.00,
        total: 22.49,
        amountPaid: 22.49,
        remainingAmount: 0.00,
        paymentMethod: 'Cash on Delivery',
        shippingAddress: '456 Pine St, Anytown, 12345',
         history: [
            { id: 'hist_3', timestamp: new Date('2024-07-29T11:30:00Z'), user: 'system', action: 'Order created' },
        ]
    },
    {
        id: 'ord_3',
        customerName: 'Peter Jones',
        date: Timestamp.fromDate(new Date('2024-07-28T18:00:00Z')),
        status: 'Cancelled',
        items: [
            { id: 'item_5', name: 'Chocolate Lava Cake', quantity: 1, price: 7.50 },
        ],
        subtotal: 7.50,
        total: 7.50,
        amountPaid: 0,
        remainingAmount: 0,
        paymentMethod: 'Credit Card',
         history: [
            { id: 'hist_4', timestamp: new Date('2024-07-28T18:05:00Z'), user: 'admin@example.com', action: 'Status changed from Pending to Cancelled. Reason: Customer Request.' },
            { id: 'hist_5', timestamp: new Date('2024-07-28T18:00:00Z'), user: 'system', action: 'Order created' },
        ]
    },
    {
        id: 'ord_4',
        customerName: 'Liam Johnson',
        date: Timestamp.fromDate(new Date('2024-07-25T14:00:00Z')),
        status: 'Completed',
        items: [
             { id: 'item_1', name: 'Classic Burger', quantity: 2, price: 12.99 },
        ],
        subtotal: 25.98,
        total: 25.98,
        amountPaid: 25.98,
        remainingAmount: 0,
        paymentMethod: 'Credit Card',
    },
    {
        id: 'ord_5',
        customerName: 'Olivia Smith',
        date: Timestamp.fromDate(new Date('2024-07-28T19:30:00Z')),
        status: 'Completed',
        items: [
            { id: 'item_3', name: 'Caesar Salad', quantity: 1, price: 8.99 },
            { id: 'item_5', name: 'Chocolate Lava Cake', quantity: 1, price: 7.50 },
        ],
        subtotal: 16.49,
        total: 16.49,
        amountPaid: 16.49,
        remainingAmount: 0,
        paymentMethod: 'Cash on Delivery',
    }
];

export const mockBookings: Booking[] = [
    { id: 'B001', customerName: 'Emily Clark', bookingDate: '2023-11-15', bookingTime: '19:00', guests: 2, status: 'Confirmed' },
    { id: 'B002', customerName: 'Michael Brown', bookingDate: '2023-11-16', bookingTime: '20:00', guests: 4, status: 'Pending' },
    { id: 'B003', customerName: 'Sophia Loren', bookingDate: '2023-11-12', bookingTime: '18:30', guests: 3, status: 'Cancelled' },
];

export const mockOptionGroups: OptionGroup[] = [
    {
        id: 'OG01',
        name: 'Size',
        type: 'single',
        options: [
            { id: 'O01', name: 'Small', priceAdjustment: 0 },
            { id: 'O02', name: 'Medium', priceAdjustment: 1.50 },
            { id: 'O03', name: 'Large', priceAdjustment: 2.50 },
        ]
    },
    {
        id: 'OG02',
        name: 'Toppings',
        type: 'multiple',
        options: [
            { id: 'O04', name: 'Extra Cheese', priceAdjustment: 1.00 },
            { id: 'O05', name: 'Bacon', priceAdjustment: 2.00 },
            { id: 'O06', name: 'Avocado', priceAdjustment: 1.75 },
        ]
    },
    {
        id: 'OG03',
        name: 'Sugar Level',
        type: 'single',
        options: [
            { id: 'O07', name: '100% Sugar', priceAdjustment: 0 },
            { id: 'O08', name: '70% Sugar', priceAdjustment: 0 },
            { id: 'O09', name: '50% Sugar', priceAdjustment: 0 },
            { id: 'O10', name: '30% Sugar', priceAdjustment: 0 },
            { id: 'O11', name: 'No Sugar', priceAdjustment: 0 },
        ]
    }
];

export const mockMenuItems: MenuItem[] = [
    { id: 'M01', name: 'Classic Burger', category: 'Main Course', price: 12.99, description: 'A juicy beef patty with all the fixings.', isActive: true, optionGroups: [mockOptionGroups[1]], crossSellProductIds: ['M06'] },
    { id: 'M02', name: 'Caesar Salad', category: 'Appetizers', price: 8.99, description: 'Crisp romaine with creamy Caesar dressing.', isActive: true, optionGroups: [] },
    { id: 'M03', name: 'Chocolate Lava Cake', category: 'Desserts', price: 7.50, description: 'Warm chocolate cake with a molten center.', isActive: true, optionGroups: [] },
    { id: 'M04', name: 'Spaghetti Carbonara', category: 'Main Course', price: 15.50, description: 'Classic pasta with pancetta and egg.', isActive: false, optionGroups: [] },
    { id: 'M05', name: 'Iced Coffee', category: 'Drinks', price: 4.50, description: 'Chilled coffee over ice.', isActive: true, optionGroups: [mockOptionGroups[0], mockOptionGroups[2]] },
    { id: 'M06', name: 'Fries', category: 'Appetizers', price: 4.50, description: 'Crispy golden fries.', isActive: true, optionGroups: [] },
];


export const mockBanners: Banner[] = [
    { id: 'BNR01', title: 'Happy Hour Special', imageUrl: 'https://picsum.photos/seed/banner1/1080/400', isActive: true, startDate: '2023-10-01', endDate: '2023-10-31', linkType: 'url', link: 'https://example.com/specials' },
    { id: 'BNR02', title: 'New Winter Menu', imageUrl: 'https://picsum.photos/seed/banner2/1080/400', isActive: false, startDate: '2023-11-01', endDate: '2023-11-30', linkType: 'deeplink', link: 'app://menu/winter' },
];

const generatePerformanceData = () => {
    let opens = 50 + Math.random() * 50;
    let clicks = opens * (Math.random() * 0.5);
    const data = [];
    for (let i = 1; i <= 24; i++) {
        data.push({ hour: i, opens: Math.round(opens), clicks: Math.round(clicks) });
        opens *= (0.8 + Math.random() * 0.2);
        clicks *= (0.7 + Math.random() * 0.25);
    }
    return data;
}


export const mockCampaigns: Campaign[] = [
    { 
        id: 'CMP01', 
        name: 'Weekend BOGO',
        description: 'Buy one get one free on all appetizers this weekend.',
        targetSegment: ['High Spenders'], 
        title: 'Weekend BOGO is on!',
        message: 'Hi {customerName}, enjoy a free appetizer on us this weekend!', 
        status: 'Completed', 
        scheduleDate: new Date('2023-10-20T10:00:00Z').toISOString(),
        sentCount: 1250,
        openRate: 0.23, // 23%
        ctr: 0.08, // 8%
        performanceData: generatePerformanceData(),
        onClickAction: { type: 'None' }
    },
    { 
        id: 'CMP02', 
        name: 'New Customer Welcome',
        description: 'Welcome new users with a discount on their first order.',
        targetSegment: ['New Customers'], 
        title: 'Welcome to AdminWeb!',
        message: 'Thanks for joining! Here\'s 15% off your first order.', 
        status: 'Sending', 
        scheduleDate: null,
        sentCount: 50,
        openRate: 0.68, // 68%
        ctr: 0.25, // 25%
        redemptionRate: 0.15, // 15%
        performanceData: generatePerformanceData(),
        onClickAction: { type: 'Link to Voucher', value: 'VOUCHER_15OFF' }
    },
    { 
        id: 'CMP03', 
        name: 'Holiday Special',
        description: 'Promote holiday party bookings.',
        targetSegment: ['All Customers'], 
        title: 'Book Your Holiday Party!',
        message: 'Planning a holiday event? Book with us and get a special discount.', 
        status: 'Scheduled', 
        scheduleDate: new Date('2023-12-01T09:00:00Z').toISOString(),
        sentCount: 0,
        openRate: 0,
        ctr: 0,
        onClickAction: { type: 'Custom Web Link', value: 'https://example.com/holiday-booking' }
    },
     { 
        id: 'CMP04', 
        name: 'Q4 Marketing Push',
        description: 'Re-engage lapsed customers before the end of the year.',
        targetSegment: ['Lapsed Customers'],
        title: "We've missed you!",
        message: 'Come back and see what\'s new. Here\'s a little something to get you started.', 
        status: 'Draft', 
        scheduleDate: null,
        sentCount: 0,
        openRate: 0,
        ctr: 0,
        onClickAction: { type: 'Link to Product', value: 'PROD_BESTSELLER' }
    },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Order Received',
    description: 'Order #ORD_4 from James Dean for $42.50.',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
  },
  {
    id: '2',
    title: 'Low Stock Warning',
    description: 'Item "Classic Burger" is running low.',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: '3',
    title: 'Booking Confirmed',
    description: 'Booking #B004 for 4 people has been confirmed.',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: '4',
    title: 'New Customer Signup',
    description: 'A new customer, sarah@example.com, has registered.',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
  },
];

export const mockChatSessions: ChatSession[] = [
    {
        id: 'CHAT001',
        customerId: 'cust_2',
        customerName: 'Olivia Smith',
        branchName: 'Main Street Cafe',
        staffName: 'Staff Sarah',
        status: 'Open',
        lastUpdatedAt: Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 15)), // 15 mins ago
        messages: [
            { id: 'msg1', senderType: 'Customer', senderName: 'Olivia Smith', message: 'Hi, can I change my booking for tomorrow?', timestamp: Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 16))},
            { id: 'msg2', senderType: 'Staff', senderName: 'Staff Sarah', message: 'Hello Olivia, sure! What time would you like to change it to?', timestamp: Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 15))}
        ]
    },
    {
        id: 'CHAT002',
        customerId: 'cust_4',
        customerName: 'Emma Brown',
        branchName: 'Downtown Deli',
        staffName: 'Supervisor Sam',
        status: 'Closed',
        lastUpdatedAt: Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 60 * 24)), // 1 day ago
        messages: [
            { id: 'msg3', senderType: 'Customer', senderName: 'Emma Brown', message: 'I left my wallet at your place yesterday, did anyone find it?', timestamp: Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 60 * 24.5))},
            { id: 'msg4', senderType: 'Staff', senderName: 'Staff Sarah', message: 'Let me check for you. Can you describe it?', timestamp: Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 60 * 24.4))},
            { id: 'msg5', senderType: 'System', senderName: 'System', message: 'Session transferred from Staff Sarah to Supervisor Sam', timestamp: Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 60 * 24.3))},
            { id: 'msg6', senderType: 'Staff', senderName: 'Supervisor Sam', message: 'Hi Emma, we found a wallet. We\'ve kept it safe for you.', timestamp: Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 60 * 24.2))},
            { id: 'msg7', senderType: 'Customer', senderName: 'Emma Brown', message: 'Oh thank you so much! I\'ll come by this afternoon.', timestamp: Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 60 * 24.1))},
        ]
    }
]

export const mockCollections: Collection[] = [
    { 
      id: '1', 
      name: 'High Profit Items',
      publicTitle: "Chef's Recommendations",
      description: 'Items with a high profit margin, great for upselling.',
      productCount: 12, 
      isActive: true,
      root: { type: 'group', logic: 'AND', conditions: [{type: 'condition', id: 'cond-1', criteria: 'profit_margin', operator: 'gte', value: 40}]}
    },
    { 
      id: '2', 
      name: 'Low Stock Specials', 
      publicTitle: "Last Chance to Buy!",
      description: 'Clear out items that are low in stock.',
      productCount: 8, 
      isActive: true,
      root: { type: 'group', logic: 'AND', conditions: [{type: 'condition', id: 'cond-2', criteria: 'stock_level', operator: 'lte', value: 10}]}
    },
    { 
      id: '3', 
      name: 'Weekend Dessert Specials', 
      publicTitle: "Sweet Weekend Deals",
      description: 'Special desserts featured only on weekends.',
      productCount: 4, 
      isActive: false,
      root: { 
          type: 'group',
          logic: 'AND', 
          conditions: [
              {type: 'condition', id: 'cond-3a', criteria: 'tags', operator: 'contains', value: 'weekend_special'},
              {type: 'condition', id: 'cond-3b', criteria: 'category', operator: 'eq', value: 'Desserts'}
          ]
      }
    },
     { 
      id: '4', 
      name: 'Premium Main Courses', 
      productCount: 7, 
      publicTitle: "Premium Entrees",
      description: 'Top-tier main courses for discerning customers.',
      isActive: true,
      root: { 
          type: 'group',
          logic: 'AND',
          conditions: [
              {type: 'condition', id: 'cond-4a', criteria: 'category', operator: 'eq', value: 'Main Course'},
              {type: 'condition', id: 'cond-4b', criteria: 'price', operator: 'gte', value: 25}
          ]
      }
    },
  ];



    

    

