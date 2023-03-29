import { BrowserRouter, Route, Routes } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from "./components/Login/Login"
import NavigationBar from "./components/NavigationBar/NavigationBar"

// User
import FormUbahPassword from "./components/User/FormUbahPassword"

// RL 3.7
import RL37 from "./components/RL37/RL37"
import FormTambahRL37 from "./components/RL37/FormTambahRL37"
import FormUbahRL37 from "./components/RL37/FormUbahRL37"

// RL 3.12
import RL312 from "./components/RL312/RL312"
import FormTambahRL312 from "./components/RL312/FormTambahRL312"
import FormUbahRL312 from "./components/RL312/FormUbahRL312"

// RL 3.13A
import RL313A from "./components/RL313A/RL313A"
import FormTambahRL313A from "./components/RL313A/FormTambahRL313A"
import FormUbahRL313A from "./components/RL313A/FormUbahRL313A"

// RL 3.13B
import RL313B from "./components/RL313B/RL313B"
import FormTambahRL313B from "./components/RL313B/FormTambahRL313B"
import FormUbahRL313B from "./components/RL313B/FormUbahRL313B"

//RL 5.4
import FormTambahRL54 from "./components/RL54/FormTambahRL54"
import FormUbahRL54 from "./components/RL54/FormUbahRL54"
import RL54 from "./components/RL54/RL54.js"

function App() {
  return (
    <BrowserRouter basename={''}>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="admin/beranda" element={<><NavigationBar/></>} />
        <Route path="/user/ubahpassword" element={<><NavigationBar/><FormUbahPassword/></>}/>


        <Route path="admin/rl37" element={<><NavigationBar/><RL37/></>}/>
        <Route path="/rl37/tambah" element={<><NavigationBar/><FormTambahRL37/></>}/>
        <Route path="/rl37/ubah/:id" element={<><NavigationBar/><FormUbahRL37/></>}/>

        <Route path="admin/rl312" element={<><NavigationBar/><RL312/></>}/>
        <Route path="/rl312/tambah" element={<><NavigationBar/><FormTambahRL312/></>}/>
        <Route path="/rl312/ubah/:id" element={<><NavigationBar/><FormUbahRL312/></>}/>

        <Route path="admin/rl313A" element={<><NavigationBar/><RL313A/></>}/>
        <Route path="/rl313A/tambah" element={<><NavigationBar/><FormTambahRL313A/></>}/>
        <Route path="/rl313A/ubah/:id" element={<><NavigationBar/><FormUbahRL313A/></>}/>

        <Route path="admin/rl313B" element={<><NavigationBar/><RL313B/></>}/>
        <Route path="/rl313B/tambah" element={<><NavigationBar/><FormTambahRL313B/></>}/>
        <Route path="/rl313B/ubah/:id" element={<><NavigationBar/><FormUbahRL313B/></>}/>

        <Route path="admin/rl54" element={<><NavigationBar/><RL54/></>}/>
        <Route path="/rl54/tambah" element={<><NavigationBar/><FormTambahRL54/></>}/>
        <Route path="/rl54/ubah/:id" element={<><NavigationBar/><FormUbahRL54/></>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
