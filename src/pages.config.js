import Home from './pages/Home';
import SkinCheck from './pages/SkinCheck';
import History from './pages/History';
import About from './pages/About';
import Privacy from './pages/Privacy';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "SkinCheck": SkinCheck,
    "History": History,
    "About": About,
    "Privacy": Privacy,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};