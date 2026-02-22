import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PullToRefresh, InfiniteScroll, Tag, Selector } from 'antd-mobile';
import { fetchHotelList, setSearchParams } from '../../store/slices/hotelSlice';
import './HotelList.css';

const HotelListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const { hotels, pagination, loading, searchParams } = useSelector((state) => state.hotel);
  const [hasMore, setHasMore] = useState(true);

  const starOptions = [
    { label: '全部', value: null },
    { label: '五星', value: 5 },
    { label: '四星', value: 4 },
    { label: '三星', value: 3 },
  ];

  const priceOptions = [
    { label: '不限', value: null },
    { label: '300以下', value: '0-300' },
    { label: '300-500', value: '300-500' },
    { label: '500-1000', value: '500-1000' },
    { label: '1000以上', value: '1000-' },
  ];

  const sortOptions = [
    { label: '默认排序', value: 'default' },
    { label: '价格低到高', value: 'price_asc' },
    { label: '价格高到低', value: 'price_desc' },
    { label: '星级排序', value: 'star' },
  ];

  useEffect(() => {
    const keyword = urlParams.get('keyword');
    const city = urlParams.get('city');
    if (keyword || city) {
      dispatch(setSearchParams({ keyword: keyword || '', city: city || '' }));
    }
    dispatch(fetchHotelList({ page: 1, pageSize: 10 }));
  }, [dispatch, urlParams]);

  useEffect(() => {
    setHasMore(pagination.page < pagination.totalPages);
  }, [pagination]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    const nextPage = pagination.page + 1;
    await dispatch(fetchHotelList({ page: nextPage, pageSize: 10 }));
  }, [dispatch, loading, hasMore, pagination.page]);

  const handleRefresh = async () => {
    await dispatch(fetchHotelList({ page: 1, pageSize: 10 }));
  };

  const handleStarChange = (arr) => {
    dispatch(setSearchParams({ star_rating: arr[0] }));
    dispatch(fetchHotelList({ page: 1, pageSize: 10, star_rating: arr[0] }));
  };

  const handlePriceChange = (arr) => {
    const value = arr[0];
    let min_price = null;
    let max_price = null;
    if (value) {
      const [min, max] = value.split('-');
      min_price = min ? parseInt(min) : null;
      max_price = max ? parseInt(max) : null;
    }
    dispatch(setSearchParams({ min_price, max_price }));
    dispatch(fetchHotelList({ page: 1, pageSize: 10, min_price, max_price }));
  };

  const handleSortChange = (arr) => {
    const value = arr[0];
    let sort_by = 'created_at';
    let sort_order = 'DESC';
    if (value === 'price_asc') {
      sort_by = 'min_price';
      sort_order = 'ASC';
    } else if (value === 'price_desc') {
      sort_by = 'min_price';
      sort_order = 'DESC';
    } else if (value === 'star') {
      sort_by = 'star_rating';
      sort_order = 'DESC';
    }
    dispatch(fetchHotelList({ page: 1, pageSize: 10, sort_by, sort_order }));
  };

  const handleHotelClick = (id) => {
    navigate(`/hotel/${id}`);
  };

  return (
    <div className="hotel-list-page">
      <div className="sticky-header">
        <div className="search-info">
          {searchParams.keyword && (
            <Tag round color="primary">
              {searchParams.keyword}
            </Tag>
          )}
          {searchParams.city && (
            <Tag round color="primary">
              {searchParams.city}
            </Tag>
          )}
        </div>

        <div className="filter-bar">
          <Selector
            options={starOptions}
            onChange={handleStarChange}
            style={{ '--gap': '8px' }}
          />
        </div>

        <div className="filter-bar">
          <Selector
            options={priceOptions}
            onChange={handlePriceChange}
            style={{ '--gap': '8px' }}
          />
        </div>

        <div className="filter-bar">
          <Selector
            options={sortOptions}
            defaultValue={['default']}
            onChange={handleSortChange}
            style={{ '--gap': '8px' }}
          />
        </div>
      </div>

      <PullToRefresh onRefresh={handleRefresh}>
        <div className="hotel-list">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="hotel-item"
              onClick={() => handleHotelClick(hotel.id)}
            >
              <img src={hotel.images[0]} alt={hotel.name_cn} className="hotel-image" />
              <div className="hotel-content">
                <h3 className="hotel-name">{hotel.name_cn}</h3>
                <p className="hotel-name-en">{hotel.name_en}</p>
                <div className="hotel-stars">
                  {'★'.repeat(hotel.star_rating)}
                  {'☆'.repeat(5 - hotel.star_rating)}
                </div>
                <p className="hotel-address">{hotel.address}</p>
                <div className="hotel-price-row">
                  <span className="hotel-price">¥{hotel.min_price}</span>
                  <span className="price-unit">起</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
      </PullToRefresh>
    </div>
  );
};

export default HotelListPage;
