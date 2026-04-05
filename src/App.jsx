import { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { initialTransactions } from "./data/Data";
import { setRole, setTransactions } from "./store/reducer/TransactionSlice";
import ReactLenis from "lenis/react";
import MainRoutes from "./routes/MainRoutes";
import { useLocation } from "react-router-dom";

const App = () => {
  const dispatch = useDispatch();
  const transaction = useSelector((state) => state?.transaction?.transactions);
  const {pathname} = useLocation()

  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname])


  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("transactions")) || [];

    if (data.length === 0) {
      localStorage.setItem("transactions", JSON.stringify(initialTransactions));
      data = initialTransactions;
    }

    dispatch(setTransactions(data));

    const savedRole = localStorage.getItem("role") || "viewer";
    dispatch(setRole(savedRole));
  }, []);

  useEffect(() => {
    if (transaction) {
      localStorage.setItem("transactions", JSON.stringify(transaction));
    }
  }, [transaction]);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.07,
        smoothWheel: true,
      }}
    >
      <Navbar
        dark={dark}
        onThemeToggle={() => setDark((d) => !d)}
      />

      <MainRoutes />
    </ReactLenis>
  );
};

export default App;
