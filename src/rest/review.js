const Router = require('@koa/router');
const reviewService = require('../service/review');
//over reviews
// users/:id/movies/:id/reviews => geef review van een bepaald movie van een bepaald gebruiker
// users/:id/movies/reviews => geef alle reviews die door een user zijn gepost

//movies/:id/reviews => geef alle reviews van een bepaalde movie
//users/:id/reviews => geef alle reviews van een bepaalde gebruiker



//over movies
// users/:id/movies //geef alle movies 
// movies/reviews   //geef alle reviews van alle movies van aangemelde gebruiker 

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

    //27/11 delete review kan van hier gebeuren, wij hebben alleen de review id nodig 
    //voor update kan je ook gebruiken 
    

    //geef alle reviews van een bepaalde gebruiker
    router.get('/users/:userId/movies/', getAllReviews);
    //geef een bepaalde review van een bepaalde gebruiker
    router.get('/users/:userId/movies/:movieId', getFullReviewById);
    router.post('/users/:userId/movies/:movieId', addReview);
    router.delete('/users/:userId/movies/:movieId', deleteReview);
    app.use(router.routes())
     .use(router.allowedMethods());
}

