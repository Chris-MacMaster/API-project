//src/components/SpotForm/CreateSpot.js
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from "react-redux"
import { makeSpot } from '../../store/spot';

import "./CreateSpot.css"

import { normalizeArr } from '../../store/spot';
import { actionResetReviews } from '../../store/review';


const SpotForm = ({ report, formType }) => {
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

    const [previewUrl, setPreviewUrl] = useState("")
    const [url1, setUrl1] = useState("")
    const [url2, setUrl2] = useState("")
    const [url3, setUrl3] = useState("")
    const [url4, setUrl4] = useState("")

    const [errors, setErrors] = useState([])
    const [errorsObj, setErrorsObj] = useState({})
    //tracking submission for error validation
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const [hasClicked, setHasClicked] = useState(false)


    useEffect(() => {
        let e = []
        setErrors(e)
        let eObj = {}
        setErrorsObj(eObj)

        if (!country){
            e.push("Please enter a country")
            eObj.country = "Please enter a country"
        }
        if (!address){
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

        if (!previewUrl) {
            eObj.previewURL = "Please enter at least a preview image url"
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
        // console.log("e", e)

        // let errorsObj = normalizeArr(e)
        

    }, [address, city, country, state, lat,lng, name, description, price, previewUrl, url1, url2, url3, url4])


    const handleSubmit = async (e) => {
        e.preventDefault();

        setHasSubmitted(true)
        if (errors.length > 0) {
            // window.alert("Cannot Submit, See Errors Listed")
            return
        }

        //trying to be careful about data types
        let latNum = parseInt(lat)
        let lngNum = parseInt(lng)
        let priceNum = parseInt(price)


        const newSpot = {
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
   
  
        
        const spotResponse = dispatch(makeSpot(newSpot, previewUrl))
        
        const spotData = await Promise.resolve(spotResponse)
        // console.log("SPOT DATA", spotData)
       
        if (spotData) {
            // console.log("SPOT RESPONSE DATA", spotData)
            reset()
            dispatch(actionResetReviews())
            history.push(`/spots/detail/${spotData.id}`)
        }
    };

    const handleClick = () => {
        setHasClicked(true)
    }

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
        setPreviewUrl('')
    };


    // const CreateTest = (e) => {
    //     e.preventDefault();

    //     dispatch(makeSpot("sse"))
    //     // history.push(`/spots`);
    // };

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
                        Create a New Spot
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
                        placeholder='Country'/>
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
                            placeholder='Address'/>
                    </label>
                    {hasSubmitted && errorsObj.address && (
                        <div className='error'>
                            * {errorsObj.address}
                        </div>
                    )}
                </div>


                <div className='city-state-div'>
                    <label>
                        City
                        <input className='city-input' type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)} 
                            placeholder='City'/>
                    {hasSubmitted && errorsObj.city && (
                        <div className='error'>
                            * {errorsObj.city}
                        </div>
                    )}
                    </label>

                    <label>
                        State
                        <input className='state-input' type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)} 
                            placeholder='State'/>
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
                        <input className='lat-input' type="number"
                            value={lat}
                            onChange={(e) => setLat(e.target.value)} 
                            placeholder='Latitude'/>
                        {hasSubmitted && errorsObj.lat && (
                            <div className='error'>
                                * {errorsObj.lat}
                            </div>
                        )}
                    </label>

                    <label>
                        Longitude
                        <input className='lng-input' type="number"
                            value={lng}
                            onChange={(e) => setLng(e.target.value)} 
                            placeholder='Longitude'/>
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
                    <p className='dollar'>
                        $
                    </p>

                    <input className='price-input' type="number"
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



                <div className='urls-label'>
                    <p>
                        Liven up your spot with photos
                    </p>
                    <p>
                        Submit a link to at least one photo to liven up your spot.
                    </p>
                </div>

                <div className='urls'>
                    {hasSubmitted && errorsObj.previewURL && (
                        <div className='error'>
                            * {errorsObj.previewURL}
                        </div>
                    )}
                    <input className='image-url' type="text" 
                    value={previewUrl}
                    onChange={(e) => {
                        setPreviewUrl(e.target.value)
                    }}
                        placeholder='Preview Image URL'
                    />
     

                    <input className='image-url' type="text"
                        value={url1}
                        onChange={(e) => {
                            setUrl1(e.target.value)
                        }}
                        placeholder='Image URL'
                    />

                    <input className='image-url' type="text"
                        value={url2}
                        onChange={(e) => {
                            setUrl2(e.target.value)
                        }}
                        placeholder='Image URL'
                    />

                    <input className='image-url' type="text"
                        value={url3}
                        onChange={(e) => {
                            setUrl3(e.target.value)
                        }}
                        placeholder='Image URL'
                    />

                    <input className='image-url url4' type="text"
                        value={url4}
                        onChange={(e) => {
                            setUrl4(e.target.value)
                        }}
                        placeholder='Image URL'
                    />
                </div>


                <input className='submit-button button modal-button form-create-button' type="submit" value="Create Spot" />
            </form>
        </div>
    );
}

export default SpotForm;