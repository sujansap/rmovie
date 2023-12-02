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
    console.log(data) 
    console.log("test");
    ctx.body = data;
}

const getMovieGenres= async(ctx)=>{
    const data = await movieService.getMovieGeneres(Number(ctx.params.id));
    console.log(data.movieId) 
    console.log("test");
    ctx.body = data;
}



const getAllReviewsForMovie= async(ctx)=>{
    const data = await movieService.getAllReviewsForMovie(Number(ctx.params.id));

    ctx.body = data;
}

const deleteMovie = async(ctx)=>{
    
    await movieService.deleteById(Number(ctx.params.id));

    console.log("the movie has been deleted!!!");
    ctx.status = 204;
}

const addMovie = async(ctx)=>{
    const d = {...ctx.request.body};
    
    //later the 1 needs to change to the user that is logged in at the moment of adding

    const addedMovie = await movieService.addMovie(d);
    console.log(addedMovie)
    ctx.status = 201;
    ctx.body = addedMovie;
}


const addReview = async(ctx)=>{
    //wat moet er precies gebeuren als een user al een review heeft voor die film
    const data = {...ctx.request.body};
    console.log("adding a review test: " + Number(ctx.params.id) );
    ctx.body = await movieService.
        addReview(
        1,
        Number(ctx.params.id),
        data.review, 
        Number(data.rating)
        );
}
/*
const updateMovie = async(ctx)=>{
    const id = Number(ctx.params.id);
    const data = {...ctx.request.body};
   ctx.body = await movieService.updateMovie(id, data);
}
*/
module.exports = (app)=>{
    const router = new Router (
        {prefix: '/movies'}
    );


    router.get('/', getAllMovies);
    router.get('/:id', getMovieById);
    router.post('/', addMovie);
    //router.put('/:id', updateMovie);
    router.delete('/:id', deleteMovie);
    router.get('/:id/genres', getMovieGenres);

    router.get('/:id/reviews', getAllReviewsForMovie);
    router.post('/:id/reviews', addReview);



    app.use(router.routes())
     .use(router.allowedMethods());
}