export const errorHandler=(error, req, res, next)=>{
    if(error){
        if(error.code){
            console.log(`(Error codigo ${error.code}) - ${error.name}: ${error.message}. Detalle: ${error.descripcion}`)

            res.setHeader('Content-Type','application/json');
            return res.status(error.code).json({error:`${error.name}: ${error.message}`})
        }else{
            res.setHeader('Content-Type','application/json');
            return res.status(500).json({error:`Unexpected server error - Try again later, or contact your administrator`})
        }
    }

    next()
}