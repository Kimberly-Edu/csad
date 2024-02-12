import React, { useState, useContext, useEffect } from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// https://stackoverflow.com/questions/69062206/how-do-i-add-firebase-to-my-react-project
// https://www.youtube.com/watch?v=oL2jxLuBH9M

import { Input } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import { Typography } from "@material-tailwind/react";

const Reset = () => {
  const [email, setEmail] = useState("");
  const auth = firebase.auth();
  const resetPasswordFunction = () => {
    //   const email =""; 
      
      auth.sendPasswordResetEmail(email)
      .then(() => {
      console.log('Password Reset Email Sent Successfully!');
      })
      .catch(error => {
      console.error(error);
      })}

  return (
    <div className="grid grid-cols-1 justify-items-center">
      <div className="w-96">
        <Typography variant="h6" color="blue-gray" className="pb-4">
            Please enter your email. </Typography>
        <Input
          name="email"
          type="email"
          lable="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
        <Button variant="gradient" fullWidth className="mt-4"
        onClick={(e) => resetPasswordFunction()} >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Reset;
