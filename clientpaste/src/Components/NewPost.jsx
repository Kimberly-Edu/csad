import {useState, useRef, useContext, useReducer, useEffect} from "react"; 
import {useNavigate} from 'react-router-dom';

import { collection, doc, setDoc, query, orderBy, onSnapshot, serverTimestamp, updateDoc, getDocs, where } from "firebase/firestore";
import { auth, db, onAuthStateChanged } from "../firebase/firebase";
import { getStorage,ref,uploadBytesResumable,getDownloadURL,} from "firebase/storage";
import { AuthContext } from "../AppContext/AppContext";
import {PostsReducer,postActions,postsStates,} from "../AppContext/PostReducer";// ???


import { Avatar } from "@material-tailwind/react";
import avatar from "../assets/images/avatar.jpg";
import { Button } from "@material-tailwind/react";

import addImage from "../assets/images/add-image.png";

const NewPost = ({editPostId, newPostId}) => {
  const [updatingPost, setUP] = useState(false);
  const [oldimage, setOldImage] = useState(false);
  
  if (editPostId === undefined || editPostId === null){editPostId = "";}
    /* 
    text,desc, timestamp
    image, documentId,
    favourites, likes, comments,
    uid, 

    logo, email, ...
    wardrobe_reference 
    
    */
    let show = false;
    // https://firebase.google.com/docs/auth/admin/manage-users
    // console.log(JSON.stringify(auth.currentUser) == "null"); // it runs multiple times?
    if (JSON.stringify(auth.currentUser) != "null"){
        show = true; } else {show = false;}
    onAuthStateChanged(auth, (user) => { // sign out if not allowed
        if (user) { // User is signed in
          const uid = user.uid;
          show = true;
        } else { // User is signed out
            // navigate("/login")
            show = false;
        }});
    // const navigate = useNavigate(); // https://stackoverflow.com/questions/62861269/attempted-import-error-usehistory-is-not-exported-from-react-router-dom back forward
    // https://firebase.google.com/docs/firestore/query-data/get-data
    const { user, userData } = useContext(AuthContext);
    const text = useRef("");
    const desc = useRef("");

    const scrollRef = useRef("");
    const [image, setImage] = useState(null);
    const postRef = doc(collection(db, "posts"));
    const document = postRef.id;
    const [state, dispatch] = useReducer(PostsReducer, postsStates);
    const [file, setFile] = useState(null);
    
    const { SUBMIT_POST, HANDLE_ERROR } = postActions;
    const handleUpload = (e) => {setFile(e.target.files[0]);};
    const handleSubmitPost = async (e) => { // handle "Submit" button in a form...
          e.preventDefault();
          if (text.current.value !== "") {
            try {
              let json_data = {
                documentId: document,
                uid: user?.uid || userData?.uid,
                
                text: text.current.value,
                desc: desc.current.value,
                timestamp: serverTimestamp(),
                image: image,
                wardrobe_reference: "",

                // should be derived data
                logo: user?.photoURL,
                name: user?.displayName, // || userData?.name, // ... ignored for now: https://stackoverflow.com/questions/65734007/firebaseerror-function-adddoc-called-with-invalid-data-unsupported-field-val
                email: user?.email || userData?.email,
              }

              if (updatingPost){
                json_data = {
                  text: text.current.value,
                  desc: desc.current.value,
                  lastTimestamp: serverTimestamp(),
                  image: image,
                  // should be derived data
                  logo: user?.photoURL,
                  name: user?.displayName, // || userData?.name, // ... ignored for now: https://stackoverflow.com/questions/65734007/firebaseerror-function-adddoc-called-with-invalid-data-unsupported-field-val
                  email: user?.email || userData?.email,
                }
                // const singlePostDocument = collection(db, "posts", editPostId); 
                // await updateDoc(singlePostDocument, json_data);
                // const db = getFirestore();
                await updateDoc(doc(db, "posts", editPostId), json_data); // https://stackoverflow.com/questions/49682327/how-to-update-a-single-firebase-firestore-document
                // alert("updating");
              } 
              else{ await setDoc(postRef, json_data);
                // alert("adding");
              }
              // clear
              text.current.value = "";
              desc.current.value = "";
              setFile(null);
              setUP(false);
              setImage(null); setOldImage(null);
              setProgressBar(0);
              editPostId = null;
            } catch (err) {
              dispatch({ type: HANDLE_ERROR });
              alert("ERR1: "+ err.message); 
              // alert(""+user?.photoURL); 
              console.log(err.message);
            }
          } else {
            dispatch({ type: HANDLE_ERROR });
          }
    };
    const updateEditPost = async (e) => {
      // e.preventDefault();
      try {
        // window.HTMLElement.prototype.scrollIntoView = function() {};
        const q = query(collection(db, "posts"), where("documentId", "==", editPostId));
        const querySnapshot = await getDocs(q);// https://firebase.google.com/docs/firestore/query-data/queries
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.data());
            text.current.value = ""+doc.data().text;
            desc.current.value = ""+doc.data().desc;
            
            setOldImage(""+doc.data().image);
            if (doc.data().image!= null) {setImage(doc.data().image);}
          });
          
      } catch (err) {
        alert(err.message);
        console.log(err.message);
      }
    };
 
   
    
      
    const [progressBar, setProgressBar] = useState(0);
    const storage = getStorage();
    const metadata = {contentType: ["image/jpeg", "image/jpg","image/png","image/gif","image/svg+xml",],};
    const submitImage = async () => {
        const fileType = metadata.contentType.includes(file["type"]); // ensure valid format
        if (!file) return;
        if (fileType) { console.log(new Date().getTime());
        try { const storageRef = ref(storage, `images/${new Date().getTime()}`);
            const uploadTask = uploadBytesResumable( storageRef, file, metadata.contentType);
            await uploadTask.on("state_changed",
            (snapshot) => {const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100); setProgressBar(progress);},
            (error) => { alert("ERR2: "+ error); },
            async () => {
                await getDownloadURL(uploadTask.snapshot.ref).then(
                (downloadURL) => { setImage(downloadURL); });}
            );
        } catch (err) {
            dispatch({ type: HANDLE_ERROR });
            alert("ERR3: "+ err.message);
            console.log(err.message);}}
    };
    const removeImage = async () => {
      setFile(null);
      setImage(null);
      setOldImage(null);
      setProgressBar(0);

    }
    
    

    const [textareaStyle, setTAStyle] = useState({paddingTop:"0px", fontSize:"12px"});
    const textareaChange = (expand, e) => {
      if (textareaStyle == {paddingTop:"0px", paddingBottom:"80px", fontSize:"12px"} && expand === 0){ return;} 
        // for(let values in desc) {
        //     console.log("\n" + values + ":" + desc[values]);
        //     for(let values2 in desc[values]) {
        //         console.log("" + values2 + ":" + desc[values][values2]);   
        //     }
        // }
        if (expand === 0){setTAStyle({paddingTop:"0px", paddingBottom:"80px", fontSize:"12px"});}
        else {setTAStyle({paddingTop:"0px", paddingBottom:"10px", fontSize:"12px"});}
    }
    // e.preventDefault(); //avoid refresh of form
    // https://stackoverflow.com/questions/932653/how-to-prevent-buttons-from-submitting-forms
    
         
    //  }// do once rather than repeat
    
    useEffect(() => {
      // alert("fill form:"+newPostId);
      if (newPostId){ // how to stop comment please
        
        updateEditPost();
      scrollRef?.current?.scrollIntoView({
        behavior: "smooth"
      });
      setOldImage(null);
      setUP(true);}

    
      // setTimeout(() =>{
        
      //   }, 20);
      //   return () =>  {} 
    }, [newPostId, editPostId]);
    return (
        <div className="flex flex-col items-center">
          <div ref={scrollRef}>{/* refference for later */}</div>
          {/* (NewPost) {editPostId} */}

        {show && <div className="flex flex-col py-4 w-full bg-white rounded-3xl shadow-lg">
        <div className="flex items-center border-b-2 border-gray-300 pb-4 pl-4 w-full">
            <Avatar size="sm" variant="circular"
            src={user?.photoURL || avatar} alt="avatar"
            ></Avatar>
            <form className="w-full" onSubmit={handleSubmitPost}>
            <div className="flex justify-between items-center">
            <div className="w-full ml-4">
            <input type="text" name="text"
                      placeholder={`Submitting as: ${
                        user?.displayName?.split(" ")[0] ||
                        userData?.name?.charAt(0).toUpperCase() +
                        userData?.name?.slice(1)}`}
                      className="outline-none w-full bg-white rounded-md"
                      ref={text}
            ></input>
            <textarea name="desc" style={textareaStyle}
                onFocus={(e) => {textareaChange(0);}}
                onBlur={(e) => {textareaChange(1);}}
                // https://stackoverflow.com/questions/37609049/how-to-correctly-catch-change-focusout-event-on-text-input-in-react-js
                
                      placeholder={`Enter description here:`}
                        className="outline-none w-full bg-white rounded-md"
                      ref={desc}
            ></textarea>
            </div><div className="mx-4">
                    <Button variant="text" type="submit"> {updatingPost ? "Update":"Post"} </Button>
                  </div></div>
              </form>
            </div>
            <span
              style={{ width: `${progressBar}%` }}
              className="bg-blue-700 py-1 rounded-md"
            ></span>
            <div className="flex justify-around items-center pt-4">
              <div className="flex items-center">
                <label
                  htmlFor="addImage"
                  className="cursor-pointer flex items-center">
                  <img className="h-10 mr-4" src={addImage} alt="addImage"></img>
                  <input
                    id="addImage"
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleUpload}
                  ></input>
                </label>
                {file && (<Button variant="text" onClick={submitImage}>Upload Image</Button>)}
                {(file || oldimage) && <Button variant="text" onClick={removeImage}>Remove Image</Button>}
              </div>
                { image && (<img className="h-24 rounded-xl" src={image || oldimage} alt="previewImage"></img>)}
                  </div> <div className="mr-4">
              {/* <div className="flex items-center"><img className="h-10 mr-4" src={live} alt="live"></img>
                <p className="font-roboto font-medium text-md text-gray-700 no-underline tracking-normal leading-none">
                  Live </p>
                </div><div className="flex items-center"><img className="h-10 mr-4" src={smile} alt="feeling"></img>
                <p className="font-roboto font-medium text-md text-gray-700 no-underline tracking-normal leading-none">
                  Feeling</p></div> */}
            </div>
          </div>}

        </div>
      );
}
export default NewPost;