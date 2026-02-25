import { useState, useMemo, useEffect } from 'react';
import { Calendar, Button } from 'antd-mobile';
import { MinusOutline, AddOutline } from 'antd-mobile-icons';
import './DateRangePicker.css';

const DateRangePicker = ({ checkin, checkout, onConfirm, visible, onClose }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [startDate, setStartDate] = useState(() => checkin ? new Date(checkin) : null);
  const [endDate, setEndDate] = useState(() => checkout ? new Date(checkout) : null);
  const [nights, setNights] = useState(() => {
    if (checkin && checkout) {
      return Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));
    }
    return 1;
  });

  useEffect(() => {
    if (checkin) setStartDate(new Date(checkin));
    if (checkout) setEndDate(new Date(checkout));
    if (checkin && checkout) {
      setNights(Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24)));
    }
  }, [checkin, checkout, visible]);

  const formatDateStr = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const handleCalendarChange = (val) => {
    if (Array.isArray(val)) {
      if (val.length === 1) {
        setStartDate(val[0]);
        setEndDate(null);
      } else if (val.length === 2) {
        setStartDate(val[0]);
        setEndDate(val[1]);
        const n = Math.ceil((val[1] - val[0]) / (1000 * 60 * 60 * 24));
        setNights(n);
      }
    } else {
      if (!startDate) {
        setStartDate(val);
        setEndDate(addDays(val, nights));
      } else if (!endDate) {
        if (val > startDate) {
          setEndDate(val);
          const n = Math.ceil((val - startDate) / (1000 * 60 * 60 * 24));
          setNights(n);
        } else {
          setStartDate(val);
        }
      } else {
        setStartDate(val);
        setEndDate(null);
      }
    }
  };

  const handleNightsChange = (delta) => {
    const newNights = Math.max(1, Math.min(30, nights + delta));
    setNights(newNights);
    if (startDate) {
      setEndDate(addDays(startDate, newNights));
    }
  };

  const handleConfirm = () => {
    if (startDate && endDate) {
      onConfirm(formatDateStr(startDate), formatDateStr(endDate), nights);
      onClose?.();
    } else if (startDate) {
      const autoEndDate = addDays(startDate, nights);
      setEndDate(autoEndDate);
      onConfirm(formatDateStr(startDate), formatDateStr(autoEndDate), nights);
      onClose?.();
    }
  };

  const selectedInfo = useMemo(() => {
    if (!startDate) return null;
    const startMonth = startDate.getMonth() + 1;
    const startDay = startDate.getDate();
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    
    if (!endDate) {
      return {
        startStr: `${startMonth}月${startDay}日 ${weekDays[startDate.getDay()]}`,
        endStr: '请选择离店日期',
        nights: 0,
      };
    }
    
    const endMonth = endDate.getMonth() + 1;
    const endDay = endDate.getDate();
    return {
      startStr: `${startMonth}月${startDay}日 ${weekDays[startDate.getDay()]}`,
      endStr: `${endMonth}月${endDay}日 ${weekDays[endDate.getDay()]}`,
      nights,
    };
  }, [startDate, endDate, nights]);

  const calendarValue = useMemo(() => {
    if (startDate && endDate) {
      return [startDate, endDate];
    } else if (startDate) {
      return [startDate];
    }
    return null;
  }, [startDate, endDate]);

  return (
    <div className="date-range-picker">
      {selectedInfo && (
        <div className="date-display">
          <div className="date-item">
            <span className="date-label">入住</span>
            <span className="date-value">{selectedInfo.startStr}</span>
          </div>
          <div className="date-divider">
            <div className="nights-control">
              <button 
                className="nights-btn"
                onClick={() => handleNightsChange(-1)}
                disabled={nights <= 1}
              >
                <MinusOutline />
              </button>
              <span className="nights-badge">{selectedInfo.nights || nights}晚</span>
              <button 
                className="nights-btn"
                onClick={() => handleNightsChange(1)}
                disabled={nights >= 30}
              >
                <AddOutline />
              </button>
            </div>
          </div>
          <div className="date-item">
            <span className="date-label">离店</span>
            <span className={`date-value ${!endDate ? 'placeholder' : ''}`}>
              {selectedInfo.endStr}
            </span>
          </div>
        </div>
      )}

      <div className="calendar-wrapper">
        <Calendar
          selectionMode="range"
          value={calendarValue}
          onChange={handleCalendarChange}
          minDate={today}
        />
      </div>

      <div className="confirm-btn-wrapper">
        <Button 
          block 
          color="primary" 
          size="large"
          onClick={handleConfirm}
          disabled={!startDate}
        >
          {startDate && endDate ? `确认 · ${nights}晚` : '请选择离店日期'}
        </Button>
      </div>
    </div>
  );
};

export default DateRangePicker;
