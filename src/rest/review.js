const Router = require('@koa/router');
const reviewService = require('../service/review');

const getAllReviews = async(ctx)=>{
    const data = await reviewService.getAll(Number(ctx.params.userId));
    console.log(data) 
    ctx.body = data;
}

const getFullReviewById = async (ctx) => {
    ctx.body = await reviewService.getFullReviewById(Number(ctx.params.userId), Number(ctx.params.movieId));
};

const addReview = async(ctx)=>{
    const data = {...ctx.request.body};
    ctx.body = await reviewService.
        add(
        Number(ctx.params.userId),
        Number(ctx.params.movieId),
        data.review, 
        Number(data.rating)
        );
}


const deleteReview = async(ctx)=>{

    await reviewService.
        deleteById(
        Number(ctx.params.userId),
        Number(ctx.params.movieId)
        );
    ctx.status = 204;
}

module.exports = (app)=>{
    const router = new Router (
        {
        prefix: '/reviews',
        }
    );

    //geef alle reviews van een bepaalde gebruiker
    router.get('/users/:userId/movies/', getAllReviews);
    //geef een bepaalde review van een bepaalde gebruiker
    router.get('/users/:userId/movies/:movieId', getFullReviewById);
    router.post('/users/:userId/movies/:movieId', addReview);
    router.delete('/users/:userId/movies/:movieId', deleteReview);
    app.use(router.routes())
     .use(router.allowedMethods());
}

