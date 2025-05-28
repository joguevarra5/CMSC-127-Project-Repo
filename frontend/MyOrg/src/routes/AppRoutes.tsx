import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Import admin pages
import MembersPage from '../pages/MembersPage';
import ReportsPage from '../pages/ReportsPage';


const AppRoutes = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MembersPage />} />
                <Route path="/reports" element={<ReportsPage />} />
            </Routes>
        </BrowserRouter>
    )

};

export default AppRoutes;
