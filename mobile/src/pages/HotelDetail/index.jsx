import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, Tag, Tabs } from 'antd-mobile';
import { EnvironmentOutline, PhoneFill, LikeOutline } from 'antd-mobile-icons';
import { fetchHotelDetail, fetchHotelRooms, clearCurrentHotel } from '../../store/slices/hotelSlice';
import './HotelDetail.css';

const HotelDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentHotel, rooms, loading } = useSelector((state) => state.hotel);

  useEffect(() => {
    dispatch(fetchHotelDetail(id));
    dispatch(fetchHotelRooms({ id }));
    return () => {
      dispatch(clearCurrentHotel());
    };
  }, [dispatch, id]);

  if (loading || !currentHotel) {
    return <div className="loading">加载中...</div>;
  }

  const facilityIcons = {
    '免费WiFi': '📶',
    '游泳池': '🏊',
    '健身房': '💪',
    'SPA': '💆',
    '餐厅': '🍽️',
    '停车场': '🚗',
    '会议室': '💼',
    '洗衣服务': '👔',
  };

  return (
    <div className="hotel-detail-page">
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
      </div>

      <Swiper className="gallery-swiper" loop>
        {currentHotel.images.map((img) => (
          <Swiper.Item key={img.id}>
            <img src={img.url} alt={currentHotel.name_cn} className="gallery-image" />
          </Swiper.Item>
        ))}
      </Swiper>

      <div className="hotel-info-section">
        <div className="hotel-title-row">
          <h1>{currentHotel.name_cn}</h1>
          <div className="hotel-stars">
            {'★'.repeat(currentHotel.star_rating)}
          </div>
        </div>
        <p className="hotel-name-en">{currentHotel.name_en}</p>
        
        <div className="hotel-location">
          <EnvironmentOutline />
          <span>{currentHotel.address}</span>
        </div>

        {currentHotel.promotions && currentHotel.promotions.length > 0 && (
          <div className="promotions">
            {currentHotel.promotions.map((promo) => (
              <Tag key={promo.id} color="danger" round>
                {promo.description}
              </Tag>
            ))}
          </div>
        )}

        <p className="hotel-description">{currentHotel.description}</p>
      </div>

      <div className="section facilities-section">
        <h2>酒店设施</h2>
        <div className="facilities-grid">
          {currentHotel.facilities.map((facility) => (
            <div key={facility.id} className="facility-item">
              <span className="facility-icon">
                {facilityIcons[facility.facility_type] || '✓'}
              </span>
              <span className="facility-name">{facility.facility_type}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section attractions-section">
        <h2>周边景点</h2>
        <div className="attractions-list">
          {currentHotel.attractions.map((attraction) => (
            <div key={attraction.id} className="attraction-item">
              <LikeOutline className="attraction-icon" />
              <div className="attraction-info">
                <span className="attraction-name">{attraction.name}</span>
                <span className="attraction-distance">{attraction.distance}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section rooms-section">
        <h2>房型选择</h2>
        <div className="rooms-list">
          {rooms.map((room) => (
            <div key={room.id} className="room-item">
              <div className="room-info">
                <h3>{room.name}</h3>
                <p className="room-desc">{room.description}</p>
                <div className="room-tags">
                  <Tag>{room.bed_type}</Tag>
                  <Tag>{room.area}m²</Tag>
                  <Tag>可住{room.max_guests}人</Tag>
                </div>
              </div>
              <div className="room-price">
                <span className="price">¥{room.base_price}</span>
                <span className="price-unit">/晚</span>
                <button className="book-btn">预订</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bottom-bar">
        <div className="contact-btn">
          <PhoneFill />
          <span>联系酒店</span>
        </div>
        <button className="reserve-btn">立即预订</button>
      </div>
    </div>
  );
};

export default HotelDetailPage;
