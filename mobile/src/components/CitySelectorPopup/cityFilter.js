export const CITY_OPTIONS = [
  { label: '全国', value: '全国' },
  { label: '上海', value: '上海' },
  { label: '北京', value: '北京' },
  { label: '苏州', value: '苏州' },
  { label: '杭州', value: '杭州' },
  { label: '成都', value: '成都' },
  { label: '广州', value: '广州' },
  { label: '三亚', value: '三亚' },
  { label: '厦门', value: '厦门' },
  { label: '西安', value: '西安' },
  { label: '深圳', value: '深圳' },
  { label: '武汉', value: '武汉' },
  { label: '长沙', value: '长沙' },
];

export const normalizeCities = (cities = []) => {
  const deduped = Array.from(new Set(cities));
  if (deduped.length === 0) return ['全国'];
  if (deduped.includes('全国') && deduped.length > 1) {
    return deduped.filter((city) => city !== '全国');
  }
  return deduped;
};

export const getCityDisplay = (cities = []) => {
  const normalized = normalizeCities(cities);
  if (normalized.includes('全国')) return '全国';
  if (normalized.length === 1) return normalized[0];
  return `多城(${normalized.length})`;
};

export const resolveCitySelectorChange = (prev = [], values = []) => {
  const next = Array.from(new Set(values));
  const prevHasAll = prev.includes('全国');
  const nextHasAll = next.includes('全国');

  if (next.length === 0) return ['全国'];
  if (nextHasAll && !prevHasAll) return ['全国'];
  if (nextHasAll && next.length > 1) return next.filter((city) => city !== '全国');
  return next;
};
