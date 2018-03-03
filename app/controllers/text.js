var mongoose = require('mongoose');
var express = require('express');
mongoose.Promise = require('bluebird');
var request = require('request');

// express router // used to define routes 
var textRouter  = express.Router();
var responseGenerator = require('./../../libs/responseGenerator');


module.exports.controllerFunction = function(app) {

    //Login Screen
    textRouter.get('/',function(req,res){
          
        request.get('https://shielded-headland-24739.herokuapp.com/static/users.txt', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var json = body;
                json = json.replace(/=/g, ":");
                json = json.replace(/&/g, "/,/");
                json = json.replace(/([^,]*)(,|$)/g,'$1"$2');
                json = json.replace(/:/g, '":"');
                json = json.split(',/').join(',"');
                json = json.split('/"').join('"');
                json = json.split('", ').join(' ');
                json = json.replace(/""/g, "");
                var finalJson = json.split('|');
                var string = "";
                for(var i=0;i<finalJson.length;i++)
                {
                    if(i != finalJson.length - 1)
                        string = string + "{"+'"' + finalJson[i] + '"' + "},";
                    else
                        string = string + "{"+'"' + finalJson[i] + '"' + "}";
                }
                string = '[' + string + ']';
                var finalJson1 = JSON.parse(string);
                var companies=[];
                var universities=[];
                for (var i = 0; i < finalJson1.length; i++) {
                    if(companies.indexOf(finalJson1[i].companyName) == -1)
                    {
                        companies.push(finalJson1[i].companyName);
                    }
                    if(universities.indexOf(finalJson1[i].university) == -1)
                    {
                        universities.push(finalJson1[i].university);
                    }                  
                }
                var myResponse = responseGenerator.generate(false,"Fetched text file",200,finalJson1);
                res.render('home',{data : myResponse.data,companies : companies,universities : universities});
            }
            else{
                var myResponse = responseGenerator.generate(true,"Some Error Occurred",500,null);
                res.render('error',{error : myResponse});
            }
        }); 

    });//end get login screen


    //name api
    app.use('/', textRouter);



 
};//end contoller code
