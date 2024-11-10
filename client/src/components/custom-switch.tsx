import { useEffect, useState } from "react";
import { Routes, useLocation } from "react-router-dom";
import TopBarProgress from "react-topbar-progress-indicator";

// Instagram-style progress bar configuration
TopBarProgress.config({
  barColors: {
    0: "#ff9f43",
    0.5: "#f368e0",
    1: "#ee5253",
  },

  shadowBlur: 5,
  barThickness: 5,
});

const CustomSwitch = ({ children }: any) => {
  const [progress, setProgress] = useState(false);
  const [prevLoc, setPrevLoc] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== prevLoc) {
      setProgress(true);
      setPrevLoc(location.pathname);
    }

    if (location.pathname === prevLoc) {
      setProgress(false);
      setPrevLoc(location.pathname);
    }
  }, [location, prevLoc]);

  return (
    <>
      {progress && <TopBarProgress />}
      <Routes>{children}</Routes>
    </>
  );
};

export default CustomSwitch;
