import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type StockStatus = 'In Stock' | 'Low' | 'Out';

export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  basePrice: number;
  currentPrice: number;
  shopId: string;
  stockStatus: StockStatus;
  lastUpdated: string;
  isFlagged?: boolean; // Anti-monopoly flag
}

const initialProducts: Product[] = [
  // Shop 1 - Green Basket Grocers
  { id: 'p1', name: 'Full Cream Milk', category: 'Dairy', unit: '1L', basePrice: 60, currentPrice: 60, shopId: 'shop1', stockStatus: 'In Stock', lastUpdated: '2 min ago' },
  { id: 'p2', name: 'Farm Eggs', category: 'Eggs', unit: 'dozen', basePrice: 80, currentPrice: 80, shopId: 'shop1', stockStatus: 'In Stock', lastUpdated: '5 min ago' },
  { id: 'p3', name: 'Basmati Rice', category: 'Grains', unit: '1kg', basePrice: 90, currentPrice: 95, shopId: 'shop1', stockStatus: 'Low', lastUpdated: '1 hr ago' },
  { id: 'p4', name: 'Sunflower Oil', category: 'Oil', unit: '1L', basePrice: 130, currentPrice: 130, shopId: 'shop1', stockStatus: 'In Stock', lastUpdated: '30 min ago' },
  { id: 'p5', name: 'Wheat Flour', category: 'Grains', unit: '1kg', basePrice: 45, currentPrice: 45, shopId: 'shop1', stockStatus: 'In Stock', lastUpdated: '2 hr ago' },
  { id: 'p6', name: 'Tomatoes', category: 'Vegetables', unit: '1kg', basePrice: 40, currentPrice: 40, shopId: 'shop1', stockStatus: 'In Stock', lastUpdated: '10 min ago' },
  { id: 'p7', name: 'Onions', category: 'Vegetables', unit: '1kg', basePrice: 35, currentPrice: 35, shopId: 'shop1', stockStatus: 'Low', lastUpdated: '15 min ago' },
  { id: 'p8', name: 'Potatoes', category: 'Vegetables', unit: '1kg', basePrice: 30, currentPrice: 30, shopId: 'shop1', stockStatus: 'Out', lastUpdated: '3 hr ago' },
  { id: 'p9', name: 'Organic Honey', category: 'Specialty', unit: '500g', basePrice: 350, currentPrice: 360, shopId: 'shop1', stockStatus: 'In Stock', lastUpdated: '1 day ago' },
  { id: 'p10', name: 'Green Lentils', category: 'Pulses', unit: '1kg', basePrice: 120, currentPrice: 120, shopId: 'shop1', stockStatus: 'In Stock', lastUpdated: '4 hr ago' },
  // Shop 2 - Daily Fresh Mart
  { id: 'p11', name: 'Full Cream Milk', category: 'Dairy', unit: '1L', basePrice: 60, currentPrice: 62, shopId: 'shop2', stockStatus: 'In Stock', lastUpdated: '3 min ago' },
  { id: 'p12', name: 'Farm Eggs', category: 'Eggs', unit: 'dozen', basePrice: 80, currentPrice: 75, shopId: 'shop2', stockStatus: 'In Stock', lastUpdated: '20 min ago' },
  { id: 'p13', name: 'Basmati Rice', category: 'Grains', unit: '1kg', basePrice: 90, currentPrice: 88, shopId: 'shop2', stockStatus: 'In Stock', lastUpdated: '45 min ago' },
  { id: 'p14', name: 'Sunflower Oil', category: 'Oil', unit: '1L', basePrice: 130, currentPrice: 135, shopId: 'shop2', stockStatus: 'In Stock', lastUpdated: '1 hr ago' },
  { id: 'p15', name: 'Wheat Flour', category: 'Grains', unit: '1kg', basePrice: 45, currentPrice: 48, shopId: 'shop2', stockStatus: 'In Stock', lastUpdated: '2 hr ago' },
  { id: 'p16', name: 'Tomatoes', category: 'Vegetables', unit: '1kg', basePrice: 40, currentPrice: 38, shopId: 'shop2', stockStatus: 'In Stock', lastUpdated: '5 min ago' },
  { id: 'p17', name: 'Onions', category: 'Vegetables', unit: '1kg', basePrice: 35, currentPrice: 32, shopId: 'shop2', stockStatus: 'In Stock', lastUpdated: '8 min ago' },
  { id: 'p18', name: 'Potatoes', category: 'Vegetables', unit: '1kg', basePrice: 30, currentPrice: 28, shopId: 'shop2', stockStatus: 'In Stock', lastUpdated: '12 min ago' },
  { id: 'p19', name: 'Organic Honey', category: 'Specialty', unit: '500g', basePrice: 350, currentPrice: 340, shopId: 'shop2', stockStatus: 'Low', lastUpdated: '2 hr ago' },
  { id: 'p20', name: 'Green Lentils', category: 'Pulses', unit: '1kg', basePrice: 120, currentPrice: 115, shopId: 'shop2', stockStatus: 'In Stock', lastUpdated: '3 hr ago' },
  // Shop 3 - Kumar General Store
  { id: 'p21', name: 'Full Cream Milk', category: 'Dairy', unit: '1L', basePrice: 60, currentPrice: 58, shopId: 'shop3', stockStatus: 'In Stock', lastUpdated: '10 min ago' },
  { id: 'p22', name: 'Farm Eggs', category: 'Eggs', unit: 'dozen', basePrice: 80, currentPrice: 85, shopId: 'shop3', stockStatus: 'Low', lastUpdated: '1 hr ago' },
  { id: 'p23', name: 'Basmati Rice', category: 'Grains', unit: '1kg', basePrice: 90, currentPrice: 92, shopId: 'shop3', stockStatus: 'In Stock', lastUpdated: '2 hr ago' },
  { id: 'p24', name: 'Sunflower Oil', category: 'Oil', unit: '1L', basePrice: 130, currentPrice: 128, shopId: 'shop3', stockStatus: 'In Stock', lastUpdated: '30 min ago' },
  { id: 'p25', name: 'Wheat Flour', category: 'Grains', unit: '1kg', basePrice: 45, currentPrice: 44, shopId: 'shop3', stockStatus: 'Out', lastUpdated: '5 hr ago' },
  { id: 'p26', name: 'Tomatoes', category: 'Vegetables', unit: '1kg', basePrice: 40, currentPrice: 42, shopId: 'shop3', stockStatus: 'In Stock', lastUpdated: '25 min ago' },
  // Shop 4 - Organic Valley (Premium prices - some flagged)
  { id: 'p27', name: 'Full Cream Milk', category: 'Dairy', unit: '1L', basePrice: 60, currentPrice: 85, shopId: 'shop4', stockStatus: 'In Stock', lastUpdated: '1 min ago', isFlagged: true },
  { id: 'p28', name: 'Farm Eggs', category: 'Eggs', unit: 'dozen', basePrice: 80, currentPrice: 110, shopId: 'shop4', stockStatus: 'In Stock', lastUpdated: '5 min ago', isFlagged: true },
  { id: 'p29', name: 'Organic Honey', category: 'Specialty', unit: '500g', basePrice: 350, currentPrice: 380, shopId: 'shop4', stockStatus: 'In Stock', lastUpdated: '1 hr ago' },
  { id: 'p30', name: 'Basmati Rice', category: 'Grains', unit: '1kg', basePrice: 90, currentPrice: 96, shopId: 'shop4', stockStatus: 'In Stock', lastUpdated: '3 hr ago' },
  { id: 'p31', name: 'Green Lentils', category: 'Pulses', unit: '1kg', basePrice: 120, currentPrice: 125, shopId: 'shop4', stockStatus: 'Low', lastUpdated: '6 hr ago' },
  // Shop 5 - City Bazaar
  { id: 'p32', name: 'Full Cream Milk', category: 'Dairy', unit: '1L', basePrice: 60, currentPrice: 56, shopId: 'shop5', stockStatus: 'In Stock', lastUpdated: '20 min ago' },
  { id: 'p33', name: 'Farm Eggs', category: 'Eggs', unit: 'dozen', basePrice: 80, currentPrice: 78, shopId: 'shop5', stockStatus: 'In Stock', lastUpdated: '45 min ago' },
  { id: 'p34', name: 'Basmati Rice', category: 'Grains', unit: '1kg', basePrice: 90, currentPrice: 85, shopId: 'shop5', stockStatus: 'Low', lastUpdated: '2 hr ago' },
  { id: 'p35', name: 'Sunflower Oil', category: 'Oil', unit: '1L', basePrice: 130, currentPrice: 122, shopId: 'shop5', stockStatus: 'Out', lastUpdated: '4 hr ago' },
  { id: 'p36', name: 'Tomatoes', category: 'Vegetables', unit: '1kg', basePrice: 40, currentPrice: 35, shopId: 'shop5', stockStatus: 'In Stock', lastUpdated: '15 min ago' },
  { id: 'p37', name: 'Onions', category: 'Vegetables', unit: '1kg', basePrice: 35, currentPrice: 30, shopId: 'shop5', stockStatus: 'In Stock', lastUpdated: '30 min ago' },
  { id: 'p38', name: 'Wheat Flour', category: 'Grains', unit: '1kg', basePrice: 45, currentPrice: 43, shopId: 'shop5', stockStatus: 'In Stock', lastUpdated: '1 hr ago' },
];

const productSlice = createSlice({
  name: 'products',
  initialState: initialProducts,
  reducers: {
    updatePrice: (state, action: PayloadAction<{ id: string; price: number }>) => {
      const product = state.find(p => p.id === action.payload.id);
      if (product) {
        product.currentPrice = action.payload.price;
        product.lastUpdated = 'Just now';
      }
    },
    toggleStock: (state, action: PayloadAction<{ id: string; status: StockStatus }>) => {
      const product = state.find(p => p.id === action.payload.id);
      if (product) {
        product.stockStatus = action.payload.status;
        product.lastUpdated = 'Just now';
      }
    },
  },
});

export const { updatePrice, toggleStock } = productSlice.actions;
export default productSlice.reducer;
