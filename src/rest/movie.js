const Router = require('@koa/router');
const movieService = require('../service/movie');


const getAllMovies = async(ctx)=>{
    const data = await movieService.getAll();
    console.log(data) 
    console.log("test");
    ctx.body = data;
}


const getMovieById = async(ctx)=>{
    const data = await movieService.getById(Number(ctx.params.id));
    console.log(data.movieId) 
    console.log("test");
    ctx.body = data;
}

const deleteMovie = async(ctx)=>{
    await movieService.deleteById(Number(ctx.params.id));
    ctx.status = 204;
}

const addMovie = async(ctx)=>{
    //later the 1 needs to change to the user that is logged in at the moment of adding
    const d = {...ctx.request.body};
    console.log("under here");
    console.log(d)
    await movieService.addMovie(d.title, 1);
    ctx.status = 204;
}


const updateMovie = async(ctx)=>{
    const id = Number(ctx.params.id);
    const data = {...ctx.request.body};

   ctx.body = await movieService.updateMovie(id, data);
}

module.exports = (app)=>{
    const router = new Router (
        {prefix: '/movies'}
    );


    router.get('/', getAllMovies);
    router.get('/:id', getMovieById);
    router.post('/', addMovie);
    router.put('/:id', updateMovie);
    router.delete('/:id', deleteMovie);

    app.use(router.routes())
     .use(router.allowedMethods());
}