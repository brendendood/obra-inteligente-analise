
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar para a nova landing page
    navigate("/", { replace: true });
  }, [navigate]);

  return null;
};

export default Index;
