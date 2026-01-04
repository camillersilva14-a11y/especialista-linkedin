import LinkedInOptimizer from './pages/LinkedInOptimizer';
import AdminDashboard from './pages/AdminDashboard';
import __Layout from './Layout.jsx';


export const PAGES = {
    "LinkedInOptimizer": LinkedInOptimizer,
    "AdminDashboard": AdminDashboard,
}

export const pagesConfig = {
    mainPage: "LinkedInOptimizer",
    Pages: PAGES,
    Layout: __Layout,
};