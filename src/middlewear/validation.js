import Content from "../models/content.js";
const validationanalyzeContent = (req, res, next) => {
    const{text}=req.body

    if(!text){
        return res.status(400).json({message:'Text is required'})
    }
    if(typeof text !== 'string'){
        return res.status(400).json({message:'Text must be a string'})
    }
    if(text.length<10){
        return res.status(400).json({message:'Text must be at least 10 characters long'})
    }
    if(text.length>1000){
        return res.status(400).json({message:'Text must be less than 1000 characters long'})
    }
    if(!/^[a-zA-Z0-9\s.,!?'"-]+$/.test(text)){
        return res.status(400).json({message:'Text contains invalid characters'})
    }
    if(text.trim().length===0){
        return res.status(400).json({message:'Text cannot be empty'})
    }
    next()
}
export default validationanalyzeContent