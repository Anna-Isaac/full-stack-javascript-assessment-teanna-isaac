import {useContext, useEffect, useState} from "react";
import {differenceInCalendarDays} from "date-fns";
import axios from "axios";
import {Navigate} from "react-router-dom";
import {UserContext} from "./UserContext.jsx";

export default function BookingWidget({place}) {
  const [opening,setOpening] = useState('');
  const [closing,setClosing] = useState('');
  const [name,setName] = useState('');
  const [phone,setPhone] = useState('');
  const [redirect,setRedirect] = useState('');
  const {user} = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfAppointments= 0;
  if (opening && closing) {
    numberOfAppointments = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }

  async function bookThisTherapist() {
    const response = await axios.post('/bookings', {
      opening,closing,numberOfAppointments,name,phone,
      place:place._id,
      price:numberOfAppointments * place.price,
    });
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />
  }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: ${place.price} / per session
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>opening:</label>
            <input type="date"
                   value={opening}
                   onChange={ev => setOpening(ev.target.value)}/>
          </div>
          <div className="py-3 px-4 border-l">
            <label>closing:</label>
            <input type="date" value={closing}
                   onChange={ev => setClosing(ev.target.value)}/>
          </div>
        </div>
        {numberOfAppointments > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Your full name:</label>
            <input type="text"
                   value={name}
                   onChange={ev => setName(ev.target.value)}/>
            <label>Phone number:</label>
            <input type="tel"
                   value={phone}
                   onChange={ev => setPhone(ev.target.value)}/>
          </div>
        )}
      </div>
      <button onClick={bookThisPlace} className="primary mt-4">
        Book this therapist
        {numberOfAppointments > 0 && (
          <span> ${numberOfTherapist * place.price}</span>
        )}
      </button>
    </div>
  );
}