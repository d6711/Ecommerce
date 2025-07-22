const { Router } = require('express')
const router = Router()
const { asyncHandler, validate } = require('../middlewares/handleError')
const { authentication } = require('../middlewares/auth')
const reviewController = require('../controllers/review.controller')

router.get('/', asyncHandler(reviewController.getAllReviews))
router.get('/product', asyncHandler(reviewController.getReviewByProductId))

router.use(authentication)

router.get('/user', asyncHandler(reviewController.getReviewByUserId))
router.post('/', asyncHandler(reviewController.createReview))
router.patch('/', asyncHandler(reviewController.updateReview))
router.delete('/', asyncHandler(reviewController.deleteReview))

module.exports = router