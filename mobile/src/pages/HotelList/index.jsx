import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Popup, Selector, PullToRefresh, SpinLoading, Empty } from 'antd-mobile';
import { EnvironmentOutline, CalendarOutline, DownOutline } from 'antd-mobile-icons';
import { searchHotels, setSearchParams } from '../../store/slices/hotelSlice';
import DateRangePicker from '../../components/DateRangePicker';
import './HotelList.css';

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
  const [showStarPicker, setShowStarPicker] = useState(false);
  const [showPricePicker, setShowPricePicker] = useState(false);
  const [showSortPicker, setShowSortPicker] = useState(false);
  
  const [selectedStar, setSelectedStar] = useState(searchParams.star_rating);
  const [selectedPrice, setSelectedPrice] = useState(
    searchParams.min_price !== null || searchParams.max_price !== null
      ? `${searchParams.min_price || 'null'}-${searchParams.max_price || 'null'}`
      : 'null-null'
  );
  const [selectedSort, setSelectedSort] = useState('default');

  useEffect(() => {
    doSearch();
  }, [dispatch]);

  const doSearch = useCallback((overrides = {}) => {
    const priceToUse = overrides.price || selectedPrice;
    const starToUse = overrides.star !== undefined ? overrides.star : selectedStar;
    const sortToUse = overrides.sort || selectedSort;
    
    const [minPrice, maxPrice] = priceToUse.split('-');
    const params = {
      keyword: searchParams.keyword,
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
  }, [dispatch, searchParams.keyword, selectedStar, selectedPrice, selectedSort]);

  const handleRefresh = async () => {
    doSearch();
  };

  const handleDateConfirm = (checkin, checkout, nights) => {
    dispatch(setSearchParams({ checkin, checkout, nights }));
    setShowDatePicker(false);
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

  const { matchedHotels, recommendedHotels } = useMemo(() => {
    const matched = hotels.filter(h => h.is_matched !== false);
    const recommended = hotels.filter(h => h.is_matched === false);
    return { matchedHotels: matched, recommendedHotels: recommended };
  }, [hotels]);

  return (
    <div className="hotel-list-page">
      <div className="list-header">
        <div className="header-top">
          <div className="header-city" onClick={() => navigate('/')}>
            <EnvironmentOutline />
            <span>{searchParams.city}</span>
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

      <Popup
        visible={showDatePicker}
        onMaskClick={() => setShowDatePicker(false)}
        position="bottom"
        bodyStyle={{ height: '70vh', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
      >
        <div className="popup-header">
          <span>选择入住日期</span>
          <span className="popup-close" onClick={() => setShowDatePicker(false)}>关闭</span>
        </div>
        <DateRangePicker
          checkin={searchParams.checkin}
          checkout={searchParams.checkout}
          onConfirm={handleDateConfirm}
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
        />
      </Popup>

      <Popup
        visible={showStarPicker}
        onMaskClick={() => setShowStarPicker(false)}
        position="bottom"
        bodyStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
      >
        <div className="popup-header">
          <span>酒店星级</span>
          <span className="popup-close" onClick={() => setShowStarPicker(false)}>取消</span>
        </div>
        <div className="quick-picker-content">
          <Selector
            columns={3}
            options={starOptions}
            value={[selectedStar]}
            onChange={handleStarSelect}
            style={{ '--gap': '12px' }}
          />
        </div>
      </Popup>

      <Popup
        visible={showPricePicker}
        onMaskClick={() => setShowPricePicker(false)}
        position="bottom"
        bodyStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
      >
        <div className="popup-header">
          <span>价格区间</span>
          <span className="popup-close" onClick={() => setShowPricePicker(false)}>取消</span>
        </div>
        <div className="quick-picker-content">
          <Selector
            columns={3}
            options={priceOptions}
            value={[selectedPrice]}
            onChange={handlePriceSelect}
            style={{ '--gap': '12px' }}
          />
        </div>
      </Popup>

      <Popup
        visible={showSortPicker}
        onMaskClick={() => setShowSortPicker(false)}
        position="bottom"
        bodyStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
      >
        <div className="popup-header">
          <span>排序方式</span>
          <span className="popup-close" onClick={() => setShowSortPicker(false)}>取消</span>
        </div>
        <div className="quick-picker-content">
          <Selector
            columns={2}
            options={sortOptions}
            value={[selectedSort]}
            onChange={handleSortSelect}
            style={{ '--gap': '12px' }}
          />
        </div>
      </Popup>

      <PullToRefresh onRefresh={handleRefresh}>
        <div className="hotel-list">
          {hotels.length === 0 && !loading && (
            <Empty description="暂无符合条件的酒店" />
          )}
          
          {matchedHotels.length > 0 && searchParams.keyword && (
            <div className="hotel-section">
              <div className="hotel-section-title">搜索结果 ({matchedHotels.length})</div>
              {matchedHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} onClick={handleHotelClick} />
              ))}
            </div>
          )}
          
          {recommendedHotels.length > 0 && (
            <div className="hotel-section">
              <div className="hotel-section-title">为您推荐</div>
              {recommendedHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} onClick={handleHotelClick} isRecommended />
              ))}
            </div>
          )}
          
          {!searchParams.keyword && hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} onClick={handleHotelClick} />
          ))}
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

const HotelCard = ({ hotel, onClick, isRecommended }) => (
  <div
    className={`hotel-item ${isRecommended ? 'recommended' : ''}`}
    onClick={() => onClick(hotel.id)}
  >
    <div className="hotel-image-wrapper">
      <img src={hotel.images[0]} alt={hotel.name_cn} className="hotel-image" />
      {hotel.star_rating === 5 && (
        <span className="hotel-badge">豪华</span>
      )}
    </div>
    <div className="hotel-content">
      <h3 className="hotel-name">{hotel.name_cn}</h3>
      <p className="hotel-name-en">{hotel.name_en}</p>
      <div className="hotel-rating">
        <span className="hotel-stars">
          {'★'.repeat(hotel.star_rating)}
          {'☆'.repeat(5 - hotel.star_rating)}
        </span>
        <span className="star-label">{hotel.star_rating}星级</span>
      </div>
      <p className="hotel-address">
        <EnvironmentOutline /> {hotel.address}
      </p>
      <div className="hotel-price-row">
        <div className="hotel-price">
          <span className="price-symbol">¥</span>
          <span className="price-value">{hotel.min_price}</span>
          <span className="price-unit">起</span>
        </div>
      </div>
    </div>
  </div>
);

export default HotelListPage;
