import React from 'react';
// import { Link } from 'react-router-dom';
// import { actionDeleteReport } from '../store/report';
import { useDispatch } from "react-redux"
import { useHistory } from 'react-router-dom';


import { useModal } from '../../context/Modal';

import { deleteSpot, fetchOneSpot } from "../../store/spot"
import OpenModalButton from '../OpenModalButton';



import "./CurrentSpotItem.css"



import "./DeleteSpotModal.css"


const DeleteSpotModal = ({spot}) => {
    const history = useHistory()
    const dispatch = useDispatch()

    const { closeModal } = useModal()


    const handleDelete = (e) => {
        e.preventDefault()

        dispatch(deleteSpot(spot.id))
        // history.push(`/spots/${spot.id}`)
        closeModal()
        // history.push(`/spots/current`)
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
                Are you sure you want to remove this spot?
            </p>
            <button onClick={handleDelete} className='yes-delete-button button white-button' type='button' >Yes (Delete Spot)</button>
            <button onClick={handleNoDelete} className='no-delete-button button grey-keep' type='button' >No (Keep Spot)</button>
        </div>
                 

      
    );
};

export default DeleteSpotModal;



// {/* <Link to={`/reports/${report.id}`}>Report #{report.id}</Link> */ }
// {/* <Link to={`/reports/${report.id}/edit`}>Edit</Link> */ }









/*
css lecture




*/