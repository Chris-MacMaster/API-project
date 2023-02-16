import { csrfFetch } from "./csrf"


const INITIAL_SPOT = "spot/LOAD"
const LOAD_SPOTS = "spots/LOAD"
const LOAD_SPOT = "spots/LOAD/ONE"
const DELETE_SPOT = "spots/DELETE"
//**ACTIONS */


export const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS,
        payload: spots
    }
}

export const loadOneSpot = (spot) => {
    return {
        type: LOAD_SPOT,
        payload: spot
    }
}

export const actionDeleteSpot = () => {
    return {
        type: DELETE_SPOT
    }
}

export const normalizeArr = (arr) => {
    const newState = {};
    arr.forEach(spot => {
        newState[spot.id] = spot;
    });
    
    return newState;
} 


//Spot initalstate
const initialState = {
    allSpots: {},
    singleSpot: {}
}

//**REDUCER AND CASES */
export default function spotReducer(state = initialState, action) {
    //converted fruits shape is from previous practice mock data, not the right store shape
    let newState
    switch (action.type) {
        case INITIAL_SPOT: {
            newState = { ...state }
            return newState
        }
        case LOAD_SPOTS: {
            //neccessary to render all, bug to fix
            newState = { ...state, //...action.payload
            }
            newState.allSpots = action.payload
            //creates key error, shouldnt be a problem
            return newState
        }
        case LOAD_SPOT: {
            newState = {...state}
            newState.singleSpot = action.payload
            return newState
        }

        case DELETE_SPOT: {
            newState = { ...state }
            // newState.singleSpot = action.payload
            return newState
        }


        default:
            return state
    }

}


//**THUNKS */

//SPOTS HOME PAGE
export const fetchSpots = () => async dispatch => {
    const response = await fetch('/api/spots');
    const spots = await response.json();
    let convertedSpots = normalizeArr(spots.Spots)
    // console.log(spots)
    // console.log(convertedSpots)

    dispatch(loadSpots(convertedSpots));
};

//SPOT MANAGE PAGE
export const fetchCurrentSpots = () => async dispatch => {
    // console.log("triggers")
    const response = await fetch('/api/spots/current');
    const spots = await response.json();


    console.log(spots)
    let convertedSpots = normalizeArr(spots.Spots)
    // console.log(convertedSpots)

    dispatch(loadSpots(convertedSpots));
};

//SPOT DETAIL PAGE
export const fetchOneSpot = (id) => async dispatch => {
    // console.log(id)
    const response = await fetch(`/api/spots/${id}`);
    const spot = await response.json();
    // console.log("triggers fetchOneSpot")
    // console.log(spot)//the correct object
    if (response.ok){
        dispatch(loadOneSpot(spot));
        return spot
    }
};
//dispatch works, find where the dispatch is triggered, and load the appropriate data



//CREATE NEW SPOT
export const makeSpot = (spotBody) => async dispatch => {
    // console.log("SPOT BODY", spotBody)


    const { address, city, state, country, lat, lng, name, description, price} = spotBody
    const method = "POST"
    const headers = { "Content-Type": "application/json"}

    const body = JSON.stringify({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
        //...formdata placeholder
        // "address": "123 Disney Lane",
        // "city": "San Francisco",
        // "state": "California",
        // "country": "United States of America",
        // "lat": 37.7645358,
        // "lng": -122.4730327,
        // "name": "App Academy",
        // "description": "Place where web developers are created",
        // "price": 123
        
    })
    const options = {method, headers, body}
    // console.log("POST STRINGIFIED SPOT BODY", body)
    // console.log("address", address)

    //fails here
    const response = await csrfFetch(`/api/spots`, options);
    
    //testing logs
    const spot = await response.json();
    // console.log("POST RESPONSE DATA OBJ",spot)
    
    if (response.ok){
        dispatch(loadSpots(spot));
        return spot
    }

};


//DELETE SPOT 
export const deleteSpot = (id) => async dispatch => {
    //extract id
    const method = "DELETE"
    const headers = { "Content-Type": "application/json" }
    const url = `/api/spots/${id}`
    const options = {
        method,
        headers
    }
    const response = await csrfFetch(url, options)
    const deleteData = await response.json()

    console.log("DELETE RESPONSE DATA OBJ", deleteData)

    //loadupdated list of spots
    const getRes = await fetch('/api/spots/current');
    const spots = await getRes.json();
    let convertedSpots = normalizeArr(spots.Spots)

    if (response.ok){
        dispatch(loadSpots(convertedSpots))
    }
}





//EDIT SPOT
export const editSpot = (spotBody) => async dispatch => {
    // console.log(id)
    const { address, city, state, country, lat, lng, name, description, price, spotId } = spotBody

    // const spotId = {spotBody}
    const method = "PUT"
    const headers = { "Content-Type": "application/json" }
    const body = JSON.stringify({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
        //...formdata placeholder
        // "address": "edited",
        // "city": "edited",
        // "state": "edited",
        // "country": "United States of America",
        // "lat": 37.7645358,
        // "lng": -122.4730327,
        // "name": "App Academy",
        // "description": "Place where web developers are created",
        // "price": 321
    })
    const options = { method, headers, body }

    // let spotId;//We need to get the spotId in there 
    //
    // const response = await csrfFetch(`/api/spots/${spotId}`, options);
    const response = await csrfFetch(`/api/spots/${spotId}`, options);
    const spot = await response.json();
    //testing logs
    console.log("PUT RESPONSE DATA OBJ", spot)

    // if (response.ok) {
    //     dispatch(loadSpots(spots));
    //     return spots
    // }

    //loadupdated list of spots
    const getRes = await fetch('/api/spots/current');
    const spots = await getRes.json();
    let convertedSpots = normalizeArr(spots.Spots)

    if (response.ok) {
        dispatch(loadSpots(convertedSpots))
    }

};


