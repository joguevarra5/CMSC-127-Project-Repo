import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MembersPage from './pages/MembersPage';
import Fees from './pages/Fees';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MembersPage />} />
        <Route path="/fees" element={<Fees />} />
      </Routes>
    </Router>
  );
}

export default App;