import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router";

function ProtectRoute({ children }) {
  const navigate = useNavigate();
  const [userdata, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getLoggedUser = async () => {
    try {
      const response = await fetch("http://localhost:3200/user/logedin", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      const result = await response.json();

      if (result.success) {
        setUserData(result.data);
      } else {
        navigate("/login");
      }
    } catch (error) {
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
    }
  }, [navigate]);

  if (loading) return <p>Loading...</p>;

  return (
    <Fragment>
      {userdata && (
       <div>
         <p>
          Name: {userdata.firstname} {userdata.lastname}
        </p>
         <p>
          Email: {userdata.email}
        </p>
       </div>
      )}
      {children}
    </Fragment>
  );
}

export default ProtectRoute;
