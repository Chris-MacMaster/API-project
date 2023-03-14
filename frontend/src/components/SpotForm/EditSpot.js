//src/components/SpotForm/CreateSpot.js
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from "react-redux"
import { editSpot, makeSpot } from '../../store/spot';
import { fetchOneSpot } from '../../store/spot';

import "./CreateSpot.css"
import "./EditSpot.css"
import { actionResetReviews } from '../../store/review';


const EditSpotForm = ({ report, formType }) => {
    const history = useHistory();
    const dispatch = useDispatch()


    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [country, setCountry] = useState("")
    const [state, setState] = useState("")
    //lat and lng optional?
    const [lat, setLat] = useState("")
    const [lng, setLng] = useState("")

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")

    const [errors, setErrors] = useState([])
    const [errorsObj, setErrorsObj] = useState({})
    const [hasSubmitted, setHasSubmitted] = useState(false);



    const urlArr = window.location.href.split("/")
    const spotId = urlArr[urlArr.length - 1]


    useEffect(() => {
        let e = []
        setErrors(e)
        let eObj = {}
        setErrorsObj(eObj)
        

        if (!country) {
            e.push("Please enter a country")
            eObj.country = "Please enter a country"
        }
        if (!address) {
            e.push("Please enter an address")
            eObj.address = "Please enter an address"
        }
        if (!city) {
            e.push("Please enter a city")
            eObj.city = "Please enter a city"
        }
        if (!state) {
            e.push("Please enter a state")
            eObj.state = "Please enter a state"
        }
        if (!lat) {
            e.push("Please enter a latitude value")
            eObj.lat = "Please enter a latitude value"
        }
        if (!lng) {
            e.push("Please enter a longitude value")
            eObj.lng = "Please enter a longitude value"
        }
        if (!description) {
            e.push("Please enter a description")
            eObj.description = "Please enter a description"
        }
        if (description.length < 30) {
            e.push("Description needs 30 or more characters")
            eObj.descriptionLength = "Description needs 30 or more characters"
        }
        if (!name) {
            e.push("Please enter a title")
            eObj.name = "Please enter a title"
        }
        if (!price) {
            e.push("Please enter a price")
            eObj.price = "Please enter a price"
        }


        // if (!country) e.push("Please enter a country")
        // if (!address) e.push("Please enter an address")
        // if (!city) e.push("Please enter a city")
        // if (!state) e.push("Please enter a state")
        // if (!lat) e.push("Please enter a latitude value")
        // if (!lng) e.push("Please enter a longitude value")
        // if (!description) e.push("Please enter a description")
        // if (!name) e.push("Please enter a title")
        // if (!price) e.push("Please enter a price")

        //FOR TESTING
        console.log("e", e)

    }, [address, city, country, state, lat, lng, name, description, price])


    //get spot ID
    useEffect(() => {
        const fillFeilds = async () => {
            let spotInfo = await dispatch(fetchOneSpot(spotId));

            console.log(spotInfo)
            setCountry(spotInfo.country)
            setAddress(spotInfo.address)
            setCity(spotInfo.city)
            setState(spotInfo.state)
            
            setLat(spotInfo.lat)
            setLng(spotInfo.lng)

            setName(spotInfo.name)
            setDescription(spotInfo.description)
            setPrice(spotInfo.price)

            // setCountry(spotInfo.country)
            // setTitle(spotInfo.name)
        }
        fillFeilds()
    }, [dispatch]);


    const handleSubmit = (e) => {
        e.preventDefault();

        setHasSubmitted(true)
        if (errors.length > 0) {
            window.alert("Cannot Submit, See Errors Listed")
            return
        }

        //trying to be careful about data types
        let latNum = parseInt(lat)
        let lngNum = parseInt(lng)
        let priceNum = parseInt(price)



        // const id = window


        const editedSpot = {
            spotId,
            address,
            city,
            country,
            state,
            lat: latNum,
            lng: lngNum,
            name,
            description,
            price: priceNum
        }
        console.log("FORM DATA", editedSpot)

        const editSpotResponse = dispatch(editSpot(editedSpot))
        // could test, maybe needs to be async
        // const editSpotData = await Promise.resolve(editSpotResponse)
        
        if (editSpotResponse) {
            console.log("EDIT SPOT RESPONSE", editSpotResponse)
            dispatch(actionResetReviews())
            history.push(`/spots/detail/${spotId}`)

        }

       
    };

    const reset = () => {
        setAddress('');
        setCity('');
        setCountry('');
        setState('');
        setLat('');
        setLng('');
        setName('');
        setDescription('');
        setPrice('');
    };


    const EditTest = (e) => {
        e.preventDefault();
        // console.log(spotId)

        dispatch(editSpot({
            spotId
        }))
        history.push(`/spots`);
    };

    return (
        <div>
            {/* {hasSubmitted && errors.length > 0 && (
                <div>
                    The following errors were found:
                    <ul>
                        {errors.map(error => (
                            <li key={error}>{error}</li>
                        ))}
                    </ul>
                </div>
            )} */}
            <form onSubmit={handleSubmit} >
                <h2>{formType}</h2>
                <div className='edit-intro-div'>
                    <p id='update-your-spot'>
                        Update your Spot
                    </p>
                    <p id='where-place'>
                        Where's your place located?
                    </p>
                    <p id='only-booked'>
                        Guests will only get your exact address once they booked a reservation.
                    </p>
                </div>
                <div className='country-address-div'>
                    <label className='country-label' >
                        Country
                        <input className='country-input' type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder='Country' />
                    </label>
                    {hasSubmitted && errorsObj.country && (
                        <div className='error'>
                            * {errorsObj.country}
                        </div>
                    )}

                    <label className='address-label'>
                        Street Address
                        <input className='address-input' type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder='Address' />
                    </label>
                    {hasSubmitted && errorsObj.address && (
                        <div className='error'>
                            * {errorsObj.address}
                        </div>
                    )}
                </div>


                <div className='city-state-div'>
                    <label id='city-input-label'>
                        City
                        <input className='city-input' type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder='City' />
                        {hasSubmitted && errorsObj.city && (
                            <div className='error'>
                                * {errorsObj.city}
                            </div>
                        )}
                    </label>

                    <p className='comma'>
                        ,
                    </p>

                    <label id="state-input-label">
                        State
                        <input className='state-input' type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder='State' />
                        {hasSubmitted && errorsObj.state && (
                            <div className='error'>
                                * {errorsObj.state}
                            </div>
                        )}
                    </label>

                </div>


                <div className='lat-lng-div'>
                    <label>
                        Latitude
                        <input className='lat-input' type="text"
                            value={lat}
                            onChange={(e) => setLat(e.target.value)}
                            placeholder='Latitude' />
                        {hasSubmitted && errorsObj.lat && (
                            <div className='error'>
                                * {errorsObj.lat}
                            </div>
                        )}
                    </label>

                    <p className='comma'>
                        ,
                    </p>



                    <label>
                        Longitude
                        <input className='lng-input' type="text"
                            value={lng}
                            onChange={(e) => setLng(e.target.value)}
                            placeholder='Longitude' />
                        {hasSubmitted && errorsObj.lng && (
                            <div className='error'>
                                * {errorsObj.lng}
                            </div>
                        )}
                    </label>

                </div>

                <div className='description-label'>
                    <p id='describe-to-guests'>
                        Describe your place to guests
                    </p>
                    <p className='desc-text mention-text'>
                        Mention the best features of your space, any special amenities like
                        fast wifi or parking, and what you love about the neighborhood.
                    </p>
                </div>


                <textarea className='description-textarea'
                    placeholder='Please write at least 30 characters'
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value)
                    }}>

                </textarea>

                {hasSubmitted && errorsObj.description && (
                    <div className='error'>
                        * {errorsObj.description}
                    </div>
                )}

                {hasSubmitted && errorsObj.descriptionLength && (
                    <div className='error'>
                        * {errorsObj.descriptionLength}
                    </div>
                )}

                <div className='title-label'>
                    <p >
                        Create a title for your spot
                    </p>
                    <p className='desc-text'>
                        Catch guests' attention with a spot title that
                        highlights what makes your place special.
                    </p>
                </div>


                <input className='name-input' type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Name of your spot' />

                {hasSubmitted && errorsObj.name && (
                    <div className='error'>
                        * {errorsObj.name}
                    </div>
                )}


                <div className='price-label'>
                    <p className='set-base-price'>
                        Set a base price for your spot
                    </p>
                    <p className='desc-text comp-pricing'>
                        Competitive pricing can help your listing stand out and rank
                        higher in search results.
                    </p>
                </div>


                <div className='price-div'>
                    <p className='dollar comma'>
                        $
                    </p>

                    <input className='price-input' type="text"
                        value={price}
                        onChange={(e) => {
                            setPrice(e.target.value)
                        }}
                        placeholder='Price per night (USD)' />

                        


                </div>
                <div id='price-error-div'>
                    {hasSubmitted && errorsObj.price && (
                        <div className='error'>
                            * {errorsObj.price}
                        </div>
                    )}
                </div>

                <input className='submit-button modal-button button edit-button' type="submit" value="Update your Spot" />
            </form>

        </div>
    );
}

export default EditSpotForm;