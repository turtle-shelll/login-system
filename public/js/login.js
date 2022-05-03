


//intializing variables to get values
const form = document.querySelector('form');
const inputEmail = document.querySelector('#email');
const inputPassword = document.querySelector('#password');
const submitBtn = document.querySelector('.submit');



form.addEventListener('submit',async (e)=>{
//    e.preventDefault();
    ///getting value of input fields 
    const email = inputEmail.value;
    const password = inputPassword.value;

    console.log('email='+email);
    console.log('password='+password);

    try {
//    const data = await fetch('/login',{
//             method:'POST',
//             headers:{
//                 'Content-Type':'application/json'
//             },
//             body: JSON.stringify({email,password})
//         })
//         localStorage.setItem('Token', 'Bearer ')
    //    const {data} = await axios.post('https://localhost:7443/api/v1/auth/login',{email,password})
       const {data} = await axios.post('/api/v1/auth/login',{email,password})
    //   const data1 = data.json();
    //   const data1 = JSON.parse('data');
    //    const data1 = JSON.parse(data);
       console.log('data='+data)
       const data2 = JSON.stringify(data);
      console.log('data='+data2)
    //    console.log('data='+data1)
       console.log('succesfull')
    } catch (error) {
        console.log('error='+error);
    }
})
