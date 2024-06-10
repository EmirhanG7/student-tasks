import { Link } from "react-router-dom";
import { supabase } from "../../supabase";

export default function Header({ currentUser }) {

    const signOut = async () => {
        let { error } = await supabase.auth.signOut();
        console.log(error);
    };

    return (
        <header className="header">
            <Link to="/home"><img src="public/img/ama-logo.png" alt="AMA Logo" className="logo" /></Link>
            {currentUser && (
                <div className="status">
                    <p>Hoşgeldin <span>{currentUser?.name}</span></p>
                    <Link to={'/'} onClick={signOut} className="logout-link">Çıkış yap</Link>
                </div>
            )}
        </header>
    );
}
