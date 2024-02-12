import './App.css';
import React, {useEffect, useState} from 'react'
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom'; // Surround with <Router> tag
import Login from "./Components/Login";
import Register from "./Components/Register";
import Reset from "./Components/Reset";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import AppContext from "./AppContext/AppContext";
import Navbar from './Components/SubC/Navbar'; // don't use {}
import NotFound from './Components/NotFound';
import NewPost from './Components/NewPost';
import Leftbar from './Components/SubC/Leftbar';

/* Give credentials to Firebase, get Token

Unknown browserlist problem?
https://stackoverflow.com/questions/56644607/create-react-app-failed-to-compile-on-start-up
 */

// import { AuthContext } from "./AppContext/AppContext"; // sign out?
function App() {
  // const { user, userData } = useContext(AuthContext);
  // const [backendData, setBackendData] = useState([{}]);
  // useEffect(()=>{
  //   fetch("/api").then(
  //     console.log('response');
  //     response => response.json()
  //   ).then(
  //     console.log('help');
  //     data => {
  //       setBackendData(data)}
  //   )

  // }, [])
// router, appcontext
  return (
    
    <Router>
    <div className="App">
    {/* <BrowserRouter> */}
      <Navbar></Navbar>
      
      App Content has loaded.
      {/* {(typeof backendData.users === 'undefined') ? (<p>Loading {JSON.stringify(backendData)}</p>
      ):( backendData.users.map((user, i) => {<p key={i}>{user}</p>})
      )} */}
      <div className="content">
      <AppContext>
        <Routes>
        <Route exact path="/" element={<Home></Home>}></Route>
        <Route path="/post" element={<NewPost></NewPost>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route path="reset" element={<Reset></Reset>}></Route>
        <Route path="*" element={<NotFound></NotFound>}></Route>
        
        {/* <Route path="/profile/:id" element={<Profile></Profile>}></Route> */}
      </Routes>
      </AppContext></div>
    {/* </BrowserRouter> */}
    </div>

    <div className="flex-auto w-[20%] fixed top-0">
          <Leftbar></Leftbar>
        </div>
    </Router>
  );
}

export default App;

