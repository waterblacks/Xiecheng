import { Popup, Selector } from 'antd-mobile';

const OptionSelectorPopup = ({
  visible,
  onClose,
  title,
  options,
  value,
  onChange,
  columns = 3,
}) => {
  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position="bottom"
      bodyStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
    >
      <div className="popup-header">
        <span>{title}</span>
        <span className="popup-close" onClick={onClose}>取消</span>
      </div>
      <div className="quick-picker-content">
        <Selector
          columns={columns}
          options={options}
          value={value}
          onChange={onChange}
          style={{ '--gap': '12px' }}
        />
      </div>
    </Popup>
  );
};

export default OptionSelectorPopup;
