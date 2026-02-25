import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PullToRefresh, SpinLoading, Empty, InfiniteScroll } from 'antd-mobile';
import { EnvironmentOutline, CalendarOutline, DownOutline } from 'antd-mobile-icons';
import { searchHotels, setSearchParams } from '../../store/slices/hotelSlice';
import CitySelectorPopup from '../../components/CitySelectorPopup';
import DatePickerPopup from '../../components/DatePickerPopup';
import OptionSelectorPopup from '../../components/OptionSelectorPopup';
import {
  CITY_OPTIONS,
  normalizeCities,
  getCityDisplay,
  resolveCitySelectorChange,
} from '../../components/CitySelectorPopup/cityFilter';
import './HotelList.css';

const PAGE_SIZE = 10;

const starOptions = [
  { label: '不限', value: null },
  { label: '五星', value: 5 },
  { label: '四星', value: 4 },
  { label: '三星', value: 3 },
  { label: '二星及以下', value: 2 },
];

const priceOptions = [
  { label: '不限', value: 'null-null' },
  { label: '500以下', value: '0-500' },
  { label: '500-800', value: '500-800' },
  { label: '800-1200', value: '800-1200' },
  { label: '1200-1500', value: '1200-1500' },
  { label: '1500以上', value: '1500-null' },
];

const sortOptions = [
  { label: '智能排序', value: 'default' },
  { label: '价格低→高', value: 'price_asc' },
  { label: '价格高→低', value: 'price_desc' },
  { label: '星级优先', value: 'star' },
];

const HotelListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hotels, loading, searchParams } = useSelector((state) => state.hotel);
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showStarPicker, setShowStarPicker] = useState(false);
  const [showPricePicker, setShowPricePicker] = useState(false);
  const [showSortPicker, setShowSortPicker] = useState(false);
  const [selectedCities, setSelectedCities] = useState(
    normalizeCities(searchParams.cities || [searchParams.city])
  );
  
  const [selectedStar, setSelectedStar] = useState(searchParams.star_rating);
  const [selectedPrice, setSelectedPrice] = useState(
    searchParams.min_price !== null || searchParams.max_price !== null
      ? `${searchParams.min_price || 'null'}-${searchParams.max_price || 'null'}`
      : 'null-null'
  );
  const [selectedSort, setSelectedSort] = useState('default');
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  useEffect(() => {
    doSearch();
  }, [dispatch]);

  useEffect(() => {
    if (showCityPicker) {
      setSelectedCities(normalizeCities(searchParams.cities || [searchParams.city]));
    }
  }, [showCityPicker, searchParams.city, searchParams.cities]);

  const doSearch = useCallback((overrides = {}) => {
    const priceToUse = overrides.price || selectedPrice;
    const starToUse = overrides.star !== undefined ? overrides.star : selectedStar;
    const sortToUse = overrides.sort || selectedSort;
    const citiesToUse = normalizeCities(
      overrides.cities || searchParams.cities || [searchParams.city]
    );
    const specificCities = citiesToUse.filter((city) => city !== '全国');
    
    const [minPrice, maxPrice] = priceToUse.split('-');
    const params = {
      keyword: searchParams.keyword,
      city: specificCities.length === 1 ? specificCities[0] : undefined,
      star_rating: starToUse,
      min_price: minPrice === 'null' ? null : parseInt(minPrice),
      max_price: maxPrice === 'null' ? null : parseInt(maxPrice),
    };
    
    if (sortToUse === 'price_asc') {
      params.sort_by = 'min_price';
      params.sort_order = 'ASC';
    } else if (sortToUse === 'price_desc') {
      params.sort_by = 'min_price';
      params.sort_order = 'DESC';
    } else if (sortToUse === 'star') {
      params.sort_by = 'star_rating';
      params.sort_order = 'DESC';
    }
    
    dispatch(searchHotels(params));
  }, [dispatch, searchParams.keyword, searchParams.city, searchParams.cities, selectedStar, selectedPrice, selectedSort]);

  const handleRefresh = async () => {
    doSearch();
  };

  const handleDateConfirm = (checkin, checkout, nights) => {
    dispatch(setSearchParams({ checkin, checkout, nights }));
    setShowDatePicker(false);
  };

  const handleCityConfirm = (arr) => {
    const cities = normalizeCities(arr);
    dispatch(setSearchParams({ city: getCityDisplay(cities), cities }));
    setShowCityPicker(false);
    doSearch({ cities });
  };

  const handleCitySelectorChange = (values) => {
    setSelectedCities((prev) => resolveCitySelectorChange(prev, values));
  };

  const handleStarSelect = (arr) => {
    if (arr.length > 0) {
      const newStar = arr[0];
      setSelectedStar(newStar);
      dispatch(setSearchParams({ star_rating: newStar }));
      setShowStarPicker(false);
      doSearch({ star: newStar });
    }
  };

  const handlePriceSelect = (arr) => {
    if (arr.length > 0) {
      const newPrice = arr[0];
      setSelectedPrice(newPrice);
      const [minPrice, maxPrice] = newPrice.split('-');
      dispatch(setSearchParams({
        min_price: minPrice === 'null' ? null : parseInt(minPrice),
        max_price: maxPrice === 'null' ? null : parseInt(maxPrice),
      }));
      setShowPricePicker(false);
      doSearch({ price: newPrice });
    }
  };

  const handleSortSelect = (arr) => {
    if (arr.length > 0) {
      const newSort = arr[0];
      setSelectedSort(newSort);
      setShowSortPicker(false);
      doSearch({ sort: newSort });
    }
  };

  const formatDateDisplay = () => {
    if (!searchParams.checkin) return '日期';
    const checkin = new Date(searchParams.checkin);
    const month = checkin.getMonth() + 1;
    const day = checkin.getDate();
    if (!searchParams.checkout) return `${month}/${day}`;
    return `${month}/${day} · ${searchParams.nights}晚`;
  };

  const getStarLabel = () => {
    if (selectedStar === null) return '星级';
    const opt = starOptions.find(o => o.value === selectedStar);
    return opt?.label || '星级';
  };

  const getPriceLabel = () => {
    if (selectedPrice === 'null-null') return '价格';
    const opt = priceOptions.find(o => o.value === selectedPrice);
    return opt?.label || '价格';
  };

  const getSortLabel = () => {
    const opt = sortOptions.find(o => o.value === selectedSort);
    return opt?.label || '排序';
  };

  const handleHotelClick = (id) => {
    navigate(`/hotel/${id}`);
  };

  const visibleHotels = useMemo(() => {
    const [minPrice, maxPrice] = selectedPrice.split('-');
    const min = minPrice === 'null' ? null : parseInt(minPrice);
    const max = maxPrice === 'null' ? null : parseInt(maxPrice);
    let result = [...hotels];

    // 前端兜底：即使后端没处理这些参数，也保证筛选和排序在页面生效
    const cities = normalizeCities(searchParams.cities || [searchParams.city]);
    const specificCities = cities.filter((city) => city !== '全国');
    if (specificCities.length > 0) {
      result = result.filter((h) => specificCities.some((city) => h.address?.includes(city)));
    }
    if (selectedStar !== null) {
      result = result.filter((h) => h.star_rating === selectedStar);
    }
    if (min !== null) {
      result = result.filter((h) => h.min_price >= min);
    }
    if (max !== null) {
      result = result.filter((h) => h.min_price <= max);
    }

    if (selectedSort === 'price_asc') {
      result.sort((a, b) => a.min_price - b.min_price);
    } else if (selectedSort === 'price_desc') {
      result.sort((a, b) => b.min_price - a.min_price);
    } else if (selectedSort === 'star') {
      result.sort((a, b) => b.star_rating - a.star_rating);
    }

    return result;
  }, [hotels, searchParams.city, searchParams.cities, selectedStar, selectedPrice, selectedSort]);

  useEffect(() => {
    setDisplayCount(PAGE_SIZE);
  }, [visibleHotels]);

  const {
    matchedHotels,
    recommendedHotels,
    displayedHotels,
    displayedMatchedHotels,
    displayedRecommendedHotels,
    hasMore,
  } = useMemo(() => {
    const matched = visibleHotels.filter((h) => h.is_matched !== false);
    const recommended = visibleHotels.filter((h) => h.is_matched === false);
    const displayed = visibleHotels.slice(0, displayCount);
    return {
      matchedHotels: matched,
      recommendedHotels: recommended,
      displayedHotels: displayed,
      displayedMatchedHotels: displayed.filter((h) => h.is_matched !== false),
      displayedRecommendedHotels: displayed.filter((h) => h.is_matched === false),
      hasMore: displayCount < visibleHotels.length,
    };
  }, [visibleHotels, displayCount]);

  const loadMore = async () => {
    if (!hasMore) return;
    await new Promise((resolve) => setTimeout(resolve, 200));
    setDisplayCount((prev) => Math.min(prev + PAGE_SIZE, visibleHotels.length));
  };

  return (
    <div className="hotel-list-page">
      <div className="list-header">
        <div className="header-top">
          <div className="header-city" onClick={() => setShowCityPicker(true)}>
            <EnvironmentOutline />
            <span>{getCityDisplay(searchParams.cities || [searchParams.city])}</span>
            <DownOutline className="city-arrow" />
          </div>
          {searchParams.keyword && (
            <div className="header-keyword">
              "{searchParams.keyword}" 的搜索结果
            </div>
          )}
        </div>
        
        <div className="filter-bar">
          <div 
            className={`filter-btn ${searchParams.checkin ? 'active' : ''}`}
            onClick={() => setShowDatePicker(true)}
          >
            <CalendarOutline />
            <span>{formatDateDisplay()}</span>
          </div>
          <div 
            className={`filter-btn ${selectedStar !== null ? 'active' : ''}`}
            onClick={() => setShowStarPicker(true)}
          >
            <span>{getStarLabel()}</span>
            <DownOutline className="filter-arrow" />
          </div>
          <div 
            className={`filter-btn ${selectedPrice !== 'null-null' ? 'active' : ''}`}
            onClick={() => setShowPricePicker(true)}
          >
            <span>{getPriceLabel()}</span>
            <DownOutline className="filter-arrow" />
          </div>
          <div 
            className={`filter-btn ${selectedSort !== 'default' ? 'active' : ''}`}
            onClick={() => setShowSortPicker(true)}
          >
            <span>{getSortLabel()}</span>
            <DownOutline className="filter-arrow" />
          </div>
        </div>
      </div>

      <CitySelectorPopup
        visible={showCityPicker}
        onClose={() => setShowCityPicker(false)}
        onConfirm={handleCityConfirm}
        value={selectedCities}
        onChange={handleCitySelectorChange}
        options={CITY_OPTIONS}
      />

      <DatePickerPopup
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        checkin={searchParams.checkin}
        checkout={searchParams.checkout}
        onConfirm={handleDateConfirm}
      />

      <OptionSelectorPopup
        visible={showStarPicker}
        onClose={() => setShowStarPicker(false)}
        title="酒店星级"
        options={starOptions}
        value={[selectedStar]}
        onChange={handleStarSelect}
      />

      <OptionSelectorPopup
        visible={showPricePicker}
        onClose={() => setShowPricePicker(false)}
        title="价格区间"
        options={priceOptions}
        value={[selectedPrice]}
        onChange={handlePriceSelect}
      />

      <OptionSelectorPopup
        visible={showSortPicker}
        onClose={() => setShowSortPicker(false)}
        title="排序方式"
        options={sortOptions}
        value={[selectedSort]}
        onChange={handleSortSelect}
        columns={2}
      />

      <PullToRefresh onRefresh={handleRefresh}>
        <div className="hotel-list">
          {visibleHotels.length === 0 && !loading && (
            <Empty description="暂无符合条件的酒店" />
          )}
          
          {matchedHotels.length > 0 && searchParams.keyword && (
            <div className="hotel-section">
              <div className="hotel-section-title">搜索结果 ({matchedHotels.length})</div>
              {displayedMatchedHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} onClick={handleHotelClick} />
              ))}
            </div>
          )}
          
          {recommendedHotels.length > 0 && (
            <div className="hotel-section">
              <div className="hotel-section-title">为您推荐</div>
              {displayedRecommendedHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} onClick={handleHotelClick} isRecommended />
              ))}
            </div>
          )}
          
          {!searchParams.keyword && displayedHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} onClick={handleHotelClick} />
          ))}

          {visibleHotels.length > 0 && (
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
          )}
        </div>
        
        {loading && (
          <div className="loading-more">
            <SpinLoading color="primary" />
            <span>加载中...</span>
          </div>
        )}
      </PullToRefresh>
    </div>
  );
};

const HotelCard = ({ hotel, onClick, isRecommended }) => {
  // 防御性处理：提供默认值
  const defaultImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400';
  const hotelImage =
      hotel?.images?.[0]?.url ||
      hotel?.images?.[0] ||
      defaultImage;
  const hotelName = hotel?.name_cn || '未知酒店';
  const hotelNameEn = hotel?.name_en || '';
  const starRating = hotel?.star_rating || 0;
  const address = hotel?.address || '地址未知';
  const minPrice = hotel?.min_price || 0;

  console.log(`[hotellist展示] 酒店ID: ${hotel?.id}, 名称:${hotelName}, 图片URL: ${hotelImage}`);

  return (
      <div
          className={`hotel-item ${isRecommended ? 'recommended' : ''}`}
          onClick={() => onClick(hotel?.id)}
      >
        <div className="hotel-image-wrapper">
          <img src={hotelImage} alt={hotelName} className="hotel-image" />
          {starRating === 5 && (
              <span className="hotel-badge">豪华</span>
          )}
        </div>
        <div className="hotel-content">
          <h3 className="hotel-name">{hotelName}</h3>
          {hotelNameEn && <p className="hotel-name-en">{hotelNameEn}</p>}
          <div className="hotel-rating">
          <span className="hotel-stars">
            {'★'.repeat(starRating)}
            {'☆'.repeat(5 - starRating)}
          </span>
            <span className="star-label">{starRating}星级</span>
          </div>
          <p className="hotel-address">
            <EnvironmentOutline /> {address}
          </p>
          <div className="hotel-price-row">
            <div className="hotel-price">
              <span className="price-symbol">¥</span>
              <span className="price-value">{minPrice}</span>
              <span className="price-unit">起</span>
            </div>
          </div>
        </div>
      </div>
  );
};


export default HotelListPage;
