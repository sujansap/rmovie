const Router = require('@koa/router');
const reviewService = require('../service/review');

const getAllReviews = async(ctx)=>{
    const data = await reviewService.getAll();
    console.log(data) 
    ctx.body = data;
}

const getReviewById = async (ctx) => {
    ctx.body = await reviewService.getById(Number(ctx.params.id));
};

module.exports = (app)=>{
    const router = new Router (
        {prefix: '/reviews'}
    );


    router.get('/', getAllReviews);
    router.get('/:id', getReviewById);
    
    app.use(router.routes())
     .use(router.allowedMethods());
}

