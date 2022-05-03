

////first we are going to decreal variables to access data of that perticular innput field

const form = document.querySelector('form');
const inputName = document.querySelector('#name');
const inputEmail = document.querySelector('#email');
const inputPassword = document.querySelector('#password');
const submitBtn = document.querySelector('.submit');


///adding event listener to submit button
submitBtn.addEventListener('click', async (e)=>{
  // e.preventDefault();
/////getting values from const variables
const name = inputName.value;
const email = inputEmail.value;
const password = inputPassword.value;

console.log('its working');
console.log('name='+name)
console.log('email='+email)
console.log('password='+password)

    try {
      /*  function createNewProfile(profile) {
            const formData = new FormData();
            formData.append('first_name', profile.firstName);
            formData.append('last_name', profile.lastName);
            formData.append('email', profile.email);*/
        
          /*fetch('/api/v1/auth/register', {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: {name:name,email:email,password:password}
            }).then((response) => {return response}).catch(error =>{
                console.log(error)
            })*/
            //const result = await
            /*const data = await fetch('/api/v1/auth/register',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({name,email,password})})
                .then((response) => {return response}).catch(error =>{
                    console.log(error)
                })*/
       // await axios.post('http://localhost:7000/register', { name,email, password });
        console.log('axios post sucsesfull')
    } catch (error) {
           console.log('error='+error)        
    }
})
