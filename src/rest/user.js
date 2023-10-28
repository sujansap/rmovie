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

module.exports = (app)=>{
    const router = new Router (
        {prefix: '/users'}
    );

    router.get('/', getAllUsers);
    router.get('/:id', getUserById);
    
    app.use(router.routes())
     .use(router.allowedMethods());
}
