var request = require('request');

var url='http://api.bigoven.com/recipes';

var data = {
  pg:1,   //page num
  rpp:25,  //request per page
  title_kw:'lasagna',
  api_key:process.env.BIGOVEN_KEY
};

request(
  {
    url:url,
    qs:data,
    headers:{
      'Accept':'application/json'
    }
  },function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var searchData = JSON.parse(body);
    console.log('body',searchData.ResultCount);
    searchData.Results.forEach(function(result){
      console.log(result);
    });
  }else{
    console.log('error',error,response);
  }
});