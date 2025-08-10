const { Router } = require('express')
const router = Router()
const { asyncHandler, validate } = require('../middlewares/handleError')
const { authentication } = require('../middlewares/auth')
const reviewController = require('../controllers/review.controller')
const { grantAccess } = require('../middlewares/rbac')

router.get('/', asyncHandler(reviewController.getAllReviews))
router.get('/product', asyncHandler(reviewController.getReviewByProductId)) // query params

router.use(authentication)

router.get('/user', grantAccess('readOwn', 'review'), asyncHandler(reviewController.getReviewByUserId))
router.post('/', grantAccess('createOwn', 'review'), asyncHandler(reviewController.createReview))
router.patch('/', grantAccess('updateOwn', 'review'), asyncHandler(reviewController.updateReview))
router.delete('/', grantAccess('deleteOwn', 'review'), asyncHandler(reviewController.deleteReview))

module.exports = router