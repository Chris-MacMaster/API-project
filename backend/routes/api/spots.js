// backend/routes/api/session.js

const express = require('express');
// const { UPSERT } = require('sequelize/types/query-types');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
// const { handleValidationErrors } = require('../../utils/validation');


const { Spot, sequelize } = require('../../db/models');
const { SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');

// const spotimage = require('../../db/models/spotimage');

const router = express.Router();

const {Op} = require("sequelize")//got the query validations to work 





//edit a spot
router.put('/:spotId', requireAuth, async (req, res) => {
    const target = await Spot.findByPk(req.params.spotId)
    if (!target){
        let err = new Error("No spot with provided id exists")
        err.status = 404
        throw err
    }
    if (req.user.id !== target.ownerId){
        throw new Error("Each spot can only be edited by owner")
    }


    nullErr(req.body.address, "Address")
    nullErr(req.body.city, "City")
    nullErr(req.body.state, "State")
    nullErr(req.body.country, "Country")

    nullErr(req.body.lat, "lat")
    isNumber(req.body.lat)

    nullErr(req.body.lng, "lng")
    isNumber(req.body.lng)

    nullErr(req.body.name, "Name")
    nullErr(req.body.description, "Description")

    nullErr(req.body.price, "Price")
    isNumber(req.body.price)


    await target.update({
        ...req.body
    })

    function nullErr(property, item){
        if (!property){
            let err = new Error(`${item} is required`)
            err.status = 400
            throw err
        }
    }

    function isNumber(property){
        if (typeof property !== "number"){
            let err = new Error(`${property} must be a number`)
            err.status = 400
            throw err
        }
    }



    res.json(target)
})



//returns all spots
router.get('/', async (req, res) => {

    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    const where = {
        price: {[Op.between]: [minPrice - 1 || 0, maxPrice + 1 || 99999999]},
        lat: { [Op.between]: [minLat - 1 || -99999, maxLat + 1 || 999999] },
        lng: { [Op.between]: [minLng - 1 || -99999, maxLng + 1 || 999999] },
    }
    
    if (
        (page && !parseInt(page)) ||
        (size && !parseInt(size)) ||
        (minLat && !parseInt(minLat)) ||
        (maxLat && !parseInt(maxLat)) ||
        (minLng && !parseInt(minLng)) ||
        (maxLng && !parseInt(maxLng)) ||
        (minPrice && !parseInt(minPrice)) ||
        (maxPrice && !parseInt(maxPrice))
    ) {
        res.status(400)
        throw new Error('invalid spot search parameters')
    }
    
    const pagination = {}

    if (!page || parseInt(page) <= 0) {
        pagination.page = 1
    } else if (page && parseInt(page) >= 1) {
        pagination.page = parseInt(page)
    }

    if (!size || parseInt(size) <= 0) {
        pagination.size = 2
    } else if (size && parseInt(size) >= 1) {
        pagination.size = parseInt(size)
    }
    const paging = {}

    paging.limit = pagination.size
    paging.offset = pagination.size * (pagination.page - 1)

    const pagifier = {}
    pagifier.page = pagination.page
    

    const spots = await Spot.findAll({
        where//, ...paging
    })//temporaril shut off paging 

    if (!spots.length) {
        let err = new Error("No spots found matching those parameters")
        err.status = 404
        throw err
    }


    function sumArray(arr) {
        let sum = 0
        for (let i = 0; i < arr.length; i++) {
            obj = arr[i]
            sum += obj.stars
        }
        return sum
    };

    let spotsArr = []


    for (let i = 0; i < spots.length; i++){
        // let spot = spots[i]
        let spotImage = await SpotImage.findAll(
            {
                attributes: ['url'],
                where: {
                    spotId: spots[i].id
                }
            }
        )
        let spotReviews = await Review.findAll(
            {
                attributes: ['stars'],
                where: {
                    spotId: spots[i].id
                }
            }
        )
        console.log(spotReviews)
        let newSpot = spots[i].toJSON()

        let count = 0;
        let sum = 0;

        if (spotReviews.length){
            count = spotReviews.length
            sum = sumArray(spotReviews)
            newSpot.avgRating = sum / count
        } else {newSpot.avgRating = "no reviews exist for this spot yet"}

        if (spotImage.length){
            newSpot.previewImage = spotImage[0].url
        } else { newSpot.previewImage = "no preview image exists for this spot yet" }
        

        spotsArr.push(newSpot)
    }
    
    res.status(200)

    let Spots = spotsArr
    
    res.json({ Spots, ...pagifier })
})


//get allspot for current user 
router.get('/current', requireAuth, async (req, res) => {


    const spots = await Spot.findAll({
        where: {
            ownerId: req.user.id
        },
    })
    res.status(200)

    function sumArray(arr) {
        let sum = 0
        for (let i = 0; i < arr.length; i++) {
            obj = arr[i]
            sum += obj.stars
        }
        return sum
    };

    let spotsArr = []

    for (let i = 0; i < spots.length; i++) {
        
        let spotImage = await SpotImage.findAll(
            {
                attributes: ['url'],
                where: {
                    spotId: spots[i].id
                }
            }
        )
        let spotReviews = await Review.findAll(
            {
                attributes: ['stars'],
                where: {
                    spotId: spots[i].id
                }
            }
        )
        let newSpot = spots[i].toJSON()

        let count = 0;
        let sum = 0;
        console.log("SPOT REVIEWS", spotReviews)

        if (spotReviews.length) {
            count = spotReviews.length
            sum = sumArray(spotReviews)
            newSpot.avgRating = sum / count
        } else { newSpot.avgRating = "no reviews exist for this spot yet" }

        if (spotImage.length) {
            newSpot.previewImage = spotImage[0].url
        } else { newSpot.previewImage = "no preview image exists for this spot yet" }

        spotsArr.push(newSpot)
    }

    res.status(200)

    let Spots = spotsArr

    res.json({ Spots })
})


//Create a new spot
router.post("/", requireAuth, async (req, res) => {

    console.log("FROM POST ROUTE", req.body)

    const { address, city, state, country, lat, lng, name,
    description,
    price
    } = req.body


    // let newSpot = await Spot.validate({
    //     ownerId: req.user.id,
    //     address,
    //     city,
    //     state,
    //     country,
    //     lat,
    //     lng,
    //     name,
    //     description,
    //     price
    // })
    
    newSpot = await Spot.create({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })

    
    
    res.status(201)
    res.json(newSpot)
})





// })
//get details from spot by id
router.get('/:spotId', async (req, res) => {

    let reviewCount = await Review.count({
        where: {
            spotId: req.params.spotId
        }
    })

    let starSum = await Review.sum('stars', {
        where: {
            spotId: req.params.spotId
        }
    })

    let spot = await Spot.findAll({
        where: {
            id: req.params.spotId
        },
        include: [{ model: SpotImage }, { model: User,
        foreignKey: 'ownerId',
        as: "Owner"
        }], 
    })


    if (!spot.length){
        let err = new Error('Spot does not exist with the provided id')
        err.status = 404 
        throw err
    }

    spot = spot[0].toJSON() 

    spot.numReviews = reviewCount
    console.log("STAR SUM", starSum, "REVIEW COUNT", reviewCount)
    if (starSum){
        spot.avgStarRating = (starSum / reviewCount)
    } else {
        spot.avgStarRating = "No reviews found"
    }

    if (spot.SpotImages.length) {
        delete spot.SpotImages[0].createdAt
        delete spot.SpotImages[0].updatedAt
        delete spot.SpotImages[0].spotId
    }

    delete spot.Owner.username

    res.json(spot)
})


//add image to spot
router.post('/:spotId/images', requireAuth, async(req, res) => {

    let spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        let err = new Error('No spot found with that id')
        err.status = 404
        throw err
    }

    if (req.user.id !== spot.ownerId) {
        throw new Error('Only spot owner may post image')
    }

    let newImg = await SpotImage.create({
        ...req.body,
        spotId: req.params.spotId
    })

    let img = newImg.toJSON()

    delete img.updatedAt
    delete img.createdAt
    delete img.spotId

    res.json(img)

})

//delete a spot
router.delete('/:spotId', requireAuth, async (req, res) => {

    let spot = await Spot.findByPk(req.params.spotId)

    if (!spot){
        let err = new Error('No spot found with that id')
        err.status = 404
        throw err
    }

    if (req.user.id !== spot.ownerId) {
        throw new Error('Only spot owner may delete')
    }

    await spot.destroy()
    
    res.json({message: 'Spot deleted',
    statusCode: 200
})
})


// //delete an image via spot id
// router.delete('/:spotId', requireAuth, async (req, res) => {

//     let spot = await Spot.findByPk(req.params.spotId)

//     if (!spot) {
//         let err = new Error('No spot found with that id')
//         err.status = 404
//         throw err
//     }

//     if (req.user.id !== spot.ownerId) {
//         throw new Error('Only spot owner may delete')
//     }

//     await spot.destroy()

//     res.json('Spot deleted')

// })

//get a review by spot id
router.get('/:spotId/reviews', async (req, res) => {

    let reviews = await Review.findAll({
        where: {
            spotId: req.params.spotId
        },
        include:[ { model:User, attributes: ['id', 'firstName', 'lastName'],
        foreignKey: "userId"
    },
        { model: ReviewImage, attributes: ['id', 'url'],
        foreignKey: "reviewId"
    }]
    })

    if (!reviews.length){
        // console.log("REVIEWS", reviews)
        let err = new Error('No spots with that id exist')
        err.status = 404
        throw err
    }
    res.json(reviews)
})

//create a review based on spot id
router.post('/:spotId/reviews', requireAuth, async (req, res) => {

    let spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        let err = new Error('No spot found with that id')
        err.status = 404
        throw err
    }

    // if (req.user.id !== spot.ownerId) {
    //     throw new Error('Only spot owner may post review')
    // }

    let ifReview = await Review.findAll({
        where: {
            spotId: req.params.spotId,
            userId: req.user.id
        }
    })
    
    if (ifReview.length){
        let err = new Error('You already have a review for that spot')
        err.status = 403
        throw err
    }

    let newReview = await Review.create({
        userId: req.user.id,
        spotId: parseInt(req.params.spotId),
        ...req.body
    })

    let review = newReview.toJSON()

    review.userId = req.user.id
    review.spotId = req.params.spotId

    // let Review = review

    res.json({review})
})

//create a booking for a spot
router.post('/:spotId/bookings', requireAuth, async(req, res) => {
    // if (parseInt(req.params.spotId) === req.user.id) {
    //     let err = new Error('You cannot create a booking at a spot you already own')
    //     throw err
    // }

   let spot = await Spot.findByPk(req.params.spotId)


    if (parseInt(spot.ownerId) === req.user.id) {
        let err = new Error('You cannot create a booking at a spot you already own')
        throw err
    }

   if (!spot){
    let err = new Error('Spot does not exist with provided id')
    err.status = 404
    throw err
   }

   if (endB4Start(req.body.startDate, req.body.endDate)){
    let err = new Error('endDate cannot be on or before startDate')
    err.status = 400
    throw err
   }

    function endB4Start(startDate, endDate) {
        let startObj = new Date(startDate)
        let endObj = new Date(endDate)

        if (endObj >= startObj) {
            return false
        }
        return true
    }

   let bookings = await Booking.findAll({
        where: {spotId: parseInt(req.params.spotId)},
   })

   let bookingsArr = []


   bookings.forEach(booking => {
    booking = booking.toJSON()
    bookingsArr.push(booking)
   })

   for (let i = 0; i < bookingsArr.length; i++){
    let booking = bookingsArr[i]

    if (isConflict(booking.startDate, req.body.startDate, booking.endDate)) {
        throw new Error('Start date conflicts with existing booking')
    }
    if (isConflict(booking.startDate, req.body.endDate, booking.endDate)) {
        throw new Error('End date conflicts with existing booking')
    }
   }

   let booking = await Booking.create({
    userId: req.user.id,
    spotId: parseInt(req.params.spotId),
    ...req.body,   
   })

   res.json(booking)

    function isConflict(dateStr1, dateStr2, dateStr3) {
        let dateObj1 = new Date(dateStr1)
        let dateObj2 = new Date(dateStr2)
        let dateObj3 = new Date(dateStr3)

        if (dateObj1 <= dateObj2 && dateObj2 <= dateObj3) {
            return true
        }
        return false
    }
})



//get all bookings for a spot
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    let spotCheck = await Spot.findByPk(req.params.spotId)
    if (!spotCheck) {
        let err = new Error("No spot with provided id exists")
        err.status = 404
        throw err
    }

    let bookings = await Booking.findAll({
        where: {
            spotId: parseInt(req.params.spotId)
        }
    })

    if (!bookings.length) {
        let err = new Error("No bookings exist for that spot")
        err.status = 404
        throw err
    }

    let newBookings = []
    bookings.forEach(booking => {
        booking = booking.toJSON()
        newBookings.push(booking)
    })

    for (let i = 0; i < newBookings.length; i++){
        let booking = newBookings[i]

        let spot = await Spot.findByPk(req.params.spotId)
        spot = spot.toJSON()

        let user = await User.findByPk(req.user.id)
        user = user.toJSON()
        
        if (req.user.id === spot.ownerId){
            booking.User = {
                ...user
            }
            delete booking.User.username
        }  else {
            delete booking.id
            delete booking.userId
            delete booking.createdAt
            delete booking.updatedAt
        }
        // newBookings[i] = booking
    }

    let Bookings = newBookings

    // Bookings[0].url = "agaf"

    res.json( {Bookings} )


})





module.exports = router;


//J65y47FP-szdsaTnvwYa-qoOaUty9lfzokWk; _csrf=Te8mRjfOV4mkCzxbI72lpbFt
// http://localhost:8000/api/spots
