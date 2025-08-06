import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home.jsx"
import Layout from "./pages/Layout.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import Blogtitles from "./pages/Blogtitles.jsx"
import Writearticles from "./pages/Writearticles.jsx"

function App() {
  

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="blogtitles" element={<Blogtitles />} />
          <Route path="writearticles" element={<Writearticles />} />

        </Route>
      </Routes>
    </>
  )
}

export default App
