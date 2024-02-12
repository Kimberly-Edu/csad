import {React, useState, useRef, useContext, useReducer, useEffect} from "react";
import { AuthContext } from "../AppContext/AppContext";
import {doc,setDoc,collection,query,onSnapshot,where,getDocs,updateDoc,arrayUnion,deleteDoc,} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Avatar } from "@material-tailwind/react";
import avatar from "../assets/images/avatar.jpg";
import remove from "../assets/images/delete.png";

const Comment = ({name, comment, image, uid, pid, cid}) => {

  const { user, userData } = useContext(AuthContext); // get the current user
  if (uid === undefined || uid === null){uid = "--empty--"} // alert(uid);
  if (pid === undefined || pid === null){pid = "--empty--"} // alert(uid);
  
  const comRef = doc(collection(db, "posts", pid, "comments"));
  const comCollection = collection(db, "posts", pid, "comments");
  const singleCommentDocument = doc(db, "posts", pid, "comments", cid);
  
  let canDelete = false; // is usestate required?
  if (user?.uid === uid) {canDelete = true;}
  const deleteComment = async (e) => {
    e.preventDefault();
    try {
      // alert('deleting...'+"\n"+user?.uid);
      if (user?.uid === uid) {await deleteDoc(singleCommentDocument);
      } else {alert("You cant delete other users comments !!!");}
    } catch (err) {
      alert(err.message);
      console.log(err.message);
  }};

  // let hasHover = false;
  const [hasHover, setHover] = useState("");
  const optionsToggle = (expand, e) => { // use callback https://stackoverflow.com/questions/71244743/onmouseenter-isnt-working-for-me-react
      if (expand === 1){ setHover(true);} else { setHover(false);}}
  // alert(user?.uid +"\n"+ canDelete +"\n"+uid);

  return (
    <div className="flex items-center mt-2 w-full"
    onMouseEnter={() => {optionsToggle(1)}} onMouseLeave={() => {optionsToggle(0)}}
    >
      <div className="mx-2">
        <Avatar size="sm" alt="avatar" variant="circular" src={image || avatar} ></Avatar>
      </div>
      <div className="flex flex-col items-start bg-gray-100 rounded-2xl p-1 max-w-[600px]">
        <p className="font-roboto text-black text-sm no-underline tracking-normal leading-none p-1 font-medium">
          {name}
        </p>
        <p className="font-roboto text-black text-sm no-underline tracking-normal leading-none p-1 font-medium">
          {comment}
        </p>
        
      </div>
      <div>
        {canDelete && hasHover && <div className="flex items-center cursor-pointer rounded-lg p-2 hover:bg-gray-100"
          onClick={deleteComment}>
          <img className="h-8 mr-4" src={remove} alt="delete"></img>
          <p className="font-roboto font-medium text-md text-gray-700 no-underline tracking-normal leading-none">
            Delete </p></div>}
          </div>
        
    </div>
  );
};

export default Comment;
