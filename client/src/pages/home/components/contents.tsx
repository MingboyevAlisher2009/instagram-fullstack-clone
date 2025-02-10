"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Bookmark,
  Send,
  User,
  SendIcon,
} from "lucide-react";

const mockPosts = [
  {
    id: 1,
    user: {
      username: "johndoe",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    image: "/placeholder.svg?height=600&width=600",
    likes: 1234,
    caption: "Beautiful sunset at the beach! 🌅 #sunset #beach #vacation",
    comments: 42,
    timestamp: "2h",
  },
  {
    id: 2,
    user: {
      username: "janedoe",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    image: "/placeholder.svg?height=600&width=600",
    likes: 856,
    caption: "Perfect morning with perfect coffee ☕️ #coffee #morning",
    comments: 23,
    timestamp: "4h",
  },
];

const Contents = () => {
  return (
    <div className="max-w-xl space-y-4 my-8 mx-auto">
      {mockPosts.map((post) => (
        <article key={post.id} className="bg-background rounded-lg">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={post.user.avatar} />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold text-sm">
                {post.user.username}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Unfollow</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="relative aspect-square">
            <img
              src={post.image || "/logo.png"}
              alt="Post"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Heart className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MessageCircle className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Send className="w-6 h-6" />
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bookmark className="w-6 h-6" />
              </Button>
            </div>

            <div className="space-y-1">
              <p className="font-semibold text-sm">
                {post.likes.toLocaleString()} likes
              </p>
              <p className="text-sm">
                <span className="font-semibold">{post.user.username}</span>{" "}
                {post.caption}
              </p>
              <button className="text-muted-foreground text-sm">
                View all {post.comments} comments
              </button>
              <p className="text-xs text-muted-foreground uppercase">
                {post.timestamp}
              </p>
            </div>
            <div className="flex-1 flex">
              <input
              placeholder="Add comment"
                className="bg-background outline-none border-none w-full"
                type="text"
              />
              <Button variant={"ghost"}>
                <SendIcon />
              </Button>
            </div>
              <Separator />
          </div>
        </article>
      ))}
    </div>
  );
};

export default Contents;
