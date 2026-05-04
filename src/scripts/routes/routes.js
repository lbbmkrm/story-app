import HomePage from "../pages/home/home-page";
import AboutPage from "../pages/about/about-page";
import LoginPage from "../pages/login/login-page";
import RegisterPage from "../pages/register/register-page";
import AddPage from "../pages/add/add-page";
import DetailPage from "../pages/detail/detail-page";
import FavoritePage from "../pages/favorite/favorite-page";

const routes = {
  "/": new HomePage(),
  "/about": new AboutPage(),
  "/login": new LoginPage(),
  "/register": new RegisterPage(),
  "/add": new AddPage(),
  "/favorite": new FavoritePage(),
  "/stories/:id": new DetailPage(),
};

export default routes;
