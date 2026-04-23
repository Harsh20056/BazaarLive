import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface ReviewsState {
  reviews: Review[];
}

const initialState: ReviewsState = {
  reviews: [
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
  ],
};

export interface AddReviewPayload {
  shopId: string;
  buyerName: string;
  rating: number;
  comment: string;
}

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    addReview: (state, action: PayloadAction<AddReviewPayload>) => {
      const { shopId, buyerName, rating, comment } = action.payload;
      
      // Generate a unique ID
      const newId = `r${Date.now()}`;
      
      // Create avatar from name initials
      const avatar = buyerName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .slice(0, 2);
      
      const newReview: Review = {
        id: newId,
        shopId,
        buyerName,
        rating,
        comment,
        timestamp: 'Just now',
        verified: false, // New reviews start as unverified
        avatar,
      };
      
      // Add the new review to the beginning of the array (most recent first)
      state.reviews.unshift(newReview);
    },
  },
});

export const { addReview } = reviewsSlice.actions;
export default reviewsSlice.reducer;