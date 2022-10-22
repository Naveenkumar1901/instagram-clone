import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentuser"));
    console.log("app error");
    if (user) navigate("/home");
    else navigate("/login");
  }, [navigate]);

  return;
};

export default App;
