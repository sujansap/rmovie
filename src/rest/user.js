const Router = require('@koa/router');
const userService = require('../service/user');


const getAllUsers = async(ctx)=>{
    const data = await userService.getAll();
    console.log(data) 
    ctx.body = data;
}


const getUserById = async(ctx)=>{
    const user = await userService.getById(Number(ctx.params.id)); 
    ctx.body = user;
}


const getAllReviewsForUser = async(ctx)=>{
    const data = await userService.getReviewsForUser(Number(ctx.params.id)); 
    ctx.body = data;
}

const getReviewForMovieForUser = async(ctx)=>{
    const data = await userService.getReviewForMovieForUser(Number(ctx.params.userId), Number(ctx.params.movieId)); 
    console.log(data);
    ctx.body = data;
}

const updateMovieReviewForUser = async(ctx)=>{
    const uid = Number(ctx.params.userId);
    const mid = Number(ctx.params.MovieId);
    const data = {...ctx.request.body};
   ctx.body = await userService.updateMovieReviewForUser(uid, mid, data);
}


module.exports = (app)=>{
    const router = new Router (
        {prefix: '/users'}
    );

    router.get('/', getAllUsers);
    router.get('/:id', getUserById);
    router.get('/:id/reviews', getAllReviewsForUser);
    router.get('/:userId/movies/:movieId/reviews', getReviewForMovieForUser);
    
    router.put('/:userId/movies/:movieId/reviews', updateMovieReviewForUser)
    app.use(router.routes())
     .use(router.allowedMethods());
}
