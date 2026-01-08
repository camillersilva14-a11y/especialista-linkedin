import AdminDashboard from './pages/AdminDashboard';
import LinkedInOptimizer from './pages/LinkedInOptimizer';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AdminDashboard": AdminDashboard,
    "LinkedInOptimizer": LinkedInOptimizer,
}

export const pagesConfig = {
    mainPage: "LinkedInOptimizer",
    Pages: PAGES,
    Layout: __Layout,
};