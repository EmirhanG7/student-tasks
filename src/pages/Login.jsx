import React, { useState } from "react";
import "/src/App.css";
import { supabase } from "../supabase.js";
import { useNavigate } from "react-router-dom";


export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [department, setDepartment] = useState('') // department state variable
    const navigate = useNavigate()

    console.log(email, password, name, department)

    const handleSignIn = async (e) => {
        e.preventDefault();
    
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        
        if (error) {
            console.log(error.message)
        } else {
            console.log('giriş yapıldı')
            setEmail('')
            setPassword('')
            console.log(data)
            navigate('/home')
        }
    }


    const handleSignUp = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            user_metadata: {
                full_name: name,
            }
        })
        if (error) {
            console.log(error.message)
        } else {
            console.log(data)
            setEmail('')
            setPassword('')
            setName('')

            const { user } = data;
            const { error: insertError } = await supabase.from('tasks').insert([

                {
                    id: user.id,
                    name,
                    department,
                },
            ]);
            if (insertError) {
                console.error(insertError)
            }   else {
                console.log('User registered successfully!')
                alert(`Kullanıcı Bilgileri:
                İsim: ${name}
                Şifre: ${password}
                Departman: ${department}`);
            }




        }
    }

    // const handleSignUp = async () => {
    //     const { data, error } = await supabase.auth.signUp({
    //         email,
    //         password,
    //     });
    //
    //     if (error) {
    //         console.log(error.message);
    //     } else {
    //         console.log(data);
    //     //     const { user } = data;
    //     //
    //     //     const { error: insertError } = await supabase.from('tasks').insert([
    //     //         {
    //     //             id: user.id,
    //     //             name,
    //     //             email,
    //     //             password,
    //     //             department,
    //     //         },
    //     //     ]);
    //     //
    //     //     if (insertError) {
    //     //         console.error(insertError);
    //     //     } else {
    //     //         console.log('User registered successfully!');
    //     //         // Bilgileri ekrana yazdırma
    //     //         alert(`Kullanıcı Bilgileri:
    //     // İsim: ${name}
    //     // Email: ${email}
    //     // Şifre: ${password}
    //     // Departman: ${department}`);
    //     //     }
    //     }
    // };


    return (
        <div className="containerLogin">
            <div className="loginContainer" id="container">
                <div className="form-container sign-up-container">
                    <form onSubmit={handleSignUp}>
                        <h1>Hesap Oluştur</h1>
                        <input required type="text" autoComplete="off" placeholder="Ad&Soyad " name="name" value={name}
                               onChange={(e) => setName(e.target.value)}/>
                        <input required type="email" autoComplete="off" placeholder="E-posta" name="email" value={email}
                               onChange={(e) => setEmail(e.target.value)}/>
                        <input required type="password" autoComplete="off" placeholder="Şifre" name="password"
                               value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <select required name="role" value={department} onChange={(e) => setDepartment(e.target.value)}>
                            <option value="">Bölüm Seçiniz</option>
                            <option value="frontend">Front-End</option>
                            <option value="backend">Back-End</option>
                        </select>

                        <button type="submit">Kayıt Ol</button>
                    </form>
                </div>
                <div className="form-container sign-in-container">
                    <form onSubmit={handleSignIn}>
                        <h1>Giriş Yap</h1>
                        <input type="email" placeholder="E-posta" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="Şifre" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        {/* <a href="#">Şifremi Unuttum ?</a> */}
                        <button type="submit">Giriş Yap</button>
                    </form>
                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Hoşgeldin</h1>
                            <p>Öğrenci paneline erişebilmek için giriş yapınız.</p>
                            <button className="ghost" id="signIn"
                                onClick={() => {
                                    document.getElementById('container').classList.remove('right-panel-active');
                                }}
                            >Giriş Yap</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hoşgeldin</h1>
                            <p>Kişisel bilgileriniz ile kayıt olun ve öğrenci paneline erişmek için kayıt olunuz.</p>
                            <button className="ghost" id="signUp"
                                onClick={() => {
                                    document.getElementById('container').classList.add('right-panel-active');
                                }}
                            >Kayıt Ol</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}