import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home.jsx"
import Layout from "./pages/Layout.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import Blogtitles from "./pages/Blogtitles.jsx"
import Writearticles from "./pages/Writearticles.jsx"
import GenImg from "./pages/GenImg.jsx"
import Removebg from "./pages/Removebg.jsx"
import Removeobj from "./pages/Removeobj.jsx"
import Reviewresume from "./pages/Reviewresume.jsx"
import Community from "./pages/Community.jsx"
import { useAuth } from "@clerk/clerk-react"
import { useEffect } from "react"


const App = () => {

  const {getToken} = useAuth();

  useEffect(() => {
    getToken().then((token) => {
      // Use the token to fetch data
      console.log("Token fetched:", token);
    });
  }, []);
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="blog-titles" element={<Blogtitles />} />
          <Route path="write-article" element={<Writearticles />} />
          <Route path="generate-images" element={<GenImg />} />
          <Route path="remove-background" element={<Removebg />} />
          <Route path="remove-object" element={<Removeobj />} />
          <Route path="review-resume" element={<Reviewresume />} />
          <Route path="community" element={<Community />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
