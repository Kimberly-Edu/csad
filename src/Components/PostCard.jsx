import React, { useState, useContext, useEffect, useReducer } from "react";
import { Avatar } from "@material-tailwind/react";
import avatar from "../assets/images/avatar.jpg";
import like from "../assets/images/like.png";
import comment from "../assets/images/comment.png";
import remove from "../assets/images/delete.png";
import edit from "../assets/images/edit.png";
import addFriend from "../assets/images/add-friend.png";
import { AuthContext } from "../AppContext/AppContext";
import {
  PostsReducer,
  postActions,
  postsStates,
} from "../AppContext/PostReducer";
import {
  doc, setDoc, collection, query,
  onSnapshot, where,
  getDocs, updateDoc,
  arrayUnion, deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import CommentSection from "./CommentSection";

import { Link } from "react-router-dom";



const PostCard = ({ uid, id, logo, name, email, text, desc, image, timestamp, getPostId }) => {  
  // if (desc != undefined){  alert(desc);}
  if (text === undefined || text === null){text = ""}
  if (desc === undefined || desc === null){desc = ""}
  if (image === undefined || image === null){image = ""}
  if (timestamp === undefined || timestamp === null){timestamp = ""}
  
  if (uid === undefined || uid === null){uid = "err_no_uid"}
  if (name === undefined || name === null){name = "Somebody"}
  if (email === undefined || email === null){email = "No email"}
  if (logo === undefined || logo === null){logo = ""}
  // alert(undefined == null); // undefined == null but undefined === null is false.

  const { user } = useContext(AuthContext);
  const [state, dispatch] = useReducer(PostsReducer, postsStates);
  const likesRef = doc(collection(db, "posts", id, "likes"));
  const likesCollection = collection(db, "posts", id, "likes");
  const singlePostDocument = doc(db, "posts", id);
  const { ADD_LIKE, HANDLE_ERROR } = postActions;
  const [open, setOpen] = useState(false);

  
  const handleOpen = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  const addUser = async () => {
    // alert("addme");
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].ref;
      await updateDoc(data, {
        friends: arrayUnion({
          id: uid}),});
    } catch (err) { alert(err.message); console.log(err.message);
    }
  };

  const handleLike = async (e) => {
    e.preventDefault();
    const q = query(likesCollection, where("id", "==", user?.uid));
    const querySnapshot = await getDocs(q);
    const likesDocId = await querySnapshot?.docs[0]?.id;
    try {
      if (likesDocId !== undefined) {
        const deleteId = doc(db, "posts", id, "likes", likesDocId);
        await deleteDoc(deleteId);
      } else {
        await setDoc(likesRef, {
          id: user?.uid,
        });
      }
    } catch (err) {
      alert(err.message);
      console.log(err.message);
    }
  };

  let canDelete = false;
  if (user?.uid === uid) {canDelete = true;}
  const deletePost = async (e) => {
    e.preventDefault();
    try {
      if (user?.uid === uid) {
        await deleteDoc(singlePostDocument);
      } else {
        alert("You cant delete other users posts !!!");
      }
    } catch (err) {
      alert(err.message);
      console.log(err.message);
    }
  };
  const editPost = async (e) => {
    e.preventDefault();
    try {
      if (user?.uid === uid) {
        // alert(getPostId);
        getPostId(id)
      } else {
        alert("You cant edit other users posts !!!");
      }
    } catch (err) {alert(err.message);console.log(err.message);}};


  useEffect(() => {
    const getLikes = async () => {
      try {
        const q = collection(db, "posts", id, "likes");
        await onSnapshot(q, (doc) => {
          dispatch({
            type: ADD_LIKE,
            likes: doc.docs.map((item) => item.data()),
          });
        });
      } catch (err) {
        dispatch({ type: HANDLE_ERROR });
        alert(err.message);
        console.log(err.message);
      }
    };
    return () => getLikes();
  }, [id, ADD_LIKE, HANDLE_ERROR]);


  const pfp_link = "/profile/"+uid; // it does not like me
  return (
    <div className="mb-4">
      <div className="flex flex-col py-4 bg-white rounded-t-3xl " style={{border:"5px solid red"}}>
        <div className="flex justify-start items-center pb-4 pl-4 " style={{border:"2px solid blue"}}>

          {/* uid  alert(uid) */}
          <Link to={pfp_link}>
          <Avatar size="sm" variant="circular" src={logo || avatar} alt="avatar"
          ></Avatar> </Link>

          <div className="flex flex-col ml-4">
            <p className=" py-2 font-roboto font-medium text-sm text-gray-700 no-underline tracking-normal leading-none">
              {email}
            </p>
            <p className=" font-roboto font-medium text-sm text-gray-700 no-underline tracking-normal leading-none">
              Published: {timestamp}
            </p>
          </div>
          {user?.uid !== uid && (
            <div onClick={addUser}
              className="w-full flex justify-end cursor-pointer mr-10">
              <img
                className="hover:bg-blue-100 rounded-xl p-2"
                src={addFriend}
                alt="addFriend"
              ></img>
            </div>
          )}
        </div>
        <div>
        
          <p className="ml-4 pb-2 font-roboto font-medium text-sm text-gray-900 no-underline tracking-normal leading-none text-xl">
            {text}</p>
          <p className="ml-5 pb-2 font-roboto font-medium text-sm text-gray-600 no-underline tracking-normal leading-none">
            {desc}</p>
          {image && (
            <img className="h-[500px] w-full" src={image} alt="postImage"
              style={{border:"10px solid green"}}
            ></img>
          )}
        </div>

        
        <div className="flex justify-around items-center pt-4">
          <button
            className="flex items-center cursor-pointer rounded-lg p-2 hover:bg-gray-100"
            onClick={handleLike}
          >
            <img className="h-8 mr-4" src={like} alt=""></img>
            {state.likes?.length > 0 && state?.likes?.length}
          </button>
          <div
            className="flex items-center cursor-pointer rounded-lg p-2 hover:bg-gray-100"
            onClick={handleOpen}
          >
            <div className="flex items-center cursor-pointer">
              <img className="h-8 mr-4" src={comment} alt="comment"></img>
              <p className="font-roboto font-medium text-md text-gray-700 no-underline tracking-normal leading-none">
                Comments
              </p>
            </div>
          </div>
          {canDelete && <div className="flex items-center cursor-pointer rounded-lg p-2 hover:bg-gray-100"
            onClick={deletePost}>
            <img className="h-8 mr-4" src={remove} alt="delete"></img>
            <p className="font-roboto font-medium text-md text-gray-700 no-underline tracking-normal leading-none">
              Delete </p></div>}
            {canDelete && <div className="flex items-center cursor-pointer rounded-lg p-2 hover:bg-gray-100"
              onClick={editPost}>
              <img className="h-8 mr-4" src={edit} alt="edit"></img>
              <p className="font-roboto font-medium text-md text-gray-700 no-underline tracking-normal leading-none">
                Edit </p></div>
              }
          </div>
      </div>
      {open && <CommentSection postId={id}></CommentSection>}
    </div>
  );
};

export default PostCard;