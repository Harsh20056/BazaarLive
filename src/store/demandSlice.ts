import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DemandAlert {
  id: string;
  item: string;
  description: string;
  buyerName: string;
  location: string;
  timestamp: string;
  votes: number;
  category: string;
  urgency: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'Fulfilled';
}

const initialDemands: DemandAlert[] = [
  {
    id: 'd1',
    item: 'Organic Honey',
    description: 'Looking for pure, unprocessed organic honey. Willing to pay premium price.',
    buyerName: 'Priya S.',
    location: 'Koramangala, Bengaluru',
    timestamp: '10 min ago',
    votes: 8,
    category: 'Specialty',
    urgency: 'Medium',
    status: 'Open',
  },
  {
    id: 'd2',
    item: 'A2 Cow Milk',
    description: 'Need A2 milk from desi cows, minimum 2L daily delivery.',
    buyerName: 'Rahul M.',
    location: 'HSR Layout, Bengaluru',
    timestamp: '25 min ago',
    votes: 14,
    category: 'Dairy',
    urgency: 'High',
    status: 'Open',
  },
  {
    id: 'd3',
    item: 'Cold-pressed Coconut Oil',
    description: 'Looking for cold-pressed virgin coconut oil, 500ml.',
    buyerName: 'Anjali K.',
    location: 'Indiranagar, Bengaluru',
    timestamp: '1 hr ago',
    votes: 5,
    category: 'Oil',
    urgency: 'Low',
    status: 'Open',
  },
  {
    id: 'd4',
    item: 'Quinoa',
    description: 'White quinoa, 500g pack. Regular requirement every week.',
    buyerName: 'Arjun T.',
    location: 'Whitefield, Bengaluru',
    timestamp: '2 hr ago',
    votes: 3,
    category: 'Grains',
    urgency: 'Low',
    status: 'Open',
  },
  {
    id: 'd5',
    item: 'Free-range Eggs',
    description: 'Free-range eggs, no caged hens. Minimum 2 dozen per week.',
    buyerName: 'Meena R.',
    location: 'JP Nagar, Bengaluru',
    timestamp: '3 hr ago',
    votes: 11,
    category: 'Eggs',
    urgency: 'High',
    status: 'Open',
  },
  {
    id: 'd6',
    item: 'Millet Flour Mix',
    description: 'Multi-millet flour (ragi, jowar, bajra) blend, 1kg pack.',
    buyerName: 'Vikram P.',
    location: 'Marathahalli, Bengaluru',
    timestamp: '5 hr ago',
    votes: 7,
    category: 'Grains',
    urgency: 'Medium',
    status: 'Fulfilled',
  },
];

const demandSlice = createSlice({
  name: 'demands',
  initialState: initialDemands,
  reducers: {
    addDemand: (state, action: PayloadAction<Omit<DemandAlert, 'id' | 'timestamp' | 'votes' | 'status'>>) => {
      const newDemand: DemandAlert = {
        ...action.payload,
        id: `d${Date.now()}`,
        timestamp: 'Just now',
        votes: 1,
        status: 'Open',
      };
      state.unshift(newDemand);
    },
    upvoteDemand: (state, action: PayloadAction<string>) => {
      const demand = state.find(d => d.id === action.payload);
      if (demand) {
        demand.votes += 1;
      }
    },
    fulfillDemand: (state, action: PayloadAction<string>) => {
      const demand = state.find(d => d.id === action.payload);
      if (demand) {
        demand.status = 'Fulfilled';
      }
    },
  },
});

export const { addDemand, upvoteDemand, fulfillDemand } = demandSlice.actions;
export default demandSlice.reducer;
