var express = require('express');
var router = express.Router();
const Lesson = require('../models/Lesson');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
const {isUserLoggedIn} = require('../middleware/user-route-guard');

router.get('/:lessonId', isUserLoggedIn, async (req, res, next) => {
    const lessonId = req.params.lessonId;

    try {
        console.log("PURCHASING LESSON ID ===>", lessonId);

        const ourLesson = await Lesson.findById(lessonId);

        const product = await stripe.products.create({
            name: ourLesson.name,
        });
        console.log("Product:", product);

        const price = await stripe.prices.create({
            unit_amount: ourLesson.price * 100, 
            currency: 'usd',
            product: product.id,
        });
        console.log("Price:", price);

        const lineItems = [{
            price: price.id,
            quantity: 1,
        }];

        console.log("line items:", lineItems);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `https://project2-watodoo.adaptable.app/lessons/payment-confirmation/${lessonId}`, 
            cancel_url: 'https://project2-watodoo.adaptable.app/lessons/all',
        });
        console.log("Session ===============>", session);
        res.redirect(session.url);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;