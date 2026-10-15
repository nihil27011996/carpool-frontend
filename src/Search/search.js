import React, { useState, useRef, useEffect } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import PaymentComp from "../Payment/payment";
import GetClosestDriver from "./Components/GetClosestDriver.js";
import styles from "./Search.module.css";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import SearchDriverButton from "../Components/Common/SearchDriverButton.js";
import MapComponent from "../Components/Common/MapComponent.js";
import ModalComponent from "../Components/Common/modalcomponent.js";
import { riderRequest } from "../Utils/utils.js";
import { useDispatch } from "react-redux";
import { storeRider } from "../Slice/riderSlice.js";

const libraries = ["places"];
const RiderFinder = () => {
  /*   const storedData = localStorage.getItem('rider');
  const parsedData? = JSON.parse(storedData); */
  const parsedData = useSelector((state) => state.user.userData);
  const navigate = useNavigate();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [pickUpTime, setPickUpTime] = useState("");
  const [directions, setDirections] = useState(null);
  const [seats, setSeat] = useState("");
  const [diplayDrivers, setDisplayDrivers] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPayment, setshowPayment] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [costPerSeat, setCostPerSeat] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  if (!parsedData) {
    navigate("/login");
  }

  /*  useEffect(() => {
    async function fetchData() {
      const existingRecord = await riderRequest(
        parsedData?.id,
        parsedData?.token
      );
      if (!existingRecord.ok) {
        dispatch(storeRider({}));
        navigate("/login");
      }
      const existingRecordData = await existingRecord.json();
      if (!existingRecordData) {
        setShowButton(true);
        return;
      } else if (existingRecordData.length > 0) {
        const recordPayment = existingRecordData.filter(
          (record) =>
            record.CommuteStatus === "Approved" && record.PaymentFlag == "N"
        );
        if (recordPayment.length > 0) {
          setshowPayment(true);
          return;
        }
      } else if (
        existingRecordData.CommuteStatus === "Approved" &&
        existingRecordData.PaymentFlag === "N"
      ) {
        setshowPayment(true);
        return;
      }
    }

    fetchData();
  }, [showButton, showPayment, parsedData?.token, parsedData?.userId]); */

  const originRef = useRef();
  const destinationRef = useRef();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API,
    libraries: libraries,
  });

  if (!parsedData) return <Navigate to="/login" replace />;

  if (!isLoaded) {
    return (
      <div className="loading-spinner">
        <i className="fa fa-spinner fa-spin"></i>
        <span>Loading...</span>
      </div>
    );
  }

  const onPickUpTimeChange = (event) => {
    setPickUpTime(event.target.value);
  };

  const onSeatChange = (event) => {
    setSeat(event.target.value);
  };

  const directionsCallback = (result) => {
    if (result != null) {
      setDirections(result);
    }
  };

  const handleGeocodeLocation = async (location) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.REACT_APP_GOOGLE_API}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === "OK") {
        const { lat, lng } = data.results[0].geometry.location;
        const locationObject = { latProp: lat, lngProp: lng };
        //console.log(locationObject.latProp)
        return locationObject;
      } else {
        setErrorMessage("Error while requesting geocoding API");
      }
    } catch (error) {
      setErrorMessage("Error while requesting geocoding API");
    }
  };

  const searchForRide = async () => {
    setErrorMessage("");
    if (!originRef.current.value.trim() || !destinationRef.current.value.trim() || !Number.isInteger(Number(seats)) || Number(seats) <= 0 || !pickUpTime || !Number.isFinite(Date.parse(pickUpTime)) || Date.parse(pickUpTime) <= Date.now()) {
      setErrorMessage("Enter both locations, a future pickup time, and a positive whole number of seats.");
      return;
    }
    setDisplayDrivers(false);
    setIsOpen(false);
    const origincord = await handleGeocodeLocation(originRef.current.value);

    const destinationcord = await handleGeocodeLocation(
      destinationRef.current.value
    );
    if (!origincord || !destinationcord) return;
    if (
      originRef.current.value &&
      destinationRef.current.value &&
      pickUpTime &&
      seats
    ) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: originRef.current.value,
          destination: destinationRef.current.value,
          travelMode: "DRIVING",
        },
        directionsCallback
      );
      setOrigin(origincord);
      setDestination(destinationcord);
      setDisplayDrivers(true);
      setIsOpen(true);


    }
  };
  //console.log(showPayment == true)
  return (
    <>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.searchcontainerform}>
            {errorMessage && <p role="alert">{errorMessage}</p>}
            <form className={styles.searchloginform}>
              <Autocomplete className="">
                <input
                  id="origin"
                  type="text"
                  name="Origin"
                  ref={originRef}
                  className={styles.loginusername}
                  autoFocus={true}
                  required={true}
                  placeholder="From?"
                />
              </Autocomplete>

              <Autocomplete>
                <input
                  id="destination"
                  type="text"
                  name="Destination"
                  ref={destinationRef}
                  className={styles.loginusername}
                  autoFocus={true}
                  required={true}
                  placeholder="Where to?"
                />
              </Autocomplete>

              <input
                className={styles.loginusername}
                required={true}
                id="pickUpTime"
                type="datetime-local"
                value={pickUpTime}
                onChange={onPickUpTimeChange}
                placeholder="Time Please! "
              />

              <input
                id="seats"
                type="number"
                value={seats}
                onChange={onSeatChange}
                className={styles.loginusername}
                placeholder="Seats"
              />

              <SearchDriverButton searchForRide={searchForRide} />
            </form>
          </div>

          {diplayDrivers === true ? (
            <div className={styles.drivermodal}>
              {isOpen && (
                <ModalComponent toggleModal={toggleModal}>
                  <GetClosestDriver
                    startLat={origin.latProp}
                    startLon={origin.lngProp}
                    endLat={destination.latProp}
                    endLon={destination.lngProp}
                    seats={seats}
                    origin={originRef.current.value}
                    destination={destinationRef.current.value}
                    riderID={parsedData?.id}
                    token={parsedData.token}
                    PickUpTime={pickUpTime}
                  />
                </ModalComponent>
              )}
            </div>
          ) : null}
          <div className={styles.mapcontainer}>
            <MapComponent directions={directions} />

          </div>
        </div>
      </main>
    </>
  );
};

export default RiderFinder;
