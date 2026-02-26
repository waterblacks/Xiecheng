import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, Tag, Button, SpinLoading, Toast, Popup } from 'antd-mobile';
import { EnvironmentOutline, PhoneFill, HeartOutline, SendOutline, CalendarOutline } from 'antd-mobile-icons';
import { fetchHotelDetail, fetchHotelRooms, clearCurrentHotel, setSearchParams } from '../../store/slices/hotelSlice';
import DateRangePicker from '../../components/DateRangePicker';
import './HotelDetail.css';

const HotelDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentHotel, rooms, loading, searchParams } = useSelector((state) => state.hotel);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    dispatch(fetchHotelDetail(id));
    dispatch(fetchHotelRooms({ id, checkin: searchParams.checkin, checkout: searchParams.checkout }));
    return () => {
      dispatch(clearCurrentHotel());
    };
  }, [dispatch, id, searchParams.checkin, searchParams.checkout]);

  const sortedRooms = useMemo(() => {
    if (!rooms || rooms.length === 0) return [];
    return [...rooms].sort((a, b) => a.base_price - b.base_price);
  }, [rooms]);

  const facilityIcons = {
    '免费WiFi': '📶',
    '游泳池': '🏊',
    '健身房': '💪',
    'SPA': '💆',
    '餐厅': '🍽️',
    '停车场': '🚗',
    '会议室': '💼',
    '洗衣服务': '👔',
    '接机服务': '✈️',
    '酒吧': '🍸',
    '儿童乐园': '🎡',
    '商务中心': '📊',
  };

  const handleDateConfirm = (checkin, checkout, nights) => {
    dispatch(setSearchParams({ checkin, checkout, nights }));
    setShowDatePicker(false);
  };

  const formatDateDisplay = () => {
    if (!searchParams.checkin) return '选择日期';
    const checkin = new Date(searchParams.checkin);
    const month = checkin.getMonth() + 1;
    const day = checkin.getDate();
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    if (!searchParams.checkout) return `${month}月${day}日 ${weekDays[checkin.getDay()]}`;
    const checkout = new Date(searchParams.checkout);
    const outMonth = checkout.getMonth() + 1;
    const outDay = checkout.getDate();
    return `${month}/${day}-${outMonth}/${outDay} · ${searchParams.nights}晚`;
  };

  if (loading || !currentHotel) {
    return (
      <div className="detail-loading">
        <SpinLoading color="primary" />
        <span>加载中...</span>
      </div>
    );
  }

  return (
    <div className="hotel-detail-page">
      <div className="detail-header">
        <button className="header-btn back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <div className="header-actions">
          <button className="header-btn">
            <SendOutline />
          </button>
          <button className="header-btn">
            <HeartOutline />
          </button>
        </div>
      </div>

      <Swiper className="gallery-swiper" loop>
        {currentHotel.images.map((img, index) => {
          // ========== 第一步：打印完整对象结构 ==========
          console.log(`========== 图片索引 ${index} 调试开始 ==========`);
          console.log('1. 完整的 img 对象:', img);
          console.log('2. img.url 的值:', img?.url);
          console.log('3. img.url 的类型:', typeof img?.url);

          // 如果 img.url 是对象，打印它的所有属性名和值
          if (img?.url && typeof img.url === 'object') {
            console.log('4. img.url 是对象，其属性名列表:', Object.keys(img.url));
            console.log('5. img.url 对象的完整内容:', img.url);
          }

          // ========== 第二步：智能解析图片URL ==========
          let imgSrc = null;
          let imgId = index; // 修复错误：先给一个默认值

          try {
            if (typeof img === 'string') {
              // 情况A：img 本身就是字符串URL
              imgSrc = img;
            } else if (img && typeof img === 'object') {
              // 提取 ID
              imgId = img.id || index;

              // 情况B：img 是对象，开始智能查找
              if (typeof img.url === 'string') {
                // B1: url 是字符串
                imgSrc = img.url;
              } else if (img.url && typeof img.url === 'object') {
                // B2: url 也是对象（您当前的情况）
                // 尝试所有可能的属性名：data, base64, content, path, url, location 等
                const possibleKeys = ['data', 'base64', 'content', 'path', 'url', 'location', 'src'];
                for (const key of possibleKeys) {
                  if (img.url[key] && typeof img.url[key] === 'string') {
                    imgSrc = img.url[key];
                    console.log(`✅ 找到了！图片数据在 img.url.${key} 中`);
                    break;
                  }
                }
              } else if (img.data && typeof img.data === 'string') {
                // B3: 图片数据直接在 data 字段
                imgSrc = img.data;
              } else if (img.base64 && typeof img.base64 === 'string') {
                // B4: 图片数据在 base64 字段
                imgSrc = img.base64;
              } else if (img.path && typeof img.path === 'string') {
                // B5: 图片数据在 path 字段
                imgSrc = img.path;
              }
            }
          } catch (error) {
            console.error('解析图片URL出错:', error);
          }

          // 打印最终结果
          console.log('最终解析的 imgSrc:', imgSrc);
          console.log(`========== 图片索引 ${index} 调试结束 ==========\n`);

          // ========== 第三步：渲染 ==========
          return (
              <Swiper.Item key={imgId}>
                {imgSrc ? (
                    <img src={imgSrc} alt={`${currentHotel.name_cn} ${index + 1}`} className="gallery-image" />
                ) : (
                    <div className="gallery-image-placeholder">
                      <span>⚠️ 图片解析失败</span>
                      <p style={{ fontSize: '12px', marginTop: '5px' }}>请查看控制台了解详情</p>
                    </div>
                )}
              </Swiper.Item>
          );
        })}
      </Swiper>


      <div className="gallery-indicator">
        {currentHotel.images.length} 张图片
      </div>

      <div className="date-banner" onClick={() => setShowDatePicker(true)}>
        <div className="date-banner-left">
          <CalendarOutline className="date-banner-icon" />
          <div className="date-banner-info">
            <span className="date-banner-label">入住 · 离店</span>
            <span className="date-banner-value">{formatDateDisplay()}</span>
          </div>
        </div>
        <span className="date-banner-action">修改</span>
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

      <div className="hotel-info-section">
        <div className="hotel-title-row">
          <h1>{currentHotel.name_cn}</h1>
          <div className="hotel-stars-badge">
            {'★'.repeat(currentHotel.star_rating)}
          </div>
        </div>
        <p className="hotel-name-en">{currentHotel.name_en}</p>

        <div className="hotel-location">
          <EnvironmentOutline className="location-icon" />
          <span>{currentHotel.address}</span>
        </div>

        {currentHotel.promotions && currentHotel.promotions.length > 0 && (
          <div className="promotions">
            {currentHotel.promotions.map((promo) => (
              <Tag key={promo.id} color="danger" round className="promo-tag">
                🔥 {promo.description}
              </Tag>
            ))}
          </div>
        )}

        <p className="hotel-description">{currentHotel.description}</p>
      </div>

      <div className="section info-grid-section">
        <div className="info-grid">
          <div className="info-grid-left">
            <div className="info-grid-title">
              <h2>酒店设施</h2>
              <span className="section-count">{currentHotel.facilities.length}项</span>
            </div>
            <div className="facilities-compact">
              {currentHotel.facilities.slice(0, 6).map((facility) => (
                <div key={facility.id} className="facility-compact-item">
                  <span className="facility-compact-icon">
                    {facilityIcons[facility.facility_type] || '✓'}
                  </span>
                  <span>{facility.facility_type}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="info-grid-divider" />
          <div className="info-grid-right">
            <div className="info-grid-title">
              <h2>周边景点</h2>
            </div>
            <div className="attractions-compact">
              {currentHotel.attractions.map((attraction) => (
                <div key={attraction.id} className="attraction-compact-item">
                  <span className="attraction-compact-name">{attraction.name}</span>
                  <span className="attraction-compact-distance">{attraction.distance}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="section rooms-section">
        <div className="section-title">
          <h2>可选房型</h2>
          <span className="section-count">{sortedRooms.length}款</span>
        </div>
        <div className="rooms-list">
          {sortedRooms.length === 0 ? (
            <div className="no-rooms">暂无可预订房型</div>
          ) : (
            sortedRooms.map((room) => (
              <div key={room.id} className="room-item">
                <div className="room-image">
                  {room.image ? (
                    <img src={room.image} alt={room.name} />
                  ) : (
                    <div className="room-image-placeholder">
                      <span>🛏️</span>
                    </div>
                  )}
                </div>
                <div className="room-info">
                  <h3>{room.name}</h3>
                  <p className="room-desc">{room.description}</p>
                  <div className="room-tags">
                    <Tag className="room-tag">{room.bed_type}</Tag>
                    <Tag className="room-tag">{room.area}m²</Tag>
                    <Tag className="room-tag">可住{room.max_guests}人</Tag>
                  </div>
                </div>
                <div className="room-price-box">
                  <div className="room-price">
                    <span className="price-symbol">¥</span>
                    <span className="price-value">{room.base_price}</span>
                  </div>
                  <button className="book-btn" onClick={() => Toast.show({ content: '预订功能开发中' })}>预订</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bottom-bar">
        <div className="bottom-left">
          <div className="contact-btn">
            <PhoneFill />
            <span>客服</span>
          </div>
        </div>
        <Button 
          color="danger" 
          className="reserve-btn"
          onClick={() => Toast.show({ content: '预订功能开发中' })}
        >
          立即预订
        </Button>
      </div>
    </div>
  );
};

export default HotelDetailPage;
