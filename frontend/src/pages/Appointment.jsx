import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/Appcontext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";
const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
    useContext(AppContext);

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const navigate = useNavigate();

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableSlots = async () => {
    setDocSlots([]); // Clear existing slots

    let today = new Date();

    for (let i = 0; i < 7; i++) {
      // Calculate the date for the current day in the loop
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // Set the end time for the day (9:00 PM)
      let endTime = new Date(currentDate.setHours(21, 0, 0, 0)); // End at 9:00 PM

      let timeSlots = [];

      if (i === 0) {
        // If it's today, calculate the next 30-minute interval
        let currentTime = new Date();
        currentDate.setHours(
          currentTime.getHours(),
          currentTime.getMinutes(),
          0,
          0
        );

        // Round to the next 30-minute mark
        if (currentDate.getMinutes() % 30 !== 0) {
          currentDate.setMinutes(Math.ceil(currentDate.getMinutes() / 30) * 30);
        }

        // Ensure there's at least a 30-minute buffer
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      } else {
        // For other days, start at 10:00 AM
        currentDate.setHours(10, 0, 0, 0);
      }

      while (currentDate <= endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = day + "_" + month + "_" + year;
        const slotTime = formattedTime;
        // check if this slot is available or not.....null na ho iske liye aise checks lgaye h bs && wale
        const isSlotAvailable =
          docInfo?.slots_booked &&
          docInfo?.slots_booked[slotDate] &&
          docInfo?.slots_booked[slotDate].includes(slotTime)
            ? false
            : true;
        // only display slots which are available in available slots
        if (isSlotAvailable) {
          timeSlots.push({
            dateTime: new Date(currentDate),
            time: formattedTime,
          });
        }

        // Increment by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      // Append time slots for the day
      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }
    try {
      const date = docSlots[slotIndex][0].dateTime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year;
      // console.log(slotDate);
      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  // useEffect(() => {
  //   console.log(docSlots);
  // }, [docSlots]);

  return (
    docInfo && (
      <div>
        {/*-------Doctor Details----- */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt=""
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            {/* -----Doc Info : name ,degree ,exp */}
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}{" "}
              <img src={assets.verified_icon} alt="" className="w-5" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree}-{docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>
            {/* -----Doctor About----- */}
            <div>
              <p className="flex items-center gap=1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>
            <p className="text-gray-500 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>
        {/* -------Booking slots------ */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking Slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.length > 0 &&
              docSlots.map((item, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  key={index}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-primary text-white"
                      : "border border-gray-200"
                  }`}
                >
                  <p>{item[0] && daysOfWeek[item[0].dateTime.getDay()]}</p>
                  <p>{item[0] && item[0].dateTime.getDate()}</p>
                </div>
              ))}
          </div>
          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlots.length &&
              docSlots[slotIndex].map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  key={index}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-primary text-white"
                      : "text-gray-400 border border-gray-300"
                  }`}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>
          <button
            onClick={bookAppointment}
            className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6"
          >
            Book an appointment
          </button>
        </div>
        {/* Listing Related Doctors */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
