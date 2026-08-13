import { Routes, Route, useLocation } from "react-router-dom";
import { Home } from "./Components/Home/Home";
import { DetailProduct } from "./Components/Detail/Detail_product";
import { About } from "./Components/About/About";
import { Nav } from "./Components/Nav/Nav";
import { Products } from "./Components/Products/Products";
import { AuthProvider } from "./context/AuthContext";
import Footer from "./Components/Footer/Footer";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import ShoppingCart from "./Components/shopping cart/ShoppingCart";
import { setItem } from "./utils/localStorage";
import { useSelector } from "react-redux";
import UserProfile from "./Components/userComponents/userProfile/userProfile";
import UserBuys from "./Components/buys/UserBuys";

import AdminLayout from './Components/adminComponents/admin/AdminLayout';
import HomeUnauthorized from './Components/adminComponents/HomeUnauthorized/HomeAnauthorized'


function App(){
  const dispatch = useDispatch()
  const location = useLocation()
  const cart = useSelector((state) => state.cartShop);

  useEffect(() => {
    setItem("cartShop", cart);
  }, [cart]);
  return (
    <>

     <AuthProvider>
    {location.pathname !== "/" && <Nav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/about' element={<About/>}/>
        <Route path='/products/detail/:name' element={<DetailProduct/>}/>
        <Route path="/shoppingCart" element={<ShoppingCart />} />
        <Route path="/products" element={<Products />} />
        <Route path='/userProfile' element={<UserProfile/>}/>
        <Route path='/buys' element={<UserBuys/>}/>

          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/home" element={<HomeUnauthorized />} />

        </Routes>

    {location.pathname !== "/" && <Footer />}
     </AuthProvider>
    </>
  );
}

export default App;