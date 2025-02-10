"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Plus, User } from "lucide-react";

const stories = [
  {
    id: "your-story",
    username: "Your story",
    image: null,
    isYourStory: true,
  },
  ...Array.from({ length: 20 }).map((_, i) => ({
    id: `story-${i}`,
    username: `user${i}`,
    image: `/placeholder.svg?height=64&width=64`,
    watched: Math.random() > 0.5,
  })),
];

const Story = () => {
  return (
    <div className="relative lg:max-w-3xl w-[85%] px-1 mt-10 lg:mt-0 mx-auto">
      <Carousel
        opts={{
          align: "start",
          startIndex: 0,
        }}
        className="w-full"
      >
        <CarouselContent className="relative -ml-2 md:-ml-4">
          {stories.map((story) => (
            <CarouselItem
              key={story.id}
              className="pl-2 md:pl-4 basis-20 md:basis-24 cursor-pointer"
            >
              <div className="flex flex-col items-center gap-1">
                <div className="relative">
                  {story.isYourStory ? (
                    <div className="relative">
                      <Avatar className="w-16 h-16 border-2 border-background">
                        <AvatarImage src="/placeholder.svg?height=64&width=64" />
                        <AvatarFallback>
                          <User className="w-6 h-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center border-2 border-background">
                        <Plus className="w-4 h-4" />
                      </div>
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "rounded-full p-[2px]",
                        !story.watched
                          ? "bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500"
                          : "bg-muted"
                      )}
                    >
                      <Avatar className="w-16 h-16 border-2 border-background">
                        <AvatarImage src={story.image} />
                        <AvatarFallback>
                          <User className="w-6 h-6" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </div>
                <span className="text-xs truncate w-16 text-center">
                  {story.username}
                </span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex z-50 left-3 bg-background/50 hover:bg-background/75 border-0" />
        <CarouselNext className="hidden md:flex z-50 right-3 bg-background/50 hover:bg-background/75 border-0" />
      </Carousel>
    </div>
  );
};

export default Story;
