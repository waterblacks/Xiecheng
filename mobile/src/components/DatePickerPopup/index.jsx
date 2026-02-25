import { Popup } from 'antd-mobile';
import DateRangePicker from '../DateRangePicker';

const DatePickerPopup = ({ visible, onClose, checkin, checkout, onConfirm }) => {
  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position="bottom"
      bodyStyle={{
        height: '70vh',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="popup-header">
        <span>选择入住日期</span>
        <span className="popup-close" onClick={onClose}>关闭</span>
      </div>
      <DateRangePicker
        checkin={checkin}
        checkout={checkout}
        onConfirm={onConfirm}
        visible={visible}
        onClose={onClose}
      />
    </Popup>
  );
};

export default DatePickerPopup;
