import { useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollToTop() {
  const location = useLocation();

  // Disable browser's automatic scroll restoration once
  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Scroll to top on every navigation (key changes on PUSH, POP, REPLACE)
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.key]);

  return null;
}