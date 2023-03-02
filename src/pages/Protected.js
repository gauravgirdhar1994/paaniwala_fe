import { Navigate } from "react-router-dom";

const Protected = ({ isLoggedIn, children }) => {
// eslint-disable-next-line no-irregular-whitespace
  if (!isLoggedIn) {
// eslint-disable-next-line no-irregular-whitespace
    return <Navigate to="/login" replace />;
// eslint-disable-next-line no-irregular-whitespace
  }
// eslint-disable-next-line no-irregular-whitespace
  return children;
};
export default Protected;