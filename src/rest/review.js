const Router = require('@koa/router');
const reviewService = require('../service/review');

const getAllReviews = async(ctx)=>{
    const data = await reviewService.getAll(Number(ctx.params.userId));
    console.log(data) 
    ctx.body = data;
}

const getReviewById = async (ctx) => {
    ctx.body = await reviewService.getById(Number(ctx.params.userId), Number(ctx.params.movieId));
};

module.exports = (app)=>{
    const router = new Router (
        {
        prefix: '/reviews',
        }
    );

    //geef alle reviews van een bepaalde gebruiker
    router.get('/users/:userId/movies/', getAllReviews);
    //geef een bepaalde review van een bepaalde gebruiker
    router.get('/users/:userId/movies/:movieId', getReviewById);
    
    app.use(router.routes())
     .use(router.allowedMethods());
}

