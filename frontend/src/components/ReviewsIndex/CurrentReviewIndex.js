import { useSelector, useDispatch } from "react-redux";
// import { Link } from "react-router-dom"

// import SpotIndexItem from "./SpotIndexItem";
import { useEffect } from "react";
// import { fetchSpots } from "../../store/spot";
// import { actionResetReviews } from "../../store/review";
import ReviewIndexItem from "./ReviewIndexItem"

import { fetchUserReviews, loadUserReviews } from "../../store/review";


// import "./SpotIndex.css"




function CurrentReviewIndex() {
    const dispatch = useDispatch()

    
    const reviewState = useSelector (state => state.reviews.user)
    // console.log("REVIEW STATE", reviewState)
    const reviews = Object.values(reviewState)

    // const spots = Object.values(spotState)
    useEffect(() => {
        console.log("USE EFFECT TRIGGERED TRIGGERED")
        dispatch(fetchUserReviews())
        
    }, [dispatch])

    if (!reviews.length) return null

    return (

        //jsx uses camel case class names
        <div className="spots-index">
            <h2>
                Manage Reviews
            </h2>

            <div className="spotIndex">
                {reviews.map(review => (
                    <ReviewIndexItem otherButton={true} review={review} spotId={review.spotId} key={review.id} />
                ))}

            </div>
        </div>
        //also note the list, we map over our data passed in from prop,
        //at each obj, we render link to the url with that obj id along with its name
    )
}

export default CurrentReviewIndex;




//store = { session: {}, spots: { allSpots: { [spotId]: { spotData, }, optionalOrderedList: [], }, singleSpot: { spotData, SpotImages: [imagesData], Owner: { ownerData, }, }, }, reviews: { spot: { [reviewId]: { reviewData, User: { userData, }, ReviewImages: [imagesData], }, optionalOrderedList: [], }, user: { [reviewId]: { reviewData, User: { userData, }, Spot: { spotData, }, ReviewImages: [imagesData], }, optionalOrderedList: [], }, }, bookings: { user: { [bookingId]: { bookingData, Spot: { spotData, }, }, optionalOrderedList: [], }, spot: { [bookingId]: { bookingData, }, optionalOrderedList: [], }, }, };

