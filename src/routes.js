// adding some npm modules
let admin = require("firebase-admin");
let firebase = require("firebase");
let Joi = require("joi");

// making routes
const routes = [
{
	method: 'GET',
	path: '/',
	config: {
	// include this route in swagger documentation
		description:"Home Route",
	    notes:"Home Page is comming soon",
		tags:['api'],
	},
	handler: async(request, h)=>{
		return ('Welcome to BaseHippo')
	}
},
{
	method: 'POST',
	path: '/user/sign-up',
	config: {
	// include this route in swagger documentation
		description:"Post user details",
	    notes:"route not for publicaly use",
		tags:['api'],
			validate: {
				// request payload
				payload: {
			    	firstname : Joi.string().required(),
			    	lastname : Joi.string().required(),
			    	username : Joi.string().required(),
			    	email : Joi.string().required(),
					password : Joi.string().required(),
					mobile : Joi.number().required(),
					gender : Joi.string().required(),
					business: Joi.string().required(),
					isVerified : false
				}
			}
		},
		handler: async(request, h)=>{
		// making refrence with firebase as table name Users
		let ref = firebase.database().ref('Users');
		let pr = async (resolve, reject) => {
			let newUser = ({
				"firstname": request.payload.firstname,
				"lastname": request.payload.lastname,
				"username": request.payload.username,
				"email": request.payload.email,
				"password": request.payload.password,
				"mobile": request.payload.mobile,
				"gender": request.payload.gender,
				"business": request.payload.business,
				"isValid": false
			});
			ref.push(newUser, function async(error, userdata){
				if (err) {
					console.log(error)
					throw error
				}else{
						return resolve({
						statusCode: 200,
						message: "Operation successfully Completed",
						data: newUser
					});
				}
			})
		}
		return new Promise(pr)
	} 
},	
]
export default routes;