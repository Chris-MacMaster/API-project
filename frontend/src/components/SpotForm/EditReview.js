//src/components/SpotForm/CreateSpot.js




// to do: must make a create review regular form 


import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from "react-redux"
// import { makeSpot } from '../../store/spot';

import "./CreateSpot.css"
import { editReview, fetchOneUserReview, makeReview } from '../../store/review';

import { useParams } from 'react-router-dom';

import { useModal } from "../../context/Modal"


import "./CreateReview.css"
import { fetchOneSpot } from '../../store/spot';


const EditReviewForm = () => {
    const history = useHistory();
    const dispatch = useDispatch()

    const params = useParams()
    const { closeModal } = useModal()

    const [review, setReview] = useState("")
    const [stars, setStars] = useState("")

    const [activeRating, setActiveRating] = useState(stars)

    //validation
    const [errors, setErrors] = useState({})
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const [hasClicked, setHasClicked] = useState(false)

    // const reviewId = history()
    const {reviewId} = useParams()
    console.log("USE PARAMS", reviewId)

    const handleClick = () => {
        console.log("HAS CLICKED")
        setHasClicked(true)
    }


    const onChange = (number) => {
        setStars(number)
    }

    useEffect(() => {
        setActiveRating(stars)
    }, [stars])



    useEffect(() => {
        let e = {}
        setErrors(e)
        if (!review) e.noReview = "Must submit a review"
        if (review.length < 10) e.reviewLength = "Review must be at least 10 characters"
        if (!stars) e.stars = "Must submit a star rating"

    }, [stars, review, hasClicked])


    useEffect(() => {
        const fillFields = async () => {
            let reviewInfo = await dispatch(fetchOneUserReview(reviewId))
            setReview(reviewInfo.review)
            setStars(reviewInfo.stars)
        }


        fillFields()
    },[dispatch])

    const handleSubmit = (e) => {
        e.preventDefault();

        setHasSubmitted(true)

        //trying to be careful about data types
        const starsNum = parseInt(stars)
        if (Object.values(errors).length) {
            // window.alert("Cannot Submit, See Errors Listed")
            return
        }

        const newReview = {
            review,
            stars: starsNum
        }
        console.log("REVIEW FORM DATA", newReview)

        dispatch(editReview(newReview, reviewId))

        // dispatch(makeReview(newReview, spotId))

        closeModal()
        history.push("/reviews/manage")
    };

    const reset = () => {
        setReview('');
        setStars('');
    };


    const CreateTest = (e) => {
        e.preventDefault();

        dispatch(makeReview("sse"))
        // history.push(`/spots`);
    };

    return (
        <div>
            <form className='login-form' onSubmit={handleSubmit} >

                <div className='description-label'>
                    <p id='how-was-stay'>
                        How was your stay?
                    </p>
                    {hasSubmitted && errors.noReview && (
                        <div className='error'>
                            * {errors.noReview}
                        </div>
                    )}
                    {hasSubmitted && errors.reviewLength && (
                        <div className='error'>
                            * {errors.reviewLength}
                        </div>
                    )}
                    {hasSubmitted && errors.stars && (
                        <div className='error'>
                            * {errors.stars}
                        </div>
                    )}
                </div>
                <textarea className='description-textarea'
                    placeholder='Leave your review here...'
                    value={review}
                    onChange={(e) => {
                        setReview(e.target.value)
                    }}>

                </textarea>

                {/* <div className='star-rating' >
                    
                    <label>
                        1
                        <input 
                        type="radio"
                        name='star-radio'
                        value={stars}
                        onChange={(e) => {
                            setStars(1)
                            console.log("TRIGGERED 1")
                        }}
                        className="input-1"
                        />
                        2
                    

                        <input
                            type="radio"
                            name='star-radio'
                            value={stars}
                            onChange={(e) => {
                                setStars(2)
                            }}
                            className="input-2"
                        />
                        3

                        <input
                            type="radio"
                            name='star-radio'
                            value={stars}
                            //maybe isnt needed, check
                            defaultChecked={true}
                            onChange={(e) => {
                                setStars(3)
                            }}
                            className="input-3"
                        />
                        4

                        <input
                            type="radio"
                            name='star-radio'
                            value={stars}
                            onChange={(e) => {
                                setStars(4)
                            }}
                            className="input-4"
                        />
                        5

                        <input
                            type="radio"
                            name='star-radio'
                            value={stars}
                            onChange={(e) => {
                                setStars(5)
                            }}
                            className="input-5"
                        />
                    </label>
                </div>

                 */}

                <div className="rating-input paw-stars">
                    <div onClick={() => onChange(1)} onMouseEnter={() => setActiveRating(1)} onMouseLeave={() => setActiveRating(stars)} className={activeRating < 1 ? "empty" : "filled"} >
                        <i className="fa fa-star"></i>
                    </div>
                    <div onClick={() => onChange(2)} onMouseEnter={() => setActiveRating(2)} onMouseLeave={() => setActiveRating(stars)} className={activeRating < 2 ? "empty" : "filled"} >
                        <i className="fa fa-star"></i>
                    </div>
                    <div onClick={() => onChange(3)} onMouseEnter={() => setActiveRating(3)} onMouseLeave={() => setActiveRating(stars)} className={activeRating < 3 ? "empty" : "filled"} >
                        <i className="fa fa-star"></i>
                    </div>
                    <div onClick={() => onChange(4)} onMouseEnter={() => setActiveRating(4)} onMouseLeave={() => setActiveRating(stars)} className={activeRating < 4 ? "empty" : "filled"} >
                        <i className="fa fa-star"></i>
                    </div>
                    <div onClick={() => onChange(5)} onMouseEnter={() => setActiveRating(5)} onMouseLeave={() => setActiveRating(stars)} className={activeRating < 5 ? "empty" : "filled"} >
                        <i className="fa fa-star"></i>
                    </div>
                    <p className='stars'>
                        Stars
                    </p>
                </div>
                {/* <div onClick={handleClick}>
                </div> */}
                <input className='submit-button modal-button button white-button create-review-button' type="submit" value="Submit Your Review" />
                {/* disabled={!!Object.values(errors).length} */}
            </form>


        </div>
    );
}

export default EditReviewForm;