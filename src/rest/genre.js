const Router = require('@koa/router');

const genreService = require('../service/genre');


const getAllGenres = async(ctx)=>{
    const data = await genreService.getAll();
    console.log(data) 
    ctx.body = data;

}



module.exports = (app)=>{
    const router = new Router (
        {prefix: '/genres'}
    );

    router.get('/', getAllGenres);

    
    app.use(router.routes())
     .use(router.allowedMethods());
}
