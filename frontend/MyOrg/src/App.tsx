import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Fees from './pages/Fees'; // <-- import your Fees component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/fees" element={<Fees />} />
      </Routes>
    </Router>
  );
}

export default App;