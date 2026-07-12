import { create } from 'zustand';

// --- Premium Employee Mock Data ---

const initialProfile = {
  name: "John Doe",
  employeeId: "EMP-2026-8942",
  department: "Computer Engineering",
  designation: "Senior Software Engineer",
  role: "Employee",
  email: "john.doe@assetflow.com",
  phone: "+1 (555) 234-5678",
  joiningDate: "2024-03-15",
  photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
};

const initialAssets = [
  {
    id: "A001",
    name: "Dell Latitude 7440 Ultrabook",
    code: "AST-DELL-7440",
    serial: "S/N: 92XJ721",
    category: "Electronics (Laptop)",
    status: "Assigned",
    condition: "Excellent",
    allocationDate: "2024-03-16",
    expectedReturnDate: "2027-03-16",
    qrValue: "https://assetflow.com/assets/AST-DELL-7440",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "A002",
    name: "Logitech MX Master 3S Wireless Mouse",
    code: "AST-LOGI-3S",
    serial: "S/N: 48ZJ902",
    category: "Peripherals (Mouse)",
    status: "Assigned",
    condition: "Good",
    allocationDate: "2024-03-16",
    expectedReturnDate: "2026-09-16",
    qrValue: "https://assetflow.com/assets/AST-LOGI-3S",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "A003",
    name: "Dell UltraSharp 34\" Curved Monitor",
    code: "AST-DELL-U34",
    serial: "S/N: 51JK309",
    category: "Peripherals (Monitor)",
    status: "Assigned",
    condition: "Excellent",
    allocationDate: "2024-04-10",
    expectedReturnDate: "2027-04-10",
    qrValue: "https://assetflow.com/assets/AST-DELL-U34",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=80"
  }
];

const initialResources = [
  { id: "R1", name: "Meeting Room Alpha (10 Pax)", category: "Meeting Rooms", capacity: 10, location: "Block A, 3rd Floor", status: "Available" },
  { id: "R2", name: "Conference Room B (25 Pax)", category: "Conference Rooms", capacity: 25, location: "Block C, 1st Floor", status: "Available" },
  { id: "R3", name: "Vite Projector Pro", category: "Projectors", capacity: 1, location: "IT Helpdesk", status: "Available" },
  { id: "R4", name: "Tesla Model Y (Company Vehicle)", category: "Vehicles", capacity: 5, location: "Basement Parking", status: "Available" },
  { id: "R5", name: "Advanced Robotics Lab", category: "Laboratories", capacity: 15, location: "Block D, Lab 4", status: "Available" },
  { id: "R6", name: "DSLR Canon EOS R5 Kit", category: "Equipment", capacity: 1, location: "Media Room", status: "Available" }
];

const initialBookings = [
  { id: "B001", resourceName: "Meeting Room Alpha (10 Pax)", resourceCategory: "Meeting Rooms", date: "2026-07-13", timeStart: "10:00 AM", timeEnd: "11:30 AM", status: "Approved", reason: "Sprint Planning" },
  { id: "B002", resourceName: "Ford Transit Van (Company Vehicle)", resourceCategory: "Vehicles", date: "2026-07-20", timeStart: "09:00 AM", timeEnd: "05:00 PM", status: "Approved", reason: "Field Deployment" },
  { id: "B003", resourceName: "Vite Projector Pro", resourceCategory: "Projectors", date: "2026-07-25", timeStart: "02:00 PM", timeEnd: "04:00 PM", status: "Pending", reason: "Quarterly Review Presentation" }
];

const initialMaintenance = [
  {
    id: "M-101",
    assetName: "Dell Latitude 7440 Ultrabook",
    assetCode: "AST-DELL-7440",
    problem: "Battery backup is low, degrading fast under workload.",
    status: "In Progress",
    submittedDate: "2026-07-10",
    priority: "High",
    timeline: [
      { status: "Submitted", date: "2026-07-10 09:00 AM", note: "Request raised by Employee" },
      { status: "Approved", date: "2026-07-11 02:30 PM", note: "Approved by Asset Manager. Assigned to external vendor Dell Support." },
      { status: "In Progress", date: "2026-07-12 11:00 AM", note: "Device diagnostics running at service center." }
    ]
  },
  {
    id: "M-102",
    assetName: "Logitech MX Master 3S Wireless Mouse",
    assetCode: "AST-LOGI-3S",
    problem: "Scroll wheel tension control mechanism failing.",
    status: "Completed",
    submittedDate: "2026-06-05",
    priority: "Low",
    timeline: [
      { status: "Submitted", date: "2026-06-05 10:15 AM", note: "Request raised by Employee" },
      { status: "Approved", date: "2026-06-05 04:00 PM", note: "Approved by Asset Manager." },
      { status: "Completed", date: "2026-06-08 03:00 PM", note: "Scroll mechanism repaired and returned to Employee." }
    ]
  }
];

const initialRequests = [
  { id: "REQ-301", requestType: "Asset Allocation Request", detail: "Sony WH-1000XM4 Noise-Cancelling Headphones", status: "Pending Approval", submittedDate: "2026-07-11", priority: "High", justification: "Need quiet background for focus/remote coding sessions." },
  { id: "REQ-302", requestType: "Software License Allocation", detail: "JetBrains WebStorm Enterprise License", status: "Approved", submittedDate: "2026-05-12", priority: "Medium", justification: "Required for web development and pair programming." }
];

const initialNotifications = [
  { id: "N1", title: "Maintenance Work In Progress", message: "Your maintenance request M-101 for Dell Latitude 7440 is now diagnostics in progress.", time: "2 hours ago", read: false, category: "maintenance" },
  { id: "N2", title: "Upcoming Asset Return", message: "Your allocated Dell UltraSharp 34\" Monitor return date is in 90 days.", time: "1 day ago", read: false, category: "asset" },
  { id: "N3", title: "Booking Confirmation", message: "Your booking for Ford Transit Van on 2026-07-20 has been approved.", time: "3 days ago", read: true, category: "booking" },
  { id: "N4", title: "System Audit Reminder", message: "Self-Verification audit for your assigned assets is due by the end of July.", time: "4 days ago", read: false, category: "audit" }
];

const initialActivities = [
  { id: 1, action: "Booked Resource", target: "Meeting Room Alpha", time: "2 hours ago", module: "Bookings" },
  { id: 2, action: "Submitted Asset Request", target: "Sony WH-1000XM4", time: "1 day ago", module: "Requests" },
  { id: 3, action: "Updated Profile Contact", target: "Phone Number", time: "2 days ago", module: "Profile" },
  { id: 4, action: "Raised Maintenance Request", target: "Dell Latitude 7440", time: "2 days ago", module: "Maintenance" }
];

// Helper KPI Generator
const computeKpis = (assets, bookings, maintenance, requests, notifications) => ({
  assignedAssets: assets.length,
  upcomingBookings: bookings.filter(b => b.status === "Approved").length,
  pendingMaintenance: maintenance.filter(m => m.status !== "Completed").length,
  openRequests: requests.filter(r => r.status === "Pending Approval").length,
  unreadNotifications: notifications.filter(n => !n.read).length,
  upcomingReturns: assets.filter(a => new Date(a.expectedReturnDate) - new Date() < 90 * 24 * 60 * 60 * 1000).length // Next 90 days
});

// Helper Charts Data Generator
const computeCharts = (bookings) => ({
  bookingStatus: [
    { name: 'Approved', value: bookings.filter(b => b.status === 'Approved').length, color: '#10b981' },
    { name: 'Pending', value: bookings.filter(b => b.status === 'Pending').length, color: '#f59e0b' },
    { name: 'Canceled', value: bookings.filter(b => b.status === 'Canceled').length, color: '#ef4444' },
  ],
  monthlyBookings: [
    { name: 'Jan', bookings: 2 },
    { name: 'Feb', bookings: 5 },
    { name: 'Mar', bookings: 3 },
    { name: 'Apr', bookings: 6 },
    { name: 'May', bookings: 4 },
    { name: 'Jun', bookings: 8 },
    { name: 'Jul', bookings: bookings.length }
  ]
});

// --- Store ---

export const useStore = create((set, get) => ({
  profile: initialProfile,
  myAssets: initialAssets,
  resources: initialResources,
  bookings: initialBookings,
  maintenance: initialMaintenance,
  requests: initialRequests,
  notifications: initialNotifications,
  activities: initialActivities,
  kpi: computeKpis(initialAssets, initialBookings, initialMaintenance, initialRequests, initialNotifications),
  charts: computeCharts(initialBookings),

  // Actions
  updateProfile: (updatedProfile) => set((state) => {
    const profile = { ...state.profile, ...updatedProfile };
    const activities = [
      { id: Date.now(), action: "Updated Profile", target: "Personal Info", time: "Just now", module: "Profile" },
      ...state.activities
    ];
    return { profile, activities };
  }),

  addBooking: (booking) => set((state) => {
    const newBooking = {
      id: `B00${state.bookings.length + 1}`,
      status: "Approved", // Auto-approved for this mockup
      ...booking
    };
    const bookings = [newBooking, ...state.bookings];
    const activities = [
      { id: Date.now(), action: "Booked Resource", target: booking.resourceName, time: "Just now", module: "Bookings" },
      ...state.activities
    ];
    const kpi = computeKpis(state.myAssets, bookings, state.maintenance, state.requests, state.notifications);
    const charts = computeCharts(bookings);
    
    // Add toast notification
    const newNotification = {
      id: `N${Date.now()}`,
      title: "Booking Confirmed",
      message: `Your booking for ${booking.resourceName} has been approved.`,
      time: "Just now",
      read: false,
      category: "booking"
    };
    const notifications = [newNotification, ...state.notifications];

    return { bookings, activities, kpi, charts, notifications };
  }),

  cancelBooking: (id) => set((state) => {
    const bookings = state.bookings.map(b => b.id === id ? { ...b, status: 'Canceled' } : b);
    const deletedBooking = state.bookings.find(b => b.id === id);
    const activities = [
      { id: Date.now(), action: "Canceled Booking", target: deletedBooking ? deletedBooking.resourceName : "Resource", time: "Just now", module: "Bookings" },
      ...state.activities
    ];
    const kpi = computeKpis(state.myAssets, bookings, state.maintenance, state.requests, state.notifications);
    const charts = computeCharts(bookings);
    return { bookings, activities, kpi, charts };
  }),

  addMaintenanceRequest: (req) => set((state) => {
    const newReq = {
      id: `M-${state.maintenance.length + 101}`,
      status: "Pending",
      submittedDate: new Date().toISOString().split('T')[0],
      timeline: [
        { status: "Submitted", date: `${new Date().toISOString().split('T')[0]} Just now`, note: "Request raised by Employee" }
      ],
      ...req
    };
    const maintenance = [newReq, ...state.maintenance];
    const activities = [
      { id: Date.now(), action: "Raised Maintenance", target: req.assetName, time: "Just now", module: "Maintenance" },
      ...state.activities
    ];
    const kpi = computeKpis(state.myAssets, state.bookings, maintenance, state.requests, state.notifications);
    return { maintenance, activities, kpi };
  }),

  addAssetRequest: (req) => set((state) => {
    const newReq = {
      id: `REQ-${state.requests.length + 301}`,
      status: "Pending Approval",
      submittedDate: new Date().toISOString().split('T')[0],
      ...req
    };
    const requests = [newReq, ...state.requests];
    const activities = [
      { id: Date.now(), action: "Submitted Asset Request", target: req.detail, time: "Just now", module: "Requests" },
      ...state.activities
    ];
    const kpi = computeKpis(state.myAssets, state.bookings, state.maintenance, requests, state.notifications);
    return { requests, activities, kpi };
  }),

  markNotificationRead: (id) => set((state) => {
    const notifications = state.notifications.map(n => n.id === id ? { ...n, read: true } : n);
    const kpi = computeKpis(state.myAssets, state.bookings, state.maintenance, state.requests, notifications);
    return { notifications, kpi };
  }),

  markAllNotificationsRead: () => set((state) => {
    const notifications = state.notifications.map(n => ({ ...n, read: true }));
    const kpi = computeKpis(state.myAssets, state.bookings, state.maintenance, state.requests, notifications);
    return { notifications, kpi };
  }),

  deleteNotification: (id) => set((state) => {
    const notifications = state.notifications.filter(n => n.id !== id);
    const kpi = computeKpis(state.myAssets, state.bookings, state.maintenance, state.requests, notifications);
    return { notifications, kpi };
  })
}));
