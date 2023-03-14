import React from 'react';
// import { Link } from 'react-router-dom';
// import { actionDeleteReport } from '../store/report';
import { useDispatch } from "react-redux"
import { useHistory } from 'react-router-dom';


import { Modal, useModal } from '../../context/Modal';
import { deleteManagedReview, deleteReview } from '../../store/review';

import { deleteSpot, fetchOneSpot } from "../../store/spot"
// import OpenModalButton from '../OpenModalButton';

import { useEffect } from 'react';
import { fetchReviews } from '../../store/review';

import { useSelector } from 'react-redux';


// import { useParams } from 'react-router-dom';


import "../SpotsIndex/DeleteSpotModal.css"

const ReviewDeleteModal = ({ review, spotId }) => {
    const history = useHistory()
    const dispatch = useDispatch()

    const { closeModal } = useModal()
    // const spotId = useParams()

    const userState = useSelector(state => state.session.user)



    const handleDelete = (e) => {
        e.preventDefault()
        
        dispatch(deleteReview(review.id, spotId))
        closeModal()
    }

    const handleNoDelete = (e) => {
        e.preventDefault()
        closeModal()
        // history.push(`/spots/current`)
    }

    return (

        <div className='delete-modal-div'>
            <p className='confirm-delete-title'>
                Confirm Delete
            </p>
            <p className='confirm-delete-text'>
                Are you sure you want to delete this review?
            </p>
            <button onClick={handleDelete} className='yes-delete-button button' type='button' >Yes (Delete Review)</button>
            <button onClick={handleNoDelete} className='no-delete-button button grey-keep' type='button' >No (Keep Review)</button>
        </div>



    );
};

export default ReviewDeleteModal;