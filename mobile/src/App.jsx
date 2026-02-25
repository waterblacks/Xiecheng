import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import store from './store';
import HomePage from './pages/Home';
import HotelListPage from './pages/HotelList';
import HotelDetailPage from './pages/HotelDetail';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hotels" element={<HotelListPage />} />
          <Route path="/hotel/:id" element={<HotelDetailPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
