import {useState, useRef, useContext, useReducer, useEffect} from "react"; 


import nature from "../../assets/images/nature.jpg";
import { Tooltip } from "@material-tailwind/react";
import { Avatar } from "@material-tailwind/react";
import avatar from "../../assets/images/avatar.jpg";
import job from "../../assets/images/job.png";
import location from "../../assets/images/location.png";
import facebook from "../../assets/images/facebook.png";
import twitter from "../../assets/images/twitter.png";
import laptop from "../../assets/images/laptop.jpg";
import media from "../../assets/images/media.jpg";
import apps from "../../assets/images/apps.jpg";
import tik from "../../assets/images/tik.jpg";
import { Link } from "react-router-dom";


import { collection, doc, setDoc, query, orderBy, onSnapshot, serverTimestamp, updateDoc, getDocs, where } from "firebase/firestore";
import { auth, db, onAuthStateChanged } from "../../firebase/firebase";
import { AuthContext } from "../../AppContext/AppContext";

const LeftBar = () => {
  const [data, setData] = useState([]);
  const count = useRef(0);

    const user = {}; const userData = {};
  onAuthStateChanged(auth, (user) => { // sign out if not allowed
    if (user) { // User is signed in
        // console.log(user);
        // user = user; 
      const uid = user.uid;
    } else { // User is signed out
        // navigate("/login")
        console.log("no user");
    }});
//   const { user, userData } = useContext(AuthContext);

  const handleRandom = (arr) => {
    setData(arr[Math.floor(Math.random() * arr?.length)]);
  };

  useEffect(() => {
    const imageList = [
      {
        id: "1",
        image: laptop,
      },
      {
        id: "2",
        image: media,
      },
      {
        id: "3",
        image: apps,
      },
      {
        id: "4",
        image: tik,
      },
    ];
    handleRandom(imageList);
    let countAds = 0;
    let startAds = setInterval(() => {
      countAds++;
      handleRandom(imageList);
      count.current = countAds;
      if (countAds === 5) {
        clearInterval(startAds);
      }
    }, 2000);

    return () => {
      clearInterval(startAds);
    };
  }, []);

  const progressBar = () => {
    switch (count.current) {
      case 1:
        return 20;
      case 2:
        return 40;
      case 3:
        return 60;
      case 4:
        return 80;
      case 5:
        return 100;
      default:
        return 0;
    }
  };
  
  const [bar, setBar] = useState("");
  function setStyle(exact){
      if (exact === 1){ setBar("basis-0");
    }else { setBar("");
    }
  }


  return (<>
    <div className="flex flex-col h-screen bg-white pb-4 border-2 rounded-r-xl shadow-lg">
      <div className="flex flex-col items-center relative" style={{zIndex:2}}>
        <img
          className="h-28 w-full rounded-r-xl"
          src={nature}
          alt="nature"
        ></img>
        <div className="absolute -bottom-4">
          <Tooltip content="Profile" placement="top">
            <Link to="/profile/pWJA9aGC42WPQYVrjHLXeRLNodK2"> 
            
            <Avatar size="md" src={user?.photoURL || avatar} alt="avatar"></Avatar>
            </Link>
          </Tooltip>
        </div>
      </div>
      <div className="flex flex-col items-center pt-6">
        <p className="font-roboto font-medium text-md text-gray-700 no-underline tracking-normal leading-none">
          {user?.email || userData?.email}
        </p>
        <p className="font-roboto font-medium text-sm text-gray-700 no-underline tracking-normal leading-none py-2">
          InsertText </p>
        <p className="font-roboto font-medium text-xs text-gray-700 no-underline tracking-normal leading-none">
          InsertText </p>
      </div>


      <div className="flex  flex-col  pl-2">
        <div className="flex items-center pb-4">
          <img className="h-10" src={location} alt="location"></img>
          <p className="font-roboto font-bold text-lg no-underline tracking-normal leading-none">
            California
          </p>
        </div>
        <div className="flex items-center ">
          <img className="h-10" src={job} alt="job"></img>
          <p className="font-roboto font-bold text-lg no-underline tracking-normal leading-none">
            React Developer
          </p>
        </div>
        <div className="flex justify-center items-center pt-4 text-wrap">
          <p className="font-roboto font-bold text-md text-[#0177b7] no-underline tracking-normal leading-none">
            Events
          </p>
          <p className="font-roboto font-bold text-md text-[#0177b7] no-underline tracking-normal leading-none mx-2">
            Groups
          </p>
          <p className="font-roboto font-bold text-md text-[#0177b7] no-underline tracking-normal leading-none">
            Follow
          </p>
        </div>
      </div>
      <div className="ml-2">
        <div className="flex items-center">
          <img className="h-10 mb-3 mr-2" src={facebook} alt="facebook"></img>
          <p className="font-roboto font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r to-red-700 from-blue-500 no-underline tracking-normal leading-none py-2">
            Social Network
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center pt-4">
        <p className="font-roboto font-bold text-lg no-underline tracking-normal leading-none py-2">
          Random Ads
        </p>
        <div
          style={{ width: `${progressBar()}%` }}
          className="bg-blue-600 rounded-xl h-1 mb-4"
        ></div>
        <img className="h-36 rounded-lg" src={data.image} alt="ads"></img>
      </div>

      <button className="self-end bg-black text-gray-200 relative left-14 rounded-xl p-2 pl-20" style={{bottom: "540px", zIndex:1}}>  Hide  </button>
    

    </div>
    </>

  );
};

export default LeftBar;
