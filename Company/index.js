const pg = require('pg');
const express = require('express');
var cors = require('cors');
const app =  express();
app.use(cors())

const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');
var Strquery,GraphResult ;

const Config = require('../Configuration/Configuration.js');
console.log(Config);

const schema = buildSchema(`
type Query{
	companies(Id:Int): [BusinessCompany]
}

type BusinessCompany{
	Id: Int
	Code: String
	Code01: String
	Id_Company: Int
	BusinessType: Int
	Name: String
	Description: String
	Start_Week: Int
	End_Week: Int
	Start_Day: Int
	Legal_Name: String
	Country: Int
	State: Int
	Region: Int
	City: Int
	Id_Parent: Int
	IsActive: Int
	User_Created: Int
	User_Updated: Int
	Date_Created: String
	Date_Updated: String
	ImageURL: String
}
`);



let companies = (args) => {
	try {

			if (args.Id)
    		{
    			Strquery = 'select * from public."BusinessCompany" where "Id" = '+ args.Id
    		}
    	    else{Strquery = 'select * from public."BusinessCompany"';}

			var client = new pg.Client(Config); 
			client.connect(err => {
				console.log("error 1 ",err);
			         if (err) {
			         	console.log("se sale ",err);
			             console.log(err);
			             return;
			         }
			         client.query(Strquery, (err, data) => {
			             console.log("entra a la query ");
			             if (err) {
			             	console.log("error 2 ",err);
			                 console.log(err);
			             } else {

			             	console.log("Resolvio query");
			             	console.log("data ",data.rows);
			                   GraphResult = data.rows;
			                   return GraphResult;
			             }
			             return GraphResult;
			             client.end();
			         });
			     });
		console.log("Retornar data ",Strquery);
  		return GraphResult;
		} catch (err) {console.log(err);}
};
/*let companies = (args) => (async function () {
    	try {
   			if (args.Id)
    		{Strquery = 'select * from public."BusinessCompany" where "Id" = '+ args.Id}
    	    else{ Strquery = 'select * from public."BusinessCompany"';}

			var client = new pg.Client(Config); 
			client.connect(function(err,client,done) {
			      if(err) {
			         console.error('could not connect to postgres', err);
			      }
			     	   client.query(Strquery, function(err,result) {
			     	   	GraphResult = result.rows;

			           if(err){
			               console.log(err);
			           }else{
			            GraphResult = result.rows;
			           }
			          client.end();
			       });
			    });
		return GraphResult;
    } catch (err) {
       console.log(err);
    }
})();*/




const root = {
companies: companies,
}

app.use('/graphql',express_graphql({
	schema: schema,
	rootValue: root,
    graphiql:true,
}));

app.listen(3000, function () {
    console.log('Server is running.. on Port 3000');
});
