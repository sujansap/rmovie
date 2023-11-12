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
    ctx.body = data;
}



module.exports = (app)=>{
    const router = new Router (
        {prefix: '/users'}
    );

    router.get('/', getAllUsers);
    router.get('/:id', getUserById);
    router.get('/:id/reviews', getAllReviewsForUser);
    router.get('/:userId/movies/:movieId/reviews', getReviewForMovieForUser);
    
    app.use(router.routes())
     .use(router.allowedMethods());
}
