import React, { useState } from 'react';
import { supabase } from './supabase';


export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')



  const handleSignIn = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })

   console.log(data)
  }

  return (
    <form onClick={handleSignIn} >
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Sign In</button>
    </form>
  );
}
  


