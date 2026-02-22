export const featuredHotels = [
  {
    id: 1,
    name_cn: '上海外滩华尔道夫酒店',
    star_rating: 5,
    min_price: 2888,
    images: ['https://picsum.photos/400/300?random=1'],
  },
  {
    id: 2,
    name_cn: '北京王府半岛酒店',
    star_rating: 5,
    min_price: 2500,
    images: ['https://picsum.photos/400/300?random=2'],
  },
  {
    id: 3,
    name_cn: '杭州西湖四季酒店',
    star_rating: 5,
    min_price: 3200,
    images: ['https://picsum.photos/400/300?random=3'],
  },
];

export const hotelList = [
  {
    id: 1,
    name_cn: '上海外滩华尔道夫酒店',
    name_en: 'Waldorf Astoria Shanghai',
    address: '上海市黄浦区中山东一路2号',
    star_rating: 5,
    min_price: 2888,
    images: ['https://picsum.photos/400/300?random=1'],
  },
  {
    id: 2,
    name_cn: '北京王府半岛酒店',
    name_en: 'The Peninsula Beijing',
    address: '北京市东城区金鱼胡同8号',
    star_rating: 5,
    min_price: 2500,
    images: ['https://picsum.photos/400/300?random=2'],
  },
  {
    id: 3,
    name_cn: '杭州西湖四季酒店',
    name_en: 'Four Seasons Hotel Hangzhou',
    address: '杭州市西湖区灵隐路5号',
    star_rating: 5,
    min_price: 3200,
    images: ['https://picsum.photos/400/300?random=3'],
  },
  {
    id: 4,
    name_cn: '成都香格里拉大酒店',
    name_en: 'Shangri-La Hotel Chengdu',
    address: '成都市锦江区滨江东路9号',
    star_rating: 5,
    min_price: 1200,
    images: ['https://picsum.photos/400/300?random=4'],
  },
  {
    id: 5,
    name_cn: '广州白天鹅宾馆',
    name_en: 'White Swan Hotel',
    address: '广州市荔湾区沙面南街1号',
    star_rating: 5,
    min_price: 980,
    images: ['https://picsum.photos/400/300?random=5'],
  },
  {
    id: 6,
    name_cn: '三亚亚特兰蒂斯酒店',
    name_en: 'Atlantis Sanya',
    address: '三亚市海棠区海棠北路',
    star_rating: 5,
    min_price: 2800,
    images: ['https://picsum.photos/400/300?random=6'],
  },
  {
    id: 7,
    name_cn: '深圳华侨城洲际大酒店',
    name_en: 'InterContinental Shenzhen',
    address: '深圳市南山区华侨城',
    star_rating: 5,
    min_price: 1500,
    images: ['https://picsum.photos/400/300?random=7'],
  },
  {
    id: 8,
    name_cn: '西安威斯汀大酒店',
    name_en: 'The Westin Xian',
    address: '西安市碑林区慈恩路66号',
    star_rating: 5,
    min_price: 1100,
    images: ['https://picsum.photos/400/300?random=8'],
  },
];

export const hotelDetail = {
  1: {
    id: 1,
    name_cn: '上海外滩华尔道夫酒店',
    name_en: 'Waldorf Astoria Shanghai',
    address: '上海市黄浦区中山东一路2号',
    star_rating: 5,
    opening_date: '2011-06-01',
    description: '位于外滩的奢华五星级酒店，拥有百年历史建筑与现代设计的完美融合，坐拥黄浦江璀璨夜景。',
    latitude: 31.2401,
    longitude: 121.489,
    images: [
      { id: 1, url: 'https://picsum.photos/800/600?random=11', type: 'banner', display_order: 0 },
      { id: 2, url: 'https://picsum.photos/800/600?random=12', type: 'room', display_order: 1 },
      { id: 3, url: 'https://picsum.photos/800/600?random=13', type: 'facility', display_order: 2 },
    ],
    facilities: [
      { id: 1, facility_type: '免费WiFi', description: '全馆免费高速WiFi' },
      { id: 2, facility_type: '游泳池', description: '室内恒温泳池' },
      { id: 3, facility_type: '健身房', description: '24小时健身中心' },
      { id: 4, facility_type: 'SPA', description: '豪华SPA水疗中心' },
      { id: 5, facility_type: '餐厅', description: '多家特色餐厅' },
    ],
    attractions: [
      { id: 1, name: '南京路步行街', type: 'attraction', distance: '0.5公里' },
      { id: 2, name: '豫园', type: 'attraction', distance: '1.2公里' },
      { id: 3, name: '东方明珠', type: 'attraction', distance: '2.0公里' },
    ],
    promotions: [
      { id: 1, type: 'holiday', discount: 0.85, description: '春节特惠85折', start_date: '2026-01-20', end_date: '2026-02-10' },
    ],
  },
  2: {
    id: 2,
    name_cn: '北京王府半岛酒店',
    name_en: 'The Peninsula Beijing',
    address: '北京市东城区金鱼胡同8号',
    star_rating: 5,
    opening_date: '1989-03-15',
    description: '位于王府井核心地段，融合古典与现代的奢华酒店，步行可达故宫天安门。',
    latitude: 39.9138,
    longitude: 116.4074,
    images: [
      { id: 1, url: 'https://picsum.photos/800/600?random=21', type: 'banner', display_order: 0 },
      { id: 2, url: 'https://picsum.photos/800/600?random=22', type: 'room', display_order: 1 },
    ],
    facilities: [
      { id: 1, facility_type: '免费WiFi', description: '全馆免费高速WiFi' },
      { id: 2, facility_type: '游泳池', description: '室内恒温泳池' },
      { id: 3, facility_type: '健身房', description: '24小时健身中心' },
    ],
    attractions: [
      { id: 1, name: '故宫', type: 'attraction', distance: '0.8公里' },
      { id: 2, name: '天安门广场', type: 'attraction', distance: '1.0公里' },
    ],
    promotions: [],
  },
};

export const hotelRooms = {
  1: [
    { id: 1, hotel_id: 1, name: '豪华江景房', base_price: 2888, description: '享有黄浦江美景', max_guests: 2, bed_type: '特大床', area: 45, nights: 1, total_price: '2888.00' },
    { id: 2, hotel_id: 1, name: '行政套房', base_price: 3888, description: '独立起居室，管家服务', max_guests: 2, bed_type: '特大床', area: 68, nights: 1, total_price: '3888.00' },
    { id: 3, hotel_id: 1, name: '总统套房', base_price: 8888, description: '顶级奢华体验', max_guests: 4, bed_type: '特大床', area: 120, nights: 1, total_price: '8888.00' },
  ],
  2: [
    { id: 4, hotel_id: 2, name: '豪华客房', base_price: 2500, description: '宽敞舒适', max_guests: 2, bed_type: '大床', area: 42, nights: 1, total_price: '2500.00' },
    { id: 5, hotel_id: 2, name: '行政套房', base_price: 4500, description: '行政楼层专属服务', max_guests: 2, bed_type: '特大床', area: 75, nights: 1, total_price: '4500.00' },
  ],
};

export const categories = [
  { id: 1, name: '豪华酒店', icon: 'star' },
  { id: 2, name: '商务出行', icon: 'briefcase' },
  { id: 3, name: '亲子度假', icon: 'heart' },
  { id: 4, name: '温泉酒店', icon: 'cloud' },
  { id: 5, name: '海景酒店', icon: 'global' },
  { id: 6, name: '特色民宿', icon: 'home' },
  { id: 7, name: '网红打卡', icon: 'camera' },
  { id: 8, name: '更多', icon: 'appstore' },
];
