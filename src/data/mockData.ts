export interface Shop {
  id: string;
  name: string;
  owner: string;
  distance: number;
  rating: number;
  reviewCount: number;
  address: string;
  lat: number;
  lng: number;
  verified: boolean;
  isOpen: boolean;
  phone: string;
  tags: string[];
  coverImage: string;
  ownerImage: string;
  memberSince: string;
}

export const shops: Shop[] = [
  {
    id: 'shop1',
    name: 'Green Basket Grocers',
    owner: 'Ramesh Kumar',
    distance: 0.5,
    rating: 4.8,
    reviewCount: 142,
    address: "12 MP Nagar Zone-I, Bhopal, Madhya Pradesh 462011, India",
    lat: 12.9352,
    lng: 77.6245,
    verified: true,
    isOpen: true,
    phone: '+91 98765 43210',
    tags: ['Organic', 'Dairy', 'Fresh Produce'],
    coverImage: 'https://images.unsplash.com/photo-1568477070631-5bfef06fdf44?w=400',
    ownerImage: 'https://images.unsplash.com/photo-1727159166330-046fead13394?w=100',
    memberSince: 'March 2023',
  },
  {
    id: 'shop2',
    name: 'Daily Fresh Mart',
    owner: 'Priya Sharma',
    distance: 1.2,
    rating: 4.5,
    reviewCount: 89,
    address: '34 MP Nagar Zone-II, Bhopal, Madhya Pradesh 462011, India',
    lat: 12.9116,
    lng: 77.6446,
    verified: true,
    isOpen: true,
    phone: '+91 98765 43211',
    tags: ['Budget-friendly', 'Bulk Buy', 'Grains'],
    coverImage: 'https://images.unsplash.com/photo-1724122013476-66ab604609f9?w=400',
    ownerImage: 'https://images.unsplash.com/photo-1727159166330-046fead13394?w=100',
    memberSince: 'June 2023',
  },
  {
    id: 'shop3',
    name: 'Kumar General Store',
    owner: 'Vijay Kumar',
    distance: 2.1,
    rating: 4.2,
    reviewCount: 203,
    address: '56 Arera Colony, Bhopal, Madhya Pradesh 462016, India',
    lat: 12.9719,
    lng: 77.6412,
    verified: false,
    isOpen: true,
    phone: '+91 98765 43212',
    tags: ['All Essentials', 'Daily Needs'],
    coverImage: 'https://images.unsplash.com/photo-1568477070631-5bfef06fdf44?w=400',
    ownerImage: 'https://images.unsplash.com/photo-1727159166330-046fead13394?w=100',
    memberSince: 'January 2023',
  },
  {
    id: 'shop4',
    name: 'Organic Valley',
    owner: 'Meena Patel',
    distance: 2.8,
    rating: 4.9,
    reviewCount: 67,
    address: '22 TT Nagar, Bhopal, Madhya Pradesh 462003, India',
    lat: 12.9082,
    lng: 77.6476,
    verified: true,
    isOpen: false,
    phone: '+91 98765 43213',
    tags: ['100% Organic', 'Premium', 'Health Foods'],
    coverImage: 'https://images.unsplash.com/photo-1724122013476-66ab604609f9?w=400',
    ownerImage: 'https://images.unsplash.com/photo-1727159166330-046fead13394?w=100',
    memberSince: 'August 2023',
  },
  {
    id: 'shop5',
    name: 'City Bazaar',
    owner: 'Hari Singh',
    distance: 3.5,
    rating: 4.0,
    reviewCount: 312,
    address: '18 Shyamla Hills, Bhopal, Madhya Pradesh 462002, India',
    lat: 12.9831,
    lng: 77.6101,
    verified: false,
    isOpen: true,
    phone: '+91 98765 43214',
    tags: ['Wholesale', 'Large Quantity', 'Competitive'],
    coverImage: 'https://images.unsplash.com/photo-1568477070631-5bfef06fdf44?w=400',
    ownerImage: 'https://images.unsplash.com/photo-1727159166330-046fead13394?w=100',
    memberSince: 'December 2022',
  },
];

export interface Review {
  id: string;
  shopId: string;
  buyerName: string;
  rating: number;
  comment: string;
  timestamp: string;
  verified: boolean;
  avatar: string;
}

export const reviews: Review[] = [
  {
    id: 'r1', shopId: 'shop1', buyerName: 'Ananya M.', rating: 5,
    comment: 'Prices are always up-to-date! Ramesh updates the board every morning. Best milk in the area.',
    timestamp: '2 days ago', verified: true,
    avatar: 'AM',
  },
  {
    id: 'r2', shopId: 'shop1', buyerName: 'Kiran B.', rating: 5,
    comment: 'Love that I can check prices before visiting. No more price surprises. Highly recommend!',
    timestamp: '4 days ago', verified: true,
    avatar: 'KB',
  },
  {
    id: 'r3', shopId: 'shop1', buyerName: 'Deepa R.', rating: 4,
    comment: 'Good variety and honest pricing. Sometimes onions go low stock quickly.',
    timestamp: '1 week ago', verified: false,
    avatar: 'DR',
  },
  {
    id: 'r4', shopId: 'shop2', buyerName: 'Suresh P.', rating: 5,
    comment: 'Best prices in the area for eggs! Priya is very transparent with her prices.',
    timestamp: '1 day ago', verified: true,
    avatar: 'SP',
  },
  {
    id: 'r5', shopId: 'shop2', buyerName: 'Lakshmi N.', rating: 4,
    comment: 'Good deals on flour and grains. Prices updated daily which is very helpful.',
    timestamp: '3 days ago', verified: true,
    avatar: 'LN',
  },
  {
    id: 'r6', shopId: 'shop3', buyerName: 'Rohit K.', rating: 4,
    comment: 'Reliable shop, been a customer for 2 years. Fair prices always.',
    timestamp: '5 days ago', verified: false,
    avatar: 'RK',
  },
  {
    id: 'r7', shopId: 'shop4', buyerName: 'Nisha V.', rating: 5,
    comment: 'Worth every rupee! The organic honey here is authentic. Meena is very knowledgeable.',
    timestamp: '3 days ago', verified: true,
    avatar: 'NV',
  },
  {
    id: 'r8', shopId: 'shop5', buyerName: 'Mohan D.', rating: 4,
    comment: 'Great for buying in bulk. Best wholesale prices in the 5km radius.',
    timestamp: '1 week ago', verified: false,
    avatar: 'MD',
  },
];

export const priceHistory: Record<string, { day: string; price: number }[]> = {
  'Full Cream Milk': [
    { day: 'Mon', price: 58 }, { day: 'Tue', price: 60 }, { day: 'Wed', price: 60 },
    { day: 'Thu', price: 62 }, { day: 'Fri', price: 60 }, { day: 'Sat', price: 60 }, { day: 'Sun', price: 60 },
  ],
  'Farm Eggs': [
    { day: 'Mon', price: 75 }, { day: 'Tue', price: 78 }, { day: 'Wed', price: 80 },
    { day: 'Thu', price: 80 }, { day: 'Fri', price: 82 }, { day: 'Sat', price: 80 }, { day: 'Sun', price: 80 },
  ],
  'Basmati Rice': [
    { day: 'Mon', price: 88 }, { day: 'Tue', price: 88 }, { day: 'Wed', price: 90 },
    { day: 'Thu', price: 92 }, { day: 'Fri', price: 95 }, { day: 'Sat', price: 95 }, { day: 'Sun', price: 95 },
  ],
  'Tomatoes': [
    { day: 'Mon', price: 55 }, { day: 'Tue', price: 48 }, { day: 'Wed', price: 42 },
    { day: 'Thu', price: 40 }, { day: 'Fri', price: 38 }, { day: 'Sat', price: 35 }, { day: 'Sun', price: 40 },
  ],
  'Sunflower Oil': [
    { day: 'Mon', price: 128 }, { day: 'Tue', price: 130 }, { day: 'Wed', price: 130 },
    { day: 'Thu', price: 132 }, { day: 'Fri', price: 130 }, { day: 'Sat', price: 130 }, { day: 'Sun', price: 130 },
  ],
};
