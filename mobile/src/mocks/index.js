import { featuredHotels, hotelList, hotelDetail, hotelRooms, categories } from './hotels';

const matchUrl = (url, pattern) => {
  const regex = new RegExp(`^${pattern.replace(/:id/g, '(\\d+)')}$`);
  const match = url.replace(/^\/api/, '').match(regex);
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
    let filtered = [...hotelList];
    if (params?.keyword) {
      const kw = params.keyword.toLowerCase();
      filtered = filtered.filter(
        (h) =>
          h.name_cn.includes(params.keyword) ||
          h.name_en.toLowerCase().includes(kw) ||
          h.address.includes(params.keyword)
      );
    }
    if (params?.city) {
      filtered = filtered.filter((h) => h.address.includes(params.city));
    }
    return {
      success: true,
      data: filtered,
      total: filtered.length,
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
