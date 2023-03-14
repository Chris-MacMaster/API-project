import React from 'react';
// import { Link } from 'react-router-dom';
// import { actionDeleteReport } from '../store/report';
import { useDispatch } from "react-redux"
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';

import { fetchOneSpot } from "../../store/spot"
// import { useDispatch } from 'react-redux';

// import { useSelector } from "react-redux"


import "./SpotIndexItem.css"




const SpotIndexItem = ({ spot }) => {
    const history = useHistory()
    const dispatch = useDispatch()
    // let display = false

    //toggle with the import of useSelector
    // const spotState = useSelector(state => state.spots)

    // const singleSpot = spotState.singleSpot

    const handleClick = (e) => {
        e.preventDefault()
        // console.log("clicked")
        dispatch(fetchOneSpot(spot.id))
        history.push(`/spots/detail/${spot.id}`)
    
    }

    function toDecimal(num) {
        const convertedNum = `${num}`

        if (convertedNum.length >= 4) {
            return convertedNum.slice(0, 4)
        } else if (convertedNum.length === 3) {
            return convertedNum
        }
        else {
            if (!convertedNum.includes("0")) {
                return convertedNum.concat(".0")
            }
        }
        return convertedNum
    }
    


    // let spotRating = spot.avgRating

    // useEffect(() => {
        // dispatch(fetchOneSpot(spot.id))
    // }, [dispatch])

    return (
        <li onClick={handleClick} className='spotIndexItem'>
            

            <div title={spot.name} className='spot-card-div' >
                {/* <div  className='tooltip'>

                </div> */}
                <div className='spot-name'>
                    {spot.name}
                </div>
                <div >
                    {/* <img scr={spot.previewImage} alt="not found" /> */}
                    <img id='prev-img' src={spot.previewImage}
                        alt='previewImage' />
                    
                </div>
                <div className='card-info' >
                    <div className='card-row1'>
                        <div className='city-state' >
                    {spot.city}, {spot.state}
                        </div>
                        <div className='avg-rating' >
                            &#9733; 
                            {/* {spot.avgRating} */}
                            {spot.avgRating !== "no reviews exist for this spot yet" ? toDecimal(spot.avgRating) : "New"}
                        </div>

                    </div >

                    <div className='card-row2' >
                        <p className='price'>${spot.price} night</p>
                       
                        {/* &#9733; {spot.avgRating !== "no reviews exist for this spot yet" ? spot.avgRating : "New"} */}

                    </div>
                </div>

            </div>
        </li>
    );
};

export default SpotIndexItem;



// {/* <Link to={`/reports/${report.id}`}>Report #{report.id}</Link> */ }
// {/* <Link to={`/reports/${report.id}/edit`}>Edit</Link> */ }









/*
css lecture




*/