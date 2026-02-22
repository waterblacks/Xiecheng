import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Swiper, DatePicker, Tag, Grid, SearchBar } from 'antd-mobile';
import { EnvironmentOutline, CalendarOutline } from 'antd-mobile-icons';
import { fetchFeaturedHotels, setSearchParams } from '../../store/slices/hotelSlice';
import mockData from '../../mocks';
import './Home.css';

const { categories } = mockData;

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { featured, loading, searchParams } = useSelector((state) => state.hotel);
  const [showCalendar, setShowCalendar] = useState(false);
  const [location, setLocation] = useState('定位中...');

  useEffect(() => {
    dispatch(fetchFeaturedHotels());
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setLocation('上海市'),
        () => setLocation('上海市')
      );
    } else {
      setLocation('上海市');
    }
  }, [dispatch]);

  const handleSearch = (keyword) => {
    dispatch(setSearchParams({ keyword, city: location.replace('市', '') }));
    navigate('/hotels');
  };

  const handleDateConfirm = (val) => {
    const dates = Array.isArray(val) ? val : [val];
    if (dates.length === 2) {
      dispatch(setSearchParams({
        checkin: dates[0].toISOString().split('T')[0],
        checkout: dates[1].toISOString().split('T')[0],
      }));
    }
    setShowCalendar(false);
  };

  const handleCategoryClick = (category) => {
    dispatch(setSearchParams({ keyword: category.name }));
    navigate('/hotels');
  };

  const handleTagClick = (star) => {
    dispatch(setSearchParams({ star_rating: star }));
    navigate('/hotels');
  };

  const filterTags = [
    { label: '五星豪华', star: 5 },
    { label: '四星优选', star: 4 },
    { label: '三星舒适', star: 3 },
    { label: '经济实惠', star: null, max_price: 300 },
  ];

  return (
    <div className="home-page">
      <div className="home-header">
        <div className="location" onClick={() => navigate('/hotels')}>
          <EnvironmentOutline />
          <span>{location}</span>
        </div>
      </div>

      <div className="search-section">
        <SearchBar
          placeholder="搜索酒店名称、地址"
          onSearch={handleSearch}
          style={{ '--background': '#ffffff' }}
        />
      </div>

      <div className="date-section" onClick={() => setShowCalendar(true)}>
        <CalendarOutline />
        <span>
          {searchParams.checkin
            ? `${searchParams.checkin} 至 ${searchParams.checkout || '选择离店'}`
            : '选择入住日期'}
        </span>
      </div>

      <DatePicker
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        onConfirm={handleDateConfirm}
        selectionMode="range"
        title="选择入住日期"
      />

      <div className="filter-tags">
        {filterTags.map((tag, index) => (
          <Tag
            key={index}
            round
            color="primary"
            onClick={() => handleTagClick(tag.star)}
          >
            {tag.label}
          </Tag>
        ))}
      </div>

      <div className="banner-section">
        <Swiper autoplay loop style={{ '--border-radius': '12px' }}>
          {(loading ? [] : featured).map((hotel) => (
            <Swiper.Item key={hotel.id}>
              <div
                className="banner-item"
                onClick={() => navigate(`/hotel/${hotel.id}`)}
              >
                <img src={hotel.images[0]} alt={hotel.name_cn} />
                <div className="banner-info">
                  <h3>{hotel.name_cn}</h3>
                  <p>¥{hotel.min_price}起</p>
                </div>
              </div>
            </Swiper.Item>
          ))}
        </Swiper>
      </div>

      <div className="category-section">
        <h3>酒店分类</h3>
        <Grid columns={4} gap={16}>
          {categories.map((item) => (
            <Grid.Item key={item.id} onClick={() => handleCategoryClick(item)}>
              <div className="category-item">
                <div className="category-icon">{item.name[0]}</div>
                <span>{item.name}</span>
              </div>
            </Grid.Item>
          ))}
        </Grid>
      </div>

      <div className="featured-section">
        <h3>热门推荐</h3>
        <div className="hotel-cards">
          {(loading ? [] : featured).slice(0, 4).map((hotel) => (
            <div
              key={hotel.id}
              className="hotel-card"
              onClick={() => navigate(`/hotel/${hotel.id}`)}
            >
              <img src={hotel.images[0]} alt={hotel.name_cn} />
              <div className="hotel-card-info">
                <h4>{hotel.name_cn}</h4>
                <div className="hotel-stars">
                  {'★'.repeat(hotel.star_rating)}
                </div>
                <p className="hotel-price">¥{hotel.min_price}起</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
