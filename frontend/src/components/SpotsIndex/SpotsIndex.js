import { useSelector, useDispatch } from "react-redux";
// import { Link } from "react-router-dom"

import SpotIndexItem from "./SpotIndexItem";
import { useEffect } from "react";
import { fetchSpots } from "../../store/spot";
import { actionResetReviews } from "../../store/review";


import "./SpotIndex.css"




function SpotsIndex() {
    const dispatch = useDispatch()

    const spotState = useSelector(state => state.spots.allSpots)

    const spots = Object.values(spotState)
    useEffect(() => {
        dispatch(fetchSpots())
        dispatch(actionResetReviews())
    }, [dispatch])

    return (

        //jsx uses camel case class names
        <div className="spots-index">
            <h2>
                {/* Spots Index */}
            </h2>

            <div className="spotIndex">
            {spots.map(spot => (
                <SpotIndexItem title={spot.name} spot={spot} key={spot.id} />
            ))}

            </div>
        </div>
        //also note the list, we map over our data passed in from prop,
        //at each obj, we render link to the url with that obj id along with its name
    )
}

export default SpotsIndex;




//store = { session: {}, spots: { allSpots: { [spotId]: { spotData, }, optionalOrderedList: [], }, singleSpot: { spotData, SpotImages: [imagesData], Owner: { ownerData, }, }, }, reviews: { spot: { [reviewId]: { reviewData, User: { userData, }, ReviewImages: [imagesData], }, optionalOrderedList: [], }, user: { [reviewId]: { reviewData, User: { userData, }, Spot: { spotData, }, ReviewImages: [imagesData], }, optionalOrderedList: [], }, }, bookings: { user: { [bookingId]: { bookingData, Spot: { spotData, }, }, optionalOrderedList: [], }, spot: { [bookingId]: { bookingData, }, optionalOrderedList: [], }, }, };

