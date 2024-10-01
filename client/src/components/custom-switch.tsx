import { useEffect, useState } from "react";
import { Routes, useLocation } from "react-router-dom";
import TopBarProgress from "react-topbar-progress-indicator";

const CustomSwitch = ({ children }: any) => {
  const [progress, setProgress] = useState(false);
  const [prevLoc, setPrevLoc] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== prevLoc) {
      setProgress(true);
      setPrevLoc(location.pathname);
    }
  }, [location, prevLoc]);

  useEffect(() => {
    if (progress) {
      const timeout = setTimeout(() => {
        setProgress(false);
      }, 500); // Progress barni 0.5 soniya davomida ko'rsatish

      return () => clearTimeout(timeout);
    }
  }, [progress]);

  return (
    <>
      {progress && <TopBarProgress />}
      <Routes>{children}</Routes>
    </>
  );
};

export default CustomSwitch;
