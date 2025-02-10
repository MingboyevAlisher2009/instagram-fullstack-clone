import CustomSwitch from "./components/custom-switch";
import Home from "./pages/home/page";
import SignIn from "./pages/auth/sign-in";
import SignUp from "./pages/auth/sign-up";
import { useQuery } from "@tanstack/react-query";
import axiosIntense from "./https/axios";
import { ReactNode } from "react";
import { useAppStore } from "./store";
import { Navigate, Route } from "react-router-dom";
import MainLayout from "./layout/main-layout";
import Explore from "./pages/explore/page";
import Reels from "./pages/reels/page";
import Direct from "./pages/direct/page";
import Profile from "./pages/profile/page";

const ProtectRoute = ({ children }: { children: ReactNode }) => {
  const { userInfo } = useAppStore();
  return userInfo ? children : <Navigate to={"/auth/login"} />;
};

const AuthRoute = ({ children }: { children: ReactNode }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to={"/"} /> : children;
};

const App = () => {
  const { setUserInfo } = useAppStore();
  const { isPending } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await axiosIntense.get("/auth/get-me");
      setUserInfo(data);
      return data;
    },
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <img className="w-24 h-24" src="/instagram.png" alt="" />
      </div>
    );
  }

  return (
    <CustomSwitch>
      <Route path="/auth/login" element={<AuthRoute children={<SignIn />} />} />
      <Route
        path="/auth/signup"
        element={<AuthRoute children={<SignUp />} />}
      />
      <Route element={<MainLayout />}>
        <Route path="/" element={<ProtectRoute children={<Home />} />} />
        <Route
          path="/explore"
          element={<ProtectRoute children={<Explore />} />}
        />
        <Route path="/reels" element={<ProtectRoute children={<Reels />} />} />
        <Route
          path="/direct"
          element={<ProtectRoute children={<Direct />} />}
        />
        <Route
          path="/:username"
          element={<ProtectRoute children={<Profile />} />}
        />
      </Route>
    </CustomSwitch>
  );
};

export default App;
