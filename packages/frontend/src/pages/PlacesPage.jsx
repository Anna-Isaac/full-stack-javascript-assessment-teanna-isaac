import React, { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import AccountNav from "./AccountNav";
import axios from "axios";

// Component definition
export default function PlacesPage() {
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        axios.get('/places').then(({ data }) => {
            setPlaces(data);
        });
    }, []);

    // JSX structure for rendering the component
    return (
        <div>
            <AccountNav />
            <div className="text-center">
                <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add new advert
                </Link>
            </div>
            <div className="mt-4">
                {places.length > 0 && places.map(place => (
                    <div className="flex gap-4 bg-gray-100 p-2 rounded-2xl">
                        <div className="w-32 h-32 bg-gray-300">
                            {place.photos.length > 0 && (
                                <img sr={place.photos[0]} alt="" />
                            )}
                        </div>
                        <h2 className="text-l font-bold">
                        {place.title}
                        </h2>
                    </div>
                ))}
            </div>
        </div>
    );
}

