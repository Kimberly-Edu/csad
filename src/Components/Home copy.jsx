
import {useState, useRef, useContext, useReducer, useEffect} from "react"; 
import { collection, doc, setDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { auth, db, onAuthStateChanged } from "../firebase/firebase";
import { AuthContext } from "../AppContext/AppContext";
import {PostsReducer,postActions,postsStates,} from "../AppContext/PostReducer";// ???
import { Alert } from "@material-tailwind/react";
import PostCard from "./PostCard";
import NewPost from "./NewPost";
import FriendList from "./FriendList";

const Home = () => {
    // https://firebase.google.com/docs/auth/admin/manage-users
    onAuthStateChanged(auth, (user) => { // sign out if not allowed
        if (user) { // User is signed in
          const uid = user.uid;
        } else { // User is signed out
            // navigate("/login")
        }});
        // ignore this

    const { user, userData } = useContext(AuthContext);
    const scrollRef = useRef("");
    const [image, setImage] = useState(null);

    const collectionRef = collection(db, "posts");
    const postRef = doc(collection(db, "posts"));
    const document = postRef.id;
    const [state, dispatch] = useReducer(PostsReducer, postsStates);
    
    const [file, setFile] = useState(null);
    const { SUBMIT_POST, HANDLE_ERROR } = postActions;
      
    const [progressBar, setProgressBar] = useState(0);
    useEffect(() => {
        const postData = async () => {
        const q = query(collectionRef, orderBy("timestamp", "asc"));
        await onSnapshot(q, (doc) => {
            dispatch({
            type: SUBMIT_POST,
            posts: doc?.docs?.map((item) => item?.data()),
            });
            scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
            setImage(null);
            setFile(null);
            setProgressBar(0);
        });
        };
        return () => postData();
    }, [SUBMIT_POST]);


        // e.preventDefault(); //avoid refresh of form
        // https://stackoverflow.com/questions/932653/how-to-prevent-buttons-from-submitting-forms

    const [editPostId, setPostId] = useState("--no-post-id--");
    const [nowPostId, setNow] = useState("--no-post-id--");
    const [newPostId, setNew] = useState(false);
    function getPostId(editPostId) {
      setPostId(editPostId);
      if (editPostId != nowPostId){ setNew(true); 
        setNow(editPostId);
        // alert("New "+ editPostId +"\n"+ nowPostId);
      }else { setNew(false);
        // alert("Old "+ editPostId +"\n"+ nowPostId);
    }}
    // https://www.youtube.com/watch?v=-6f-up2NAEY
    // https://stackoverflow.com/questions/38394015/how-to-pass-data-from-child-component-to-its-parent-in-reactjs

    return (
        <div className="flex flex-col items-center">
          <div>
          <FriendList></FriendList>

          </div>
          {/* {editPostId} */}
         
            <NewPost 
              editPostId={editPostId}
              newPostId={newPostId}
            ></NewPost>
          <div className="flex flex-col py-4 w-full">
            
            {state?.error ? (
              <div className="flex justify-center items-center">
                <Alert color="red">
                  Something went wrong refresh and try again...
                </Alert>
              </div>
            ) : (
              <div>
                <h1>Posts: {state?.posts?.length}</h1>
                {state?.posts?.length > 0 &&
                  state?.posts?.map((post, index) => {
                    // if (post?.desc !== undefined){ alert(post?.desc);}
                    return (
                      <PostCard
                        key={index}
                        logo={post?.logo}
                        id={post?.documentId}
                        uid={post?.uid}
                        name={post?.name}
                        email={post?.email}
                        image={post?.image}
                        text={post?.text}
                        desc={post?.desc}
                        timestamp={new Date(
                          post?.timestamp?.toDate()
                        )?.toUTCString()}

                        getPostId={getPostId}
                      ></PostCard>
                    );
                  })}
              </div>
            )}
          </div>
          <div ref={scrollRef}>{/* refference for later */}</div>
        </div>
      );
}

export default Home;