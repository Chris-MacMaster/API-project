import { csrfFetch } from "./csrf"
import { fetchOneSpot, loadOneSpot } from "./spot"



const LOAD_REVIEWS = "reviews/LOAD"
const USER_REVIEWS = "reviews/user"
const RESET_REVIEWS = "reviews/RESET"
const ONE_REVIEW = "reviews/LOAD/ONE"

// const LOAD_SPOT = "spots/LOAD/ONE"
// const DELETE_SPOT = "spots/DELETE"
// //**ACTIONS */


export const loadReviews = (reviews) => {
    return {
        type: LOAD_REVIEWS,
        payload: reviews

    }
}

export const loadUserReviews = (reviews) => {
    return {
        type: USER_REVIEWS,
        payload: reviews
    }
}

export const actionResetReviews = () => {
    return {
        type: RESET_REVIEWS
    }
}

export const actionLoadOneReview = (review) => {
    return {
        type: ONE_REVIEW,
        payload: review
    }
}





export const normalizeArr = (arr) => {
    // console.log("NORMALIZE ARRAY INPUT, FETCH REVIEWS RESPONSE OBJ", arr)
    const newState = {};
    arr.forEach(spot => {
        newState[spot.id] = spot;
    });

    return newState;
}


//Review initalstate
const initialState = {
    spot: {},
    user: {}
}

//**REDUCER AND CASES */
export default function reviewReducer(state = initialState, action) {
    //converted fruits shape is from previous practice mock data, not the right store shape
    let newState
    switch (action.type) {

        case LOAD_REVIEWS: {
            newState = {
                ...state
            }
            newState.spot = action.payload
            
            return newState
        }

        case USER_REVIEWS: {
            newState = {
                spot: {},
                user: {}
            }

            newState.user = action.payload
            return newState
        }

        case RESET_REVIEWS: {
            newState = { ...state, spot:{} }
            // newState.reviews.spot = {}
            return newState
        }

        case ONE_REVIEW: {
            newState = initialState
            newState.user = action.payload
        }

        default:
            return state
    }

}


// //**THUNKS */

// //SPOT DETAIL PAGE
export const fetchReviews = (id) => async dispatch => {

    const response = await fetch(`/api/spots/${id}/reviews`);
    const reviews = await response.json();


    
    if (response.ok){
        let convertedReviews = normalizeArr(reviews)
        // console.log("CONVERTED REVIEWS", convertedReviews)
        dispatch(loadReviews(convertedReviews));
        return reviews
    }
    //this isnt needed right? i think
    // dispatch(loadReviews([]))

};


// CREATE NEW REVIEW
export const makeReview = (reviewBody, spotId) => async dispatch => {
    // console.log("REVIEW BODY", reviewBody)

    const { review, stars } = reviewBody
    const method = "POST"
    const headers = { "Content-Type": "application/json" }

    const body = JSON.stringify({
        review,
        stars,
        //...formdata placeholder
        // "review": "This was an awesome spot!",
        // "stars": 5,
    })

    
    const options = { method, headers, body }
    
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, options);

    //testing logs
    const reviewData = await response.json();

    const getRes = await fetch(`/api/spots/${spotId}/reviews`);
    const reviewsArr = await getRes.json();
    // console.log("REVIEWS ARR", reviewsArr)
    let convertedReviews = normalizeArr(reviewsArr)
    // console.log(convertedReviews)

    if (response.ok) {
        dispatch(loadReviews(convertedReviews));
        dispatch(fetchOneSpot(spotId))
        return convertedReviews
    }
};

export const editReview = (reviewBody, reviewId) => async dispatch => {
    const { review, stars } = reviewBody
    const method = "PUT"
    const headers = { "Content-Type": "application/json" }

    const body = JSON.stringify({
        review,
        stars,
        //...formdata placeholder
        // "review": "This was an awesome spot!",
        // "stars": 5,
    })

    const options = { method, headers, body }

    const response = await csrfFetch(`/api/reviews/${reviewId}`, options)
    let reviewRes = await response.json()

    if (response.ok) {
        dispatch(actionLoadOneReview(reviewRes))
    }

}


//DELETE REVIEW 
export const deleteReview = (id, spotId) => async dispatch => {
    //extract id
    const method = "DELETE"
    const headers = { "Content-Type": "application/json" }
    const url = `/api/reviews/${id}`
    const options = {
        method,
        headers
    }
    const response = await csrfFetch(url, options)
    const deleteData = await response.json()

    // console.log("DELETE RESPONSE DATA OBJ", deleteData)

    const getRes = await fetch(`/api/spots/${spotId}/reviews`);
    const reviewsArr = await getRes.json();
    console.log("id", id)
    console.log("REVIEWS ARR", reviewsArr)
    let convertedReviews = normalizeArr(reviewsArr)
    console.log(convertedReviews)

    if (response.ok) {
        //when spot is deleted, nothing happens if commentted out
        //if dispatch is fired, page wipes
        dispatch(loadReviews(convertedReviews))
        dispatch(fetchOneSpot(spotId))
        return response.ok
    } else {
        return null
    }
}


export const deleteManagedReview = (id, spotId) => async dispatch => {
    //extract id
    const method = "DELETE"
    const headers = { "Content-Type": "application/json" }
    const url = `/api/reviews/${id}`
    const options = {
        method,
        headers
    }
    const response = await csrfFetch(url, options)
    const deleteData = await response.json()

    // console.log("DELETE RESPONSE DATA OBJ", deleteData)
    if (response.ok) {
        const getRes = await fetch(`/api/reviews/current`);
        const reviewsArr = await getRes.json();
        console.log("REVIEWSARR", reviewsArr)
        
        let convertedReviews = normalizeArr(reviewsArr.Reviews)
        console.log("CONVERTED REVIEWS", convertedReviews)
        dispatch(loadUserReviews(convertedReviews))
        return response.ok
    }
   
}



export const fetchUserReviews = () => async dispatch => {

    const response = await fetch(`/api/reviews/current`);
    // console.log("RESPONSE", response)
    const reviews = await response.json();
    // console.log("REVIEWS", reviews)

    if (response.ok) {
        let convertedReviews = normalizeArr(reviews.Reviews)
        dispatch(loadUserReviews(convertedReviews));
        return reviews
    }
    //this isnt needed right? i think
    // dispatch(loadReviews([]))

};


export const fetchOneUserReview = (reviewId) => async dispatch => {

    const response = await fetch(`/api/reviews/current`);
    console.log("RESPONSE", response)
    // console.log("RESPONSE", response)
    const userReview = await response.json();
    console.log("USER REVIEW", userReview)
    // const userObjReview = userReview.Reviews.find(review => review.id === reviewId)
    const userObjReview = findUserReview(userReview.Reviews, parseInt(reviewId))
    console.log(userReview.Reviews, reviewId)

    console.log("userObjReview", userObjReview)
    // console.log("USEROBJ REVIEW", userObjReview)

    if (response.ok) {
        // let convertedReviews = normalizeArr(reviews.Reviews)
        // console.log("CONVERTED REVIEWS", convertedReviews)
        // const review = reviews.Reviews.find(review => review.id === reviewId)
        dispatch(actionLoadOneReview(userObjReview));
        // console.log("REVIEW", review)
        return userObjReview
    }

};




function findUserReview(userReviewArr, reviewId) {
    for (let i = 0; i < userReviewArr.length; i++) {
        let review = userReviewArr[i]
        if (review.id === reviewId){
            return review
        }
    }
}



