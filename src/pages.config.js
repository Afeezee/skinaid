import About from './pages/About';
import History from './pages/History';
import Home from './pages/Home';
import Privacy from './pages/Privacy';
import SkinCheck from './pages/SkinCheck';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "History": History,
    "Home": Home,
    "Privacy": Privacy,
    "SkinCheck": SkinCheck,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};