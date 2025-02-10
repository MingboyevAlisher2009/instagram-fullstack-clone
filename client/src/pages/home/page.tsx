import { useAppStore } from "@/store";
import Story from "./components/story";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BASE_URL } from "@/https/api";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Contents from "./components/contents";
import { Button } from "@/components/ui/button";

const suggestedUsers = [
  {
    username: "photography_lover",
    fullName: "Photography Enthusiast",
    image: "/placeholder.svg?height=32&width=32",
  },
  {
    username: "travel_adventures",
    fullName: "Travel Adventures",
    image: "/placeholder.svg?height=32&width=32",
  },
  {
    username: "food_blogger",
    fullName: "Food & Cuisine",
    image: "/placeholder.svg?height=32&width=32",
  },
  {
    username: "fitness_guru",
    fullName: "Fitness & Wellness",
    image: "/placeholder.svg?height=32&width=32",
  },
  {
    username: "art_gallery",
    fullName: "Art & Design",
    image: "/placeholder.svg?height=32&width=32",
  },
];

const Home = () => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-center gap-8 mt-10 px-4">
      <div className="max-w-3xl flex-1">
        <Story />
        <Contents />
      </div>

      <div className="w-[320px] flex-shrink-0 hidden lg:block">
        <div
          onClick={() => navigate(`/${userInfo?.username}`)}
          className="flex items-center gap-4 mt-2 cursor-pointer"
        >
          <Avatar className="w-12 h-12">
            <AvatarImage src={`${BASE_URL}/${userInfo?.image}`} />
            <AvatarFallback>
              <User className="w-6 h-6" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{userInfo?.username}</h3>
            <p className="text-sm text-muted-foreground">
              {userInfo?.fullName}
            </p>
          </div>
          <Button variant="link" className="text-xs font-semibold">
            Switch
          </Button>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-muted-foreground">
              Suggested for you
            </span>
            <Button variant="link" className="text-xs font-semibold">
              See All
            </Button>
          </div>

          <div className="space-y-4">
            {suggestedUsers.map((user) => (
              <div key={user.username} className="flex items-center gap-4">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.image} />
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">{user.username}</h4>
                  <p className="text-xs text-muted-foreground">
                    {user.fullName}
                  </p>
                </div>
                <Button
                  variant="link"
                  className="text-xs font-semibold text-blue-500"
                >
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
