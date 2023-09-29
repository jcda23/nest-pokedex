import * as joi from 'joi'




export const JoiValidationSchema = joi.object({
     
MONGO_URI: joi.required(), 
PORT: joi.number().default(3000),
DEFAULT_LIMIT: joi.number().default(10),
OFFSET: joi.number().default(0)
})