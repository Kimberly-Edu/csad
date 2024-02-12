import React, { useState, useContext, useEffect } from "react";
import waterslide from "../assets/images/waterslide.jpg";
import { AuthContext } from "../AppContext/AppContext";
import { Link } from "react-router-dom";
import { Avatar } from "@material-tailwind/react";
import avatar from "../assets/images/avatar.jpg";
import remove from "../assets/images/delete.png";
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  arrayRemove,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const FriendList = () => {
    const [input, setInput] = useState("");
    const { user, userData } = useContext(AuthContext);
    const friendList = userData?.friends;

    const [trigger, setTrigger] = useState(false);
    // alert(JSON.stringify(friendList));
    // alert(friendList?.length);
    // Updated searchFriends function
      
    const [jsonValue, setThisStinks] = useState({});
    const searchFriends = async (data, e) => {
        const usersRef = collection(db, "users");
        try { if (data === undefined){return;} // misery
        //  alert("Data:"+ JSON.stringify(data));
        // alert(data.filter());

        // // const q = query
        // console.log("RESULT: "+("UFUF").toLowerCase().includes("UF"));
        //   if (likesDocId !== undefined) {
        //     const deleteId = doc(db, "posts", id, "likes", likesDocId);
        //     await deleteDoc(deleteId);
        //   } else {
        //     await setDoc(likesRef, {
        //       id: user?.uid,
        //     });
        //   }
        // data?.map((item, index) => {
        //     alert("item: "+ item.id);
        // console.log(data);
        var empty = {};
        // console.log("Newdata", newData);
        for(var k in data){
            // console.log(k, data)
            // const q = query(likesCollection, where("id", "==", user?.uid));
            // alert('Data'+data[k].id);
            // alert(JSON.stringify(data));
            const q = query(usersRef, where("uid", "==", data[k].id));
            // console.log('Ko'+k);
            var d = 0;
            var value_now = empty;
            await onSnapshot(q, (doc) => {
              var newData = {"email": "", "name": "", "id":data[0].id, "image":""};
            
              // setNum(k);
                // alert(JSON.stringify(doc?.docs[0]?.data()));
                // alert(JSON.stringify(doc?.docs[0]?.data().id));
                // alert(JSON.stringify(data));
                
                newData["email"] = doc?.docs[0]?.data().email;
                newData["name"] = doc?.docs[0]?.data().name;
                
                newData["id"] = doc?.docs[0]?.data().uid;
                newData["image"] = doc?.docs[0]?.data().image;
                
                // alert("Newdata "+JSON.stringify(newData));
                // jsonValue[k] = {newData};
                // setThisStinks2({[d]:newData});
                // console.log('Bef: '+JSON.stringify(value_now));
                // var now = {...jsonValue,...{[d]:newData}};
                // console.log("Put:", d, JSON.stringify(now));
                
                value_now[d] = newData;
                d+=1;  
                // console.log('Aft: '+JSON.stringify(value_now));
                // console.log("Done");
                setThisStinks(value_now);
                console.log("Done!");
                setTrigger(true); //ONLY ONCE BECAUSE I GIVE UP
                // console.log("Final Result"+ JSON.stringify(jsonValue));
              }
              );
              // this runs after so IT DOES NOT SEE IT          
        }
        } catch (err) {
          alert(err.message);
          console.log(err.message);
        }
        return jsonValue
      };
 
    const removeFriend = async (id) => {
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const getDoc = await getDocs(q);
        const userDocumentId = getDoc.docs[0].id;

        await updateDoc(doc(db, "users", userDocumentId), {
            friends: arrayRemove({ id: id}),
        });
    };
    
    useEffect(() => {
      // console.log("HELLO", user);
       
      setTimeout(() =>{
        // searchFriends(friendList); //alert("C:"+friendList.length);
        searchFriends(friendList);
        
        }, 1000);
        //why is it only wprking when i refresh
        return () =>  {} 
      }, [friendList, user, trigger]);

    
    return (<div className="mx-2 mt-10 items-center pb-40">
        <p className="font-roboto font-medium text-sm text-gray-700 no-underline tracking-normal leading-none">
          Friends:{" "} ...
        </p>
        <input
          className="border-0 outline-none mt-4"
          name="input"
          value={input}
          type="text"
          placeholder="Search friends"
          onChange={(e) => setInput(e.target.value)}
        ></input>
        -----
        
        {(friendList?.length > 0) ? (<div>You have {friendList?.length} friend(s).
        </div>
        ):(<div>Add your friends!</div>)}
        {(friendList?.length > 0) ? (
            <div className="flex flex-col justify-between hover:bg-gray-100 duration-300 ease-in-out" key={jsonValue.id} >
            {/* {JSON.stringify(jsonValue)} */}
            {Object.keys(jsonValue).map(key => {
                return (
                    <div className="flex items-center justify-between hover:bg-gray-100 duration-300 ease-in-out" key={jsonValue[key].id} >
                             <Link to={"/profile/"+jsonValue[key].id}>
                    <div className="flex items-center my-2 cursor-pointer">
                    <Avatar size="sm" variant="circular" src={jsonValue[key]?.image || avatar} alt="avatar"></Avatar>
                    <p className="ml-4 font-roboto font-medium text-sm text-gray-700 no-underline tracking-normal leading-none">
                    {jsonValue[key]["name"]} [{jsonValue[key]["email"]}]
                  
                    </p></div> </Link>
                    <div className="mr-4"> <img
                        onClick={() => removeFriend(jsonValue[key].id) }
                        className="cursor-pointer" src={remove} alt="deleteFriend"></img>
                    </div>
                    
                    </div>

                    )
            })}
                  </div>
        ) : (
          <p className="mt-10 font-roboto font-medium text-sm text-gray-700 no-underline tracking-normal leading-none">
            Add friends to check their profile
          </p>
        )}
        ----------
      </div>
  );
};

export default FriendList;
