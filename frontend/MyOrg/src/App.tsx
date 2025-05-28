import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MembersPage from './pages/MembersPage';
import ReportsPage from './pages/ReportsPage';
import FeesReportsPage from './pages/FeeReportsPage';
import Fees from './pages/Fees';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MembersPage />} />
        <Route path="/fees" element={<Fees />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/reports-fees" element={<FeesReportsPage />} />
      </Routes>
    </Router>
  );
}

export default App;