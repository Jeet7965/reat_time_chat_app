
import '../assets/css/form.css'
import { Link, useNavigate } from 'react-router';
import { singupUser } from '../apiCalls/auth.js';
import toast from 'react-hot-toast';


function Singup() {

const navigate=useNavigate();



  const [user, setUser] = useState({ firstname: '', lastname: '', email: '', password: '' });

  const handleSingupForm = async (event) => {
    event.preventDefault();
    try {

      const resp = await fetch("http://localhost:3200/api/singup", {
        method: 'Post',
        body: JSON.stringify(user),
        headers: { "Content-Type": "application/json" },
        credentials:"include"

      })
  
      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }
      const response = await resp.json();

      console.log("Success:", response);

      if (response.success) {
        toast.success(response.message);
        navigate('/')

      } else {
        toast.error(response.message || "Signup failed");
      }



    } catch (error) {


      toast.error(error.response?.data?.error || error.message);
    }

    // try {

    //   const response = await singupUser(user);
    //  if (response.success) {
    //     alert(response.message);
    //   } else {
    //     alert(response.error || "Signup failed");
    //   }
    // } catch (error) {
    //   console.error(error);
    //   alert(error.response?.data?.error || error.message);
    // }

  }

  return (


    <>
      <div className="main-container">
        <div className="container">

          <div className='card'>
            <div className='card-title'>
              <h1>Create Account</h1>
            </div>
            <div className="forms">
              <form onSubmit={handleSingupForm} >
                <div className="column">
                  <input type="text" onChange={(e) => setUser({ ...user, firstname: e.target.value })} name='firstname' placeholder="First Name" value={user.firstname} required />
                  <input type="text" onChange={(e) => setUser({ ...user, lastname: e.target.value })} name='lastname' placeholder="last Name" value={user.lastname} required />
                </div>
                <input type="email" onChange={(e) => setUser({ ...user, email: e.target.value })} name='email' placeholder="Email" value={user.email} required />
                <input type="password" onChange={(e) => setUser({ ...user, password: e.target.value })} name='password' placeholder="Password" value={user.password} required />
                <button type="submit" >Signup</button>
              </form>
            </div>
            <div className="card-items">
              <span>Already have an account <Link to='/login'>Login here</Link></span>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default Singup