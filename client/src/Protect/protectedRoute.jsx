import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { setUser, setAllUsers,setAllChats } from '../redux/userSlice'


function ProtectRoute({ children }) {
  const navigate = useNavigate();
 
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state => state.userReducer))

  const dispatch = useDispatch()
  const getLoggedUser = async () => {
    try {

      const response = await fetch("http://localhost:3200/user/logedin", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      const result = await response.json();

      if (result.success) {
        dispatch(setUser(result.data));


      } else {
        toast.error(result.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message);
      navigate("/login");

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      getLoggedUser();
      getAllUsers();
      getAllChats()
    }
  }, [navigate]);

  if (loading) return <p>Loading...</p>;





  async function getAllUsers() {
    try {
      const response = await fetch("http://localhost:3200/user/alluser", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
      const result = await response.json();
      console.log(result)
      if (result.success) {
        dispatch(setAllUsers(result.data));
      } else {
        toast.error(result.message);
        navigate("/login");
      }

    } catch (error) {
      toast.error(error.message);
      navigate("/login");

    } finally {
      setLoading(false);
    }

  }
  async function getAllChats() {
    try {
      const response = await fetch("http://localhost:3200/chat/get-all-chats", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
      const result = await response.json();
      console.log(result)
      if (result.success) {
        dispatch(setAllChats(result.data));
      } else {
        toast.error(result.message);
        navigate("/login");
      }

    } catch (error) {
      toast.error(error.message);
      navigate("/login");

    } finally {
      setLoading(false);
    }

  }

  return (
    <Fragment>
      {/* {user && (
        <div>
          <p>
            Name: {user.firstname} {user.lastname}
          </p>
          <p>
            Email: {user.email}
          </p>
        </div>
      )} */}
      {children}
    </Fragment>
  );
}

export default ProtectRoute;
