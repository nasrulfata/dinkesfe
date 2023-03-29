import { BrowserRouter, Route, Routes } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from "./components/Login/Login"
import NavigationBar from "./components/NavigationBar/NavigationBar"

// User
import FormUbahPassword from "./components/User/FormUbahPassword"

// RL 3.7
import RL37 from "./components/RL37/RL37"


// RL 3.12
import RL312 from "./components/RL312/RL312"


// RL 3.13A
import RL313A from "./components/RL313A/RL313A"


// RL 3.13B
import RL313B from "./components/RL313B/RL313B"


//RL 5.4

import RL54 from "./components/RL54/RL54.js"

function App() {
  return (
    <BrowserRouter basename={''}>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="admin/beranda" element={<><NavigationBar/></>} />
        <Route path="/user/ubahpassword" element={<><NavigationBar/><FormUbahPassword/></>}/>


        <Route path="admin/rl37" element={<><NavigationBar/><RL37/></>}/>


        <Route path="admin/rl312" element={<><NavigationBar/><RL312/></>}/>


        <Route path="admin/rl313A" element={<><NavigationBar/><RL313A/></>}/>

        <Route path="admin/rl313B" element={<><NavigationBar/><RL313B/></>}/>


        <Route path="admin/rl54" element={<><NavigationBar/><RL54/></>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
