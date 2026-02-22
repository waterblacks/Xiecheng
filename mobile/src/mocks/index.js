import { featuredHotels, hotelList, hotelDetail, hotelRooms, categories } from './hotels';

const matchUrl = (url, pattern) => {
  const regex = new RegExp(`^${pattern.replace(/:id/g, '(\\d+)')}$`);
  const match = url.replace(/^\/api/, '').split('?')[0].match(regex);
  return match ? match[1] : null;
};

const mockHandlers = {
  'GET /hotels/featured/list': () => ({
    success: true,
    data: featuredHotels,
  }),

  'GET /hotels/list': (params) => {
    let filtered = [...hotelList];
    if (params?.city) {
      filtered = filtered.filter((h) => h.address.includes(params.city));
    }
    if (params?.star_rating) {
      filtered = filtered.filter((h) => h.star_rating === parseInt(params.star_rating));
    }
    if (params?.min_price) {
      filtered = filtered.filter((h) => h.min_price >= parseInt(params.min_price));
    }
    if (params?.max_price) {
      filtered = filtered.filter((h) => h.min_price <= parseInt(params.max_price));
    }
    
    if (params?.sort_by === 'min_price' && params?.sort_order === 'ASC') {
      filtered.sort((a, b) => a.min_price - b.min_price);
    } else if (params?.sort_by === 'min_price' && params?.sort_order === 'DESC') {
      filtered.sort((a, b) => b.min_price - a.min_price);
    } else if (params?.sort_by === 'star_rating') {
      filtered.sort((a, b) => b.star_rating - a.star_rating);
    }
    
    const page = parseInt(params?.page) || 1;
    const pageSize = parseInt(params?.pageSize) || 10;
    const start = (page - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);

    return {
      success: true,
      data: paged,
      pagination: {
        page,
        pageSize,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / pageSize),
      },
    };
  },

  'GET /hotels/search': (params) => {
    let matched = [];
    let other = [];
    
    if (params?.keyword) {
      const kw = params.keyword.toLowerCase();
      const kwCn = params.keyword;
      
      hotelList.forEach((h) => {
        const nameMatch = h.name_cn.includes(kwCn) || h.name_en.toLowerCase().includes(kw);
        const addressMatch = h.address.includes(kwCn);
        
        if (nameMatch || addressMatch) {
          matched.push({ ...h, is_matched: true });
        } else {
          other.push({ ...h, is_matched: false });
        }
      });
    } else {
      matched = hotelList.map(h => ({ ...h, is_matched: true }));
    }
    
    if (params?.city) {
      matched = matched.filter((h) => h.address.includes(params.city));
      other = other.filter((h) => h.address.includes(params.city));
    }
    if (params?.star_rating) {
      matched = matched.filter((h) => h.star_rating === parseInt(params.star_rating));
      other = other.filter((h) => h.star_rating === parseInt(params.star_rating));
    }
    if (params?.min_price) {
      matched = matched.filter((h) => h.min_price >= parseInt(params.min_price));
      other = other.filter((h) => h.min_price >= parseInt(params.min_price));
    }
    if (params?.max_price) {
      matched = matched.filter((h) => h.min_price <= parseInt(params.max_price));
      other = other.filter((h) => h.min_price <= parseInt(params.max_price));
    }
    
    const allResults = [...matched, ...other];
    
    return {
      success: true,
      data: allResults,
      total: allResults.length,
      matched_count: matched.length,
    };
  },

  'GET /hotels/:id': (params, id) => ({
    success: true,
    data: hotelDetail[id] || hotelDetail[1],
  }),

  'GET /hotels/:id/rooms': (params, id) => ({
    success: true,
    data: hotelRooms[id] || hotelRooms[1],
  }),

  'GET /categories': () => ({
    success: true,
    data: categories,
  }),
};

const matchRequest = (method, url, params, _body) => {
  const cleanUrl = url.replace(/^\/api/, '').split('?')[0];

  for (const [pattern, handler] of Object.entries(mockHandlers)) {
    const [handlerMethod, handlerPath] = pattern.split(' ');
    if (handlerMethod !== method) continue;

    const id = matchUrl(cleanUrl, handlerPath);
    if (id !== null) {
      return handler(params, id ? parseInt(id) : null);
    }
  }

  return null;
};

export default {
  matchRequest,
  featuredHotels,
  hotelList,
  hotelDetail,
  hotelRooms,
  categories,
};
