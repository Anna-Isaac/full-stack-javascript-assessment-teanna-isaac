import Speciality from "../Specialitiy";
import { useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import AccountNav from "./AccountNav";

export default function PlacesFormPage() {
    // State variables
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [photoLink, setPhotoLink] = useState('');
    const [description, setDescription] = useState('');
    const [speciality, setSpeciality] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [opening, setOpening] = useState('');
    const [closing, setClosing] = useState('');
    const [price, setPrice] = useState(100);
    const [redirect, setRedirect] = useState(false);


    // Helper functions for rendering input elements
    function inputHeader(text) {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }

    function inputDescription(text) {
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        );
    }

    function preInput(header, description) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        );
    }

    // Async function to add a photo by link
    async function addPhotoByLink(ev) {
        ev.preventDefault();
        try {
            // Make a POST request to the server to upload a photo by link
            const { data: filename } = await axios.post('http://localhost:3000/upload-by-link', { link: photoLink });
            // Update the state with the new filename
            setAddedPhotos(prev => [...prev, filename]);
            // Clear the photoLink state
            setPhotoLink('');
        } catch (error) {
            console.error('Error uploading photo by link:', error);
            // Handle error if necessary
        }
    }


    // Function to upload photos from the user's device
    function uploadPhoto(ev) {
        const files = ev.target.files;
        const data = new FormData();
        // Append each selected file to the FormData object
        for (let i = 0; i < files.length; i++) {
            data.append('photos', files[i]);
        }
        // Make a POST request to the server to upload photos
        axios.post('/upload', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(response => {
            // Update the state with the new filenames
            const { data: filenames } = response;
            setAddedPhotos(prev => [...prev, ...filenames]);
        });
    }

    async function addNewPlace(ev) {
        ev.preventDefault();
        await axios.post('/places', {
            title,
            address,
            addedPhotos,
            photoLink,
            description,
            speciality,
            extraInfo,
            opening,
            closing,
        });
        setRedirect(true);
    }

    if (redirect) {
        return <Navigate to={'/account/places'} />
    }

        return (
            <div>
                <AccountNav />
                {/* Form for submitting place details */}
                <form onSubmit={addNewPlace}>
                    {/* Input fields for title, address, and photos */}
                    {preInput('Title', 'Title. Briefly tell me about yourself. Should be short and catchy')}
                    <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="Introduction, Hi I’m Maria and I have been studying psychology for over 10 years" />
                    {preInput('Address', 'Address to your office')}
                    <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="Description to your place" />
                    {preInput('Photos', 'more = better')}
                    <div className="flex gap-2">
                        <input value={photoLink} onChange={ev => setPhotoLink(ev.target.value)} type="text" placeholder={'Add using a link.....jpg'} />
                        <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">Add&nbsp;photo</button>
                    </div>
                    <div className="mt-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {/* Display added photos */}
                        {addedPhotos.length > 0 && addedPhotos.map(filename => (
                            <div className="h-32 flex" key={filename}>
                                <img className="rounded-2xl w-full object-cover" src={`http://localhost:3000/uploads/${filename}`} alt="" />
                            </div>
                        ))}
                        {/* Input field for uploading photos from the device */}
                        <label className="h-32 cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
                            <input type="file" multiple className="hidden" onChange={uploadPhoto} />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                            </svg>
                            Upload
                        </label>
                    </div>
                    {/* Input field for description */}
                    {preInput('Description', 'More information about you')}
                    <textarea value={description} onChange={ev => setDescription(ev.target.value)} />
                    {/* Input field for selecting specialties */}
                    {preInput('Speciality', 'Select all the specialities')}
                    <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                        <Speciality selected={speciality} onChange={setSpeciality} />
                    </div>
                    {/* Input field for extra information */}
                    {preInput('Extra info', 'Education, etc')}
                    <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />
                    {/* Input fields for opening and closing times */}
                    {preInput('Opening and closing times', 'Remember to have some time window between each appointment')}
                    <div className="grid gap-2 grid-cols-2 md:grid-cols-2">
                        <div>
                            <h3 className="mt-2 -mb-1">Opening time</h3>
                            <input type="text" value={opening} onChange={ev => setOpening(ev.target.value)} placeholder="09:00" />
                        </div>
                        <div>
                            <h3 className="mt-2 -mb-1">Closing time</h3>
                            <input type="text" value={closing} onChange={ev => setClosing(ev.target.value)} placeholder="18:00" />
                        </div>
                    </div>
                    {/* Submit button */}
                    <button className="primary my-4">Save</button>
                </form>
            </div>
        );
    }