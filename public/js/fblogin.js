function makefblogin(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }
  makefblogin(document, 'script', 'facebook-jssdk');


  window.fbAsyncInit = function() {
    FB.init({
      appId      : '455087256201946',
      cookie     : true,
      xfbml      : true,
      version    : 'v12.0'
    });
      
  //  FB.AppEvents.logPageView();   
    
FB.getLoginStatus(function(response) {
      if (responce.status === 'connected'){
       console.log("user get logged in.")
     }else{
       console.log("user not found.")
     }
    
});  
  };