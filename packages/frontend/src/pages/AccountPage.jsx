import React, { useContext, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
import PlacesPage from "./PlacesPage";
import AccountNav from "./AccountNav";

export default function ProfilePage() {
    const [redirect, setRedirect] = useState(false);
    const { ready, user } = useContext(UserContext);
    let { subpage } = useParams();
    if (subpage === undefined) {
        subpage = 'profile';
    }

    async function logout() {
        await axios.post('/logout');
        setRedirect('/');
    }

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div>
            <AccountNav />
            {subpage === 'profile' && (
                <>
                    <div className="text-center max-w-lg mx-auto">
                        <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
                    </div>
                </>
            )}
            {subpage === 'places' && (
                <PlacesPage />
            )}
        </div>
    );
}
