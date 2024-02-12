import React from "react";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";


const SignOutBtn = () => {
    const styleLink = { color:"white", backgroundColor: "#f1356d", borderRadius: '8px', padding:'5px', fontSize:'16px', borderColor:'pink', borderWidth:'3px'};
    const signOutUser = async () => {
        console.log("Signing out...");
        await signOut(auth);
        };

    return (
        <button onClick={(e) => signOutUser()} style={styleLink}>Sign Out</button>
        );

};

export default SignOutBtn;
