import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchFeaturedHotels = createAsyncThunk(
  'hotel/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/hotels/featured/list');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchHotels = createAsyncThunk(
  'hotel/search',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/hotels/search', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchHotelList = createAsyncThunk(
  'hotel/fetchList',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/hotels/list', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchHotelDetail = createAsyncThunk(
  'hotel/fetchDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/hotels/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchHotelRooms = createAsyncThunk(
  'hotel/fetchRooms',
  async ({ id, checkin, checkout }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/hotels/${id}/rooms`, {
        params: { checkin, checkout },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  featured: [],
  hotels: [],
  currentHotel: null,
  rooms: [],
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  },
  searchParams: {
    city: '上海',
    keyword: '',
    checkin: '',
    checkout: '',
    nights: 0,
    star_rating: null,
    min_price: null,
    max_price: null,
  },
  loading: false,
  error: null,
};

const hotelSlice = createSlice({
  name: 'hotel',
  initialState,
  reducers: {
    setSearchParams: (state, action) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
    },
    resetSearchParams: (state) => {
      state.searchParams = initialState.searchParams;
    },
    clearCurrentHotel: (state) => {
      state.currentHotel = null;
      state.rooms = [];
    },
    appendHotels: (state, action) => {
      state.hotels = [...state.hotels, ...action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeaturedHotels.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.featured = action.payload;
      })
      .addCase(fetchFeaturedHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchHotels.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = action.payload.data;
        state.pagination.total = action.payload.total;
      })
      .addCase(searchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchHotelList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHotelList.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.pagination.page === 1) {
          state.hotels = action.payload.data;
        } else {
          state.hotels = [...state.hotels, ...action.payload.data];
        }
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchHotelList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchHotelDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHotelDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentHotel = action.payload;
      })
      .addCase(fetchHotelDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchHotelRooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHotelRooms.fulfilled, (state, action) => {
        state.loading = false;
        const sortedRooms = [...action.payload].sort(
          (a, b) => a.base_price - b.base_price
        );
        state.rooms = sortedRooms;
      })
      .addCase(fetchHotelRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchParams, resetSearchParams, clearCurrentHotel, appendHotels } = hotelSlice.actions;
export default hotelSlice.reducer;
