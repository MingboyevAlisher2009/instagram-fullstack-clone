import { cn } from "@/lib/utils";
import {
  Compass,
  Heart,
  Home,
  Instagram,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  Settings,
  UserCircle,
  Video,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type React from "react";
import { Link } from "react-router-dom";
import { InstagramLogo } from "@/components/instagram-logo";

const items = [
  {
    icon: Home,
    path: "/",
    label: "Home",
    isMobile: true,
  },
  {
    icon: Search,
    label: "Search",
    isOpen: true,
    isMobile: true,
  },
  {
    icon: Compass,
    path: "/explore",
    label: "Explore",
  },
  {
    icon: Video,
    path: "/reels",
    label: "Reels",
    isMobile: true,
  },
  {
    icon: MessageCircle,
    path: "/direct",
    label: "Messages",
    isMobile: true,
  },
  {
    icon: Heart,
    label: "Notifications",
    isOpen: true,
  },
  {
    icon: UserCircle,
    path: "/profile",
    label: "Profile",
    isMobile: true,
  },
];

const mockNotifications = [
  {
    id: 1,
    user: "John Doe",
    userAvatar: "/john-doe.jpg",
    timestamp: "1 hour ago",
    type: "like",
    postImage: "/post-image.jpg",
    read: false,
  },
  {
    id: 2,
    user: "Jane Doe",
    userAvatar: "/jane-doe.jpg",
    timestamp: "2 hours ago",
    type: "follow",
    read: true,
  },
  {
    id: 3,
    user: "Peter Jones",
    userAvatar: "/peter-jones.jpg",
    timestamp: "3 hours ago",
    type: "comment",
    read: false,
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isOpenNotif, setisOpenNotif] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = window.location.pathname;
  const notificationRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickedInSearch = searchRef.current?.contains(target);
      const clickedInNotif = notificationRef.current?.contains(target);

      if (!clickedInSearch && !clickedInNotif) {
        setIsMobileOpen(false);
        setisOpenNotif(false);
        setIsOpen(true);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 hidden h-screen border-r border-border bg-background transition-all duration-300 lg:block",
          isOpen ? "w-[245px]" : "w-[73px]"
        )}
      >
        <div className="flex h-full flex-col gap-8 p-3">
          <div className="flex items-center justify-between px-3 py-4">
            {isOpen ? (
              <Link to="/" className="text-2xl text-foreground">
                <InstagramLogo />
              </Link>
            ) : (
              <Link to="/" className="px-1">
                <Instagram />
              </Link>
            )}
          </div>

          <nav className="flex flex-1 flex-col gap-1" role="navigation">
            {items.map((item) => {
              if (item.isOpen) {
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.label === "Search"
                        ? setIsMobileOpen(true)
                        : setisOpenNotif(true);
                      setIsOpen(false);
                    }}
                    aria-label={item.label}
                    className={cn(
                      "group flex h-12 items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                      ((item.label === "Search" && isMobileOpen) ||
                        (item.label === "Notifications" && isOpenNotif)) &&
                        "bg-accent text-accent-foreground",
                      isOpen ? "w-full justify-start" : "w-fit justify-center"
                    )}
                  >
                    <item.icon className="h-6 w-6 shrink-0" />
                    {isOpen && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </button>
                );
              }
              return (
                <Link
                  key={item.label}
                  to={item.path ? item.path : pathname}
                  className={cn(
                    "group flex h-12 items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                    (item.label !== "Search" && isMobileOpen) ||
                      (item.label !== "Notifications" &&
                        isOpenNotif &&
                        item.path &&
                        item.path === pathname &&
                        "bg-accent text-accent-foreground"),
                    isOpen ? "w-full justify-start" : "w-fit justify-center"
                  )}
                >
                  <item.icon className="h-6 w-6 shrink-0" />
                  {isOpen && <span className="font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-col gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "group flex h-12 gap-4 px-3 py-2",
                    isOpen ? "w-full justify-start" : "w-fit justify-center"
                  )}
                >
                  <Menu className="h-6 w-6 shrink-0" />
                  {isOpen && <span className="font-medium">More</span>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[200px] border-none bg-[#262626] rounded-lg"
              >
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      <div className="fixed top-0 left-0 z-10 w-full flex justify-between items-center border-b p-4 border-border bg-background lg:hidden">
        <Link to="/" className="text-foreground">
          <svg
            aria-label="Instagram"
            className="text-foreground"
            fill="currentColor"
            height="25"
            role="img"
            viewBox="32 4 113 32"
            width="150"
          >
            <path
              clipRule="evenodd"
              d="M37.82 4.11c-2.32.97-4.86 3.7-5.66 7.13-1.02 4.34 3.21 6.17 3.56 5.57.4-.7-.76-.94-1-3.2-.3-2.9 1.05-6.16 2.75-7.58.32-.27.3.1.3.78l-.06 14.46c0 3.1-.13 4.07-.36 5.04-.23.98-.6 1.64-.33 1.9.32.28 1.68-.4 2.46-1.5a8.13 8.13 0 0 0 1.33-4.58c.07-2.06.06-5.33.07-7.19 0-1.7.03-6.71-.03-9.72-.02-.74-2.07-1.51-3.03-1.1Zm82.13 14.48a9.42 9.42 0 0 1-.88 3.75c-.85 1.72-2.63 2.25-3.39-.22-.4-1.34-.43-3.59-.13-5.47.3-1.9 1.14-3.35 2.53-3.22 1.38.13 2.02 1.9 1.87 5.16ZM96.8 28.57c-.02 2.67-.44 5.01-1.34 5.7-1.29.96-3 .23-2.65-1.72.31-1.72 1.8-3.48 4-5.64l-.01 1.66Zm-.35-10a10.56 10.56 0 0 1-.88 3.77c-.85 1.72-2.64 2.25-3.39-.22-.5-1.69-.38-3.87-.13-5.25.33-1.78 1.12-3.44 2.53-3.44 1.38 0 2.06 1.5 1.87 5.14Zm-13.41-.02a9.54 9.54 0 0 1-.87 3.8c-.88 1.7-2.63 2.24-3.4-.23-.55-1.77-.36-4.2-.13-5.5.34-1.95 1.2-3.32 2.53-3.2 1.38.14 2.04 1.9 1.87 5.13Zm61.45 1.81c-.33 0-.49.35-.61.93-.44 2.02-.9 2.48-1.5 2.48-.66 0-1.26-1-1.42-3-.12-1.58-.1-4.48.06-7.37.03-.59-.14-1.17-1.73-1.75-.68-.25-1.68-.62-2.17.58a29.65 29.65 0 0 0-2.08 7.14c0 .06-.08.07-.1-.06-.07-.87-.26-2.46-.28-5.79 0-.65-.14-1.2-.86-1.65-.47-.3-1.88-.81-2.4-.2-.43.5-.94 1.87-1.47 3.48l-.74 2.2.01-4.88c0-.5-.34-.67-.45-.7a9.54 9.54 0 0 0-1.8-.37c-.48 0-.6.27-.6.67 0 .05-.08 4.65-.08 7.87v.46c-.27 1.48-1.14 3.49-2.09 3.49s-1.4-.84-1.4-4.68c0-2.24.07-3.21.1-4.83.02-.94.06-1.65.06-1.81-.01-.5-.87-.75-1.27-.85-.4-.09-.76-.13-1.03-.11-.4.02-.67.27-.67.62v.55a3.71 3.71 0 0 0-1.83-1.49c-1.44-.43-2.94-.05-4.07 1.53a9.31 9.31 0 0 0-1.66 4.73c-.16 1.5-.1 3.01.17 4.3-.33 1.44-.96 2.04-1.64 2.04-.99 0-1.7-1.62-1.62-4.4.06-1.84.42-3.13.82-4.99.17-.8.04-1.2-.31-1.6-.32-.37-1-.56-1.99-.33-.7.16-1.7.34-2.6.47 0 0 .05-.21.1-.6.23-2.03-1.98-1.87-2.69-1.22-.42.39-.7.84-.82 1.67-.17 1.3.9 1.91.9 1.91a22.22 22.22 0 0 1-3.4 7.23v-.7c-.01-3.36.03-6 .05-6.95.02-.94.06-1.63.06-1.8 0-.36-.22-.5-.66-.67-.4-.16-.86-.26-1.34-.3-.6-.05-.97.27-.96.65v.52a3.7 3.7 0 0 0-1.84-1.49c-1.44-.43-2.94-.05-4.07 1.53a10.1 10.1 0 0 0-1.66 4.72c-.15 1.57-.13 2.9.09 4.04-.23 1.13-.89 2.3-1.63 2.3-.95 0-1.5-.83-1.5-4.67 0-2.24.07-3.21.1-4.83.02-.94.06-1.65.06-1.81 0-.5-.87-.75-1.27-.85-.42-.1-.79-.13-1.06-.1-.37.02-.63.35-.63.6v.56a3.7 3.7 0 0 0-1.84-1.49c-1.44-.43-2.93-.04-4.07 1.53-.75 1.03-1.35 2.17-1.66 4.7a15.8 15.8 0 0 0-.12 2.04c-.3 1.81-1.61 3.9-2.68 3.9-.63 0-1.23-1.21-1.23-3.8 0-3.45.22-8.36.25-8.83l1.62-.03c.68 0 1.29.01 2.19-.04.45-.02.88-1.64.42-1.84-.21-.09-1.7-.17-2.3-.18-.5-.01-1.88-.11-1.88-.11s.13-3.26.16-3.6c.02-.3-.35-.44-.57-.53a7.77 7.77 0 0 0-1.53-.44c-.76-.15-1.1 0-1.17.64-.1.97-.15 3.82-.15 3.82-.56 0-2.47-.11-3.02-.11-.52 0-1.08 2.22-.36 2.25l3.2.09-.03 6.53v.47c-.53 2.73-2.37 4.2-2.37 4.2.4-1.8-.42-3.15-1.87-4.3-.54-.42-1.6-1.22-2.79-2.1 0 0 .69-.68 1.3-2.04.43-.96.45-2.06-.61-2.3-1.75-.41-3.2.87-3.63 2.25a2.61 2.61 0 0 0 .5 2.66l.15.19c-.4.76-.94 1.78-1.4 2.58-1.27 2.2-2.24 3.95-2.97 3.95-.58 0-.57-1.77-.57-3.43 0-1.43.1-3.58.19-5.8.03-.74-.34-1.16-.96-1.54a4.33 4.33 0 0 0-1.64-.69c-.7 0-2.7.1-4.6 5.57-.23.69-.7 1.94-.7 1.94l.04-6.57c0-.16-.08-.3-.27-.4a4.68 4.68 0 0 0-1.93-.54c-.36 0-.54.17-.54.5l-.07 10.3c0 .78.02 1.69.1 2.09.08.4.2.72.36.91.15.2.33.34.62.4.28.06 1.78.25 1.86-.32.1-.69.1-1.43.89-4.2 1.22-4.31 2.82-6.42 3.58-7.16.13-.14.28-.14.27.07l-.22 5.32c-.2 5.37.78 6.36 2.17 6.36 1.07 0 2.58-1.06 4.2-3.74l2.7-4.5 1.58 1.46c1.28 1.2 1.7 2.36 1.42 3.45-.21.83-1.02 1.7-2.44.86-.42-.25-.6-.44-1.01-.71-.23-.15-.57-.2-.78-.04-.53.4-.84.92-1.01 1.55-.17.61.45.94 1.09 1.22.55.25 1.74.47 2.5.5 2.94.1 5.3-1.42 6.94-5.34.3 3.38 1.55 5.3 3.72 5.3 1.45 0 2.91-1.88 3.55-3.72.18.75.45 1.4.8 1.96 1.68 2.65 4.93 2.07 6.56-.18.5-.69.58-.94.58-.94a3.07 3.07 0 0 0 2.94 2.87c1.1 0 2.23-.52 3.03-2.31.09.2.2.38.3.56 1.68 2.65 4.93 2.07 6.56-.18l.2-.28.05 1.4-1.5 1.37c-2.52 2.3-4.44 4.05-4.58 6.09-.18 2.6 1.93 3.56 3.53 3.69a4.5 4.5 0 0 0 4.04-2.11c.78-1.15 1.3-3.63 1.26-6.08l-.06-3.56a28.55 28.55 0 0 0 5.42-9.44s.93.01 1.92-.05c.32-.02.41.04.35.27-.07.28-1.25 4.84-.17 7.88.74 2.08 2.4 2.75 3.4 2.75 1.15 0 2.26-.87 2.85-2.17l.23.42c1.68 2.65 4.92 2.07 6.56-.18.37-.5.58-.94.58-.94.36 2.2 2.07 2.88 3.05 2.88 1.02 0 2-.42 2.78-2.28.03.82.08 1.49.16 1.7.05.13.34.3.56.37.93.34 1.88.18 2.24.11.24-.05.43-.25.46-.75.07-1.33.03-3.56.43-5.21.67-2.79 1.3-3.87 1.6-4.4.17-.3.36-.35.37-.03.01.64.04 2.52.3 5.05.2 1.86.46 2.96.65 3.3.57 1 1.27 1.05 1.83 1.05.36 0 1.12-.1 1.05-.73-.03-.31.02-2.22.7-4.96.43-1.79 1.15-3.4 1.41-4 .1-.21.15-.04.15 0-.06 1.22-.18 5.25.32 7.46.68 2.98 2.65 3.32 3.34 3.32 1.47 0 2.67-1.12 3.07-4.05.1-.7-.05-1.25-.48-1.25Z"
              fill="currentColor"
              fillRule="evenodd"
            ></path>
          </svg>
        </Link>
        <Button onClick={() => setisOpenNotif(!isOpenNotif)} variant={"ghost"}>
          <Heart />
        </Button>
      </div>

      <div className="fixed bottom-0 left-0 z-50 w-full border-t border-border bg-background lg:hidden">
        <nav className="flex h-16 items-center justify-around px-4">
          {items.map((item) => {
            if (!item.isMobile) return;
            if (item.isOpen) {
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    item.label === "Search"
                      ? setIsMobileOpen(true)
                      : setisOpenNotif(true);
                    setIsOpen(false);
                  }}
                  aria-label={item.label}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                    ((item.label === "Search" && isMobileOpen) ||
                      (item.label === "Notifications" && isOpenNotif)) &&
                      "bg-accent text-accent-foreground"
                  )}
                >
                  <item.icon className="h-6 w-6 shrink-0" />
                </button>
              );
            }
            return (
              <Link
                key={item.label}
                to={item.path ? item.path : pathname}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  ((item.label !== "Search" && isMobileOpen) ||
                    (item.label !== "Notifications" && isOpenNotif)) &&
                    item.path &&
                    item.path === pathname &&
                    "bg-accent text-accent-foreground"
                )}
              >
                <item.icon className="h-6 w-6" />
              </Link>
            );
          })}
        </nav>
      </div>

      <SearchPanel
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        searchRef={searchRef}
      />

      <NotifPanel
        isOpenNotif={isOpenNotif}
        setisOpenNotif={setisOpenNotif}
        notificationRef={notificationRef}
        mockNotifications={mockNotifications}
      />
    </>
  );
}

interface SearchPanelProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (value: boolean) => void;
  searchRef: React.RefObject<HTMLDivElement>;
}

const SearchPanel = ({
  isMobileOpen,
  setIsMobileOpen,
  searchRef,
}: SearchPanelProps) => {
  return (
    <div
      ref={searchRef}
      className={cn(
        "fixed border-r w-0 rounded-t-lg z-20 bg-background rounded-b-lg h-screen inset-0 transition-all duration-300",
        isMobileOpen && "w-full lg:w-[30rem]"
      )}
    >
      <div className={cn("mt-4 p-4 lg:pl-24 hidden", isMobileOpen && "block")}>
        <div className="space-y-4 pb-4 border-b border-border">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Search</h1>
            <Button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden"
              variant="ghost"
            >
              <X />
            </Button>
          </div>
          <Input placeholder="Search" className="pl-9 bg-secondary border-0" />
        </div>
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="flex flex-col p-6">
            <p className="text-sm text-muted-foreground">Recent searches</p>
            <p className="text-sm text-center text-muted-foreground mt-6">
              No recent searches.
            </p>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

interface NotifPanelProps {
  isOpenNotif: boolean;
  setisOpenNotif: (value: boolean) => void;
  notificationRef: React.RefObject<HTMLDivElement>;
  mockNotifications: any[];
}

const NotifPanel = ({
  isOpenNotif,
  setisOpenNotif,
  notificationRef,
  mockNotifications,
}: NotifPanelProps) => {
  return (
    <div
      ref={notificationRef}
      className={cn(
        "fixed border-r w-0 rounded-t-lg z-50 lg:z-10 bg-background rounded-b-lg h-screen inset-0 transition-all duration-300",
        isOpenNotif && "w-full lg:w-[30rem]"
      )}
    >
      <div className={cn("mt-4 p-4 lg:pl-24 hidden", isOpenNotif && "block")}>
        <div className="space-y-4 pb-4 border-b border-border">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Notifications</h1>
            <Button
              onClick={() => setisOpenNotif(false)}
              className="lg:hidden"
              variant="ghost"
            >
              <X />
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="flex flex-col p-6">
            {mockNotifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "flex items-center p-4 rounded-lg",
                  !notification.read && "bg-accent"
                )}
              >
                <img
                  src={notification.userAvatar || "/placeholder.svg"}
                  alt={notification.user}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">{notification.user}</span>
                    {notification.type === "like" && " liked your post"}
                    {notification.type === "comment" &&
                      " commented on your post"}
                    {notification.type === "follow" && " started following you"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {notification.timestamp}
                  </p>
                </div>
                {notification.postImage && (
                  <img
                    src={notification.postImage || "/placeholder.svg"}
                    alt="Post"
                    className="w-10 h-10 rounded-lg"
                  />
                )}
                {notification.type === "follow" && (
                  <Button variant="outline" className="ml-4">
                    Follow Back
                  </Button>
                )}
              </div>
            ))}
            <Button variant="ghost" className="w-full mt-4">
              Load More
            </Button>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
