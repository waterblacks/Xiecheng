import { Popup, Selector } from 'antd-mobile';
import { CITY_OPTIONS } from './cityFilter';

const CitySelectorPopup = ({
  visible,
  onClose,
  onConfirm,
  value,
  onChange,
  options = CITY_OPTIONS,
}) => {
  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position="bottom"
      bodyStyle={{ height: '40vh', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
    >
      <div className="popup-header">
        <span>选择城市</span>
        <span className="popup-close" onClick={() => onConfirm?.(value)}>完成</span>
      </div>
      <div className="city-picker-content">
        <Selector
          columns={3}
          multiple
          options={options}
          value={value}
          onChange={onChange}
          style={{ '--gap': '12px' }}
        />
      </div>
    </Popup>
  );
};

export default CitySelectorPopup;
