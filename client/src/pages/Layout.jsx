import { Outlet, useNavigate } from "react-router-dom"
import { assets } from "../assets/assets";
import { useState } from "react";
import { X } from "lucide-react";
import { Menu } from "lucide-react";

const Layout = () => {

  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  return (
    <div className="flex flex-col items-start justify-start h-screen">
        <nav>
          <img src={assets.logo} alt="" onClick={() => navigate('/')} />
          {
            sidebar ? <X onClick={() => setSidebar(false)} className="w-6 h-6 text-gray-600 sm:hidden"/>
            : <Menu onClick={() => setSidebar(true)} className="w-6 h-6 text-gray-600 sm:hidden"/>
          }
        </nav>
        <Outlet />
    </div>
  )
}

export default Layout;