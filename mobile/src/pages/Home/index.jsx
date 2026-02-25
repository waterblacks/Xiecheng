import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Swiper, Tag, Grid, Popup, Button, SearchBar } from 'antd-mobile';
import { EnvironmentOutline, CalendarOutline, DownOutline, FilterOutline } from 'antd-mobile-icons';
import { fetchFeaturedHotels, setSearchParams } from '../../store/slices/hotelSlice';
import mockData from '../../../../server/mocks';
import CitySelectorPopup from '../../components/CitySelectorPopup';
import DatePickerPopup from '../../components/DatePickerPopup';
import {
  CITY_OPTIONS,
  normalizeCities,
  getCityDisplay,
  resolveCitySelectorChange,
} from '../../components/CitySelectorPopup/cityFilter';
import './Home.css';

const { categories } = mockData;

const starOptions = [
  { label: '不限', value: null },
  { label: '五星', value: 5 },
  { label: '四星', value: 4 },
  { label: '三星', value: 3 },
  { label: '二星及以下', value: 2 },
];

const priceOptions = [
  { label: '不限', value: 'null-null' },
  { label: '300以下', value: '0-300' },
  { label: '300-500', value: '300-500' },
  { label: '500-1000', value: '500-1000' },
  { label: '1000-2000', value: '1000-2000' },
  { label: '2000以上', value: '2000-null' },
];

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { featured, loading, searchParams } = useSelector((state) => state.hotel);
  
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showDatePopup, setShowDatePopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [selectedCities, setSelectedCities] = useState(
    normalizeCities(searchParams.cities || [searchParams.city])
  );
  
  const [keyword, setKeyword] = useState('');
  const [selectedStar, setSelectedStar] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState('null-null');

  useEffect(() => {
    dispatch(fetchFeaturedHotels());
  }, [dispatch]);

  useEffect(() => {
    if (showCityPicker) {
      setSelectedCities(normalizeCities(searchParams.cities || [searchParams.city]));
    }
  }, [showCityPicker, searchParams.city, searchParams.cities]);

  const handleCityConfirm = (values) => {
    const cities = normalizeCities(values);
    dispatch(setSearchParams({ city: getCityDisplay(cities), cities }));
    setShowCityPicker(false);
  };

  const handleCitySelectorChange = (values) => {
    setSelectedCities((prev) => resolveCitySelectorChange(prev, values));
  };

  const handleDateConfirm = (checkin, checkout, nights) => {
    dispatch(setSearchParams({ checkin, checkout, nights }));
    setShowDatePopup(false);
  };

  const handleSearch = () => {
    const [minPrice, maxPrice] = selectedPrice.split('-');
    dispatch(setSearchParams({
      keyword,
      star_rating: selectedStar,
      min_price: minPrice === 'null' ? null : parseInt(minPrice),
      max_price: maxPrice === 'null' ? null : parseInt(maxPrice),
    }));
    navigate('/hotels');
  };

  const handleCategoryClick = (category) => {
    dispatch(setSearchParams({ keyword: category.name }));
    navigate('/hotels');
  };

  const handleHotelClick = (id) => {
    navigate(`/hotel/${id}`);
  };

  const formatDateDisplay = () => {
    if (!searchParams.checkin) return '选择日期';
    const checkin = new Date(searchParams.checkin);
    const month = checkin.getMonth() + 1;
    const day = checkin.getDate();
    if (!searchParams.checkout) return `${month}月${day}日入住`;
    const checkout = new Date(searchParams.checkout);
    const outMonth = checkout.getMonth() + 1;
    const outDay = checkout.getDate();
    return `${month}/${day} - ${outMonth}/${outDay} · ${searchParams.nights}晚`;
  };

  return (
    <div className="home-page">
      <div className="home-header">
        <div className="header-content">
          <div className="location-btn" onClick={() => setShowCityPicker(true)}>
            <EnvironmentOutline className="location-icon" />
            <span className="location-text">{getCityDisplay(searchParams.cities || [searchParams.city])}</span>
            <DownOutline className="arrow-icon" />
          </div>
        </div>
      </div>

      <div className="search-card">
        <div className="search-row" onClick={() => setShowDatePopup(true)}>
          <div className="search-row-icon">
            <CalendarOutline />
          </div>
          <div className="search-row-content">
            <span className="search-row-value">{formatDateDisplay()}</span>
          </div>
          <DownOutline className="row-arrow" />
        </div>

        <div className="search-divider" />

        <div className="search-keyword">
          <SearchBar
            placeholder="搜索酒店名称、地址"
            value={keyword}
            onChange={setKeyword}
            style={{ '--background': 'var(--color-bg-page)', '--font-size': '16px' }}
          />
        </div>

        <div className="filter-row">
          <div 
            className="filter-item"
            onClick={() => setShowFilterPopup(true)}
          >
            <FilterOutline />
            <span>筛选</span>
            {(selectedStar || selectedPrice !== 'null-null') && (
              <span className="filter-dot" />
            )}
          </div>
          
        </div>

        <Button 
          block 
          color="primary" 
          size="large"
          className="search-btn"
          onClick={handleSearch}
        >
          搜索酒店
        </Button>
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
        visible={showDatePopup}
        onClose={() => setShowDatePopup(false)}
        checkin={searchParams.checkin}
        checkout={searchParams.checkout}
        onConfirm={handleDateConfirm}
      />

      <Popup
        visible={showFilterPopup}
        onMaskClick={() => setShowFilterPopup(false)}
        position="bottom"
        bodyStyle={{ height: '50vh', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
      >
        <div className="popup-header">
          <span className="popup-reset" onClick={() => {
            setSelectedStar(null);
            setSelectedPrice('null-null');
          }}>重置</span>
          <span>筛选条件</span>
          <span className="popup-close" onClick={() => setShowFilterPopup(false)}>完成</span>
        </div>
        <div className="filter-popup-content">
          <div className="filter-section">
            <h4>酒店星级</h4>
            <div className="filter-options">
              {starOptions.map((opt) => (
                <Tag
                  key={opt.value}
                  round
                  color={selectedStar === opt.value ? 'primary' : 'default'}
                  fill={selectedStar === opt.value ? 'solid' : 'outline'}
                  onClick={() => setSelectedStar(opt.value)}
                >
                  {opt.label}
                </Tag>
              ))}
            </div>
          </div>
          <div className="filter-section">
            <h4>价格区间</h4>
            <div className="filter-options">
              {priceOptions.map((opt) => (
                <Tag
                  key={opt.value}
                  round
                  color={selectedPrice === opt.value ? 'primary' : 'default'}
                  fill={selectedPrice === opt.value ? 'solid' : 'outline'}
                  onClick={() => setSelectedPrice(opt.value)}
                >
                  {opt.label}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      </Popup>

      <div className="banner-section">
        {/* ✅ 防御性处理：检查 featured 是否为空 */}
        {featured && featured.length > 0 ? (
          <Swiper
            autoplay
            loop
            style={{ '--border-radius': '12px' }}
          >
            {(loading ? [] : featured).map((hotel) => (
              <Swiper.Item key={hotel.id}>
                <div
                  className="banner-item"
                  onClick={() => handleHotelClick(hotel.id)}
                >
                  <img src={hotel.images[0]} alt={hotel.name_cn} />
                  <div className="banner-overlay">
                    <div className="banner-tag">热门推荐</div>
                    <h3>{hotel.name_cn}</h3>
                    <p className="banner-price">
                      <span className="price-symbol">¥</span>
                      <span className="price-value">{hotel.min_price}</span>
                      <span className="price-unit">起</span>
                    </p>
                  </div>
                </div>
              </Swiper.Item>
            ))}
          </Swiper>
        ) : (
            // ✅ 当没有精选酒店时显示占位内容
            !loading && (
                <div className="banner-placeholder">
                  <p>暂无精选酒店</p>
                </div>
            )
        )}
      </div>

      <div className="category-section">
        <div className="section-header">
          <h3>酒店分类</h3>
        </div>
        <Grid columns={4} gap={12}>
          {categories.map((item) => (
            <Grid.Item key={item.id}>
              <div className="category-item" onClick={() => handleCategoryClick(item)}>
                <div className="category-icon">{item.name[0]}</div>
                <span>{item.name}</span>
              </div>
            </Grid.Item>
          ))}
        </Grid>
      </div>

      <div className="featured-section">
        <div className="section-header">
          <h3>精选酒店</h3>
          <span className="section-more" onClick={() => navigate('/hotels')}>
            查看更多
          </span>
        </div>
        <div className="hotel-scroll">
          {(loading ? [] : featured).map((hotel) => (
            <div
              key={hotel.id}
              className="hotel-card"
              onClick={() => handleHotelClick(hotel.id)}
            >
              <img src={hotel.images[0]} alt={hotel.name_cn} />
              <div className="hotel-card-body">
                <h4>{hotel.name_cn}</h4>
                <div className="hotel-stars">
                  {'★'.repeat(hotel.star_rating)}
                </div>
                <p className="hotel-price">
                  <span className="price-symbol">¥</span>
                  <span className="price-value">{hotel.min_price}</span>
                  <span className="price-unit">起</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
