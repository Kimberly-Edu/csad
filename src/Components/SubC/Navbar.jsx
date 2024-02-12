import React from "react";
import { Link } from "react-router-dom";
import SignOutBtn from "../../Things/SignOutBtn";

/* https://stackoverflow.com/questions/70935751/how-to-style-a-react-link-component */


const Navbar = () => {
  
  const styleLink = { color:"white", backgroundColor: "#f1356d", borderRadius: '8px', padding:'5px', fontSize:'16px', borderColor:'pink', borderWidth:'3px'};
  // const styleLink = { color:"white", backgroundColor: "#f1356d", borderRadius: '8px', fontSize: '16px', borderColor:'pink', borderWidth:'2px'};

  return (
    <div className="navbar">
      <h1>Heading</h1>
      <div className="links">

        <Link to="/" ><button style={styleLink}>Home</button></Link>
        <Link to="/post" ><button style={styleLink}>New Blog</button></Link>
        <SignOutBtn></SignOutBtn>
      

      {/* <Link to="/">
        <div className="text-3xl font-extrabold text-gray-900 dark:text-white font-roboto">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-red-600 from-blue-400">
            Social Media
          </span>{" "}
          App
        </div>
      </Link> */}
    </div>
    </div>
  );
};

export default Navbar;
