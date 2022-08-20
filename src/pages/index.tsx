import type { NextPage } from "next";
import Head from "next/head";
import { ReactNode, useEffect, useRef, useState } from "react";

import {
  FiChevronDown,
  FiMessageSquare,
  FiMicOff,
  FiMonitor,
  FiMoreVertical,
  FiPhoneOff,
  FiSliders,
  FiTrash,
  FiUser,
  FiUsers,
  FiVideoOff,
} from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { useBestLayout } from "../use-best-layout";
import { User, useRandomUsers } from "../use-random-users";

const Home: NextPage = () => {
  const { users, removeUser, addUser: addUserFn } = useRandomUsers(5);
  const [isUsersListOpen, setIsUserListOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const videoContainer = useRef<HTMLDivElement>(null);

  const { layout, calculateLayout } = useBestLayout();

  const toggleDebugMode = () => setDebugMode((prev) => !prev);

  const addUser = () => {
    const sizes = videoContainer.current?.getBoundingClientRect();
    addUserFn();

    if (sizes) {
      calculateLayout({
        width: sizes.width,
        height: sizes.height,
        numOfVideos: users.length + 1,
      });
    }
  };

  const toggleUserList = () => {
    setIsUserListOpen((prev) => !prev);
    if (isChatOpen) return;

    const sizes = videoContainer.current?.getBoundingClientRect();
    if (sizes) {
      console.log({
        actual: sizes.width,
        futuro: sizes.width + (isUsersListOpen ? 300 : -300),
      });
      calculateLayout({
        width: sizes.width + (isUsersListOpen ? 300 : -300),
        height: sizes.height,
        numOfVideos: users.length,
      });
    }
  };

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
    if (isUsersListOpen) return;

    const sizes = videoContainer.current?.getBoundingClientRect();
    if (sizes) {
      console.log({
        actual: sizes.width,
        futuro: sizes.width + (isChatOpen ? 300 : -300),
      });
      calculateLayout({
        width: sizes.width + (isChatOpen ? 300 : -300),
        height: sizes.height,
        numOfVideos: users.length,
      });
    }
  };

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      calculateLayout({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
        numOfVideos: users.length,
      });
    });

    if (videoContainer.current) observer.observe(videoContainer.current);

    return () => observer.disconnect();
  }, [users.length, calculateLayout]);

  console.log(layout);

  return (
    <>
      <Head>
        <title>Pong.gg</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="h-screen w-screen flex-col bg-transparent">
        <main className="flex" style={{ height: "calc(100% - 70px)" }}>
          <section
            className="flex h-full w-full flex-col items-center justify-center"
            ref={videoContainer}
            style={{ border: debugMode ? "1px solid red" : "none" }}
          >
            {layout && (
              // <div className="absolute flex flex-wrap items-center justify-center">
              <div className="flex h-full w-full flex-wrap content-center items-center justify-center">
                {users.map((user) => (
                  <Video
                    onClick={() => removeUser(user.name)}
                    user={user}
                    key={user.name}
                    style={{
                      // display: isLayoutValid ? "block" : "none",
                      border: debugMode ? "1px solid green" : "none",
                      ...(layout.limitation === "width"
                        ? {
                            width: `${100 / layout.cols}%`,
                            maxHeight: `${100 / layout.rows}%`,
                          }
                        : {
                            height: `${100 / layout.rows}%`,
                            maxWidth: `${100 / layout.cols}%`,
                          }),
                    }}
                  />
                ))}
              </div>
            )}
          </section>
          {(isUsersListOpen || isChatOpen) && (
            <Menu
              users={users}
              isUsersListOpen={isUsersListOpen}
              isChatOpen={isChatOpen}
            />
          )}
        </main>
        <Navbar
          addUser={addUser}
          toggleDebugMode={toggleDebugMode}
          toggleUserList={toggleUserList}
          toggleChat={toggleChat}
        />
      </div>
      {/*  eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/black-texture-alt.jpeg"
        alt="background"
        className="absolute inset-0 h-screen w-screen object-cover"
        style={{ filter: "brightness(1.25) ", zIndex: -1 }}
      />
    </>
  );
};

const messagesList = ["Hello", "How are you?", "I am fine", "Thank you", "Bye"];

const Menu = ({
  users,
  isUsersListOpen,
  isChatOpen,
}: {
  users: User[];
  isUsersListOpen: boolean;
  isChatOpen: boolean;
}) => {
  const [messages] = useState(
    users.map((user) => ({
      user: user.name,
      text: messagesList[
        Math.floor(Math.random() * messagesList.length)
      ] as string,
    }))
  );

  return (
    <aside
      className="grid h-full flex-col gap-4 px-4 pt-4 pb-2"
      style={{
        gridTemplateRows: isUsersListOpen && isChatOpen ? "1fr 1fr" : "1fr",
        width: 300,
      }}
    >
      {isUsersListOpen && (
        <div className=" overflow-y-scroll rounded-lg border border-gray-700 bg-gray-800 text-white">
          <header className="flex items-center justify-between border-b border-gray-700 p-2">
            <h3>Users</h3>
            <FiMoreVertical />
          </header>
          <div className="flex flex-col  p-2">
            {users.map((user) => (
              <div
                key={user.name}
                className="flex items-center justify-between p-2"
              >
                <div className="flex items-center">
                  <span>{user.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {isChatOpen && (
        <div className=" overflow-y-scroll rounded-lg border border-gray-700 bg-gray-800 text-white">
          <header className="flex items-center justify-between border-b border-gray-700 p-2">
            <h3>Chat</h3>
            <FiMoreVertical />
          </header>
          <div className="flex flex-col overflow-y-auto p-2">
            {messages.map((message) => (
              <div
                key={message.user}
                className="flex items-center justify-between p-2"
              >
                <div className="flex items-center">
                  <span className="text-medium mr-2 text-gray-400">
                    {message.user}:{" "}
                  </span>
                  <span>{message.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

const Video = ({
  style,
  user,
  onClick,
}: {
  style?: { [key: string]: number | string };
  user: { name: string };
  onClick: () => void;
}) => {
  return (
    <div style={style} className="aspect-video p-2">
      <div className="relative flex h-full w-full items-center justify-center rounded-md bg-black">
        <FiMicOff className="absolute top-4 left-4 h-4 w-4 text-gray-300" />
        <div className="flex h-16 w-16 items-end justify-center overflow-hidden rounded-full bg-gray-600">
          <FiUser className="h-14 w-14 text-gray-300" />
        </div>
        <span className="absolute bottom-4 left-3 h-4 w-4 text-gray-300">
          {user.name}
        </span>
        <BaseButton
          onClick={onClick}
          className="absolute bottom-2 right-3 p-1 text-sm"
        >
          <FiTrash />
        </BaseButton>
      </div>
    </div>
  );
};

const Navbar = ({
  addUser,
  toggleDebugMode,
  toggleUserList,
  toggleChat,
}: {
  addUser: () => void;
  toggleDebugMode: () => void;
  toggleUserList: () => void;
  toggleChat: () => void;
}) => {
  return (
    <nav className="grid grid-cols-1 items-center justify-items-center gap-4 py-2 px-4 sm:grid-cols-2 md:grid-cols-3">
      <div className=" col-span-1 flex items-center gap-6 px-2 font-semibold text-gray-300 sm:col-span-2 md:col-span-1 md:justify-self-start">
        <span>Pong.gg</span>
        <BaseButton onClick={addUser} className="flex gap-2 py-1 px-2 text-sm">
          Add User
        </BaseButton>
      </div>
      <div className="flex gap-2">
        <div className="flex flex-nowrap">
          <BaseButton className="rounded-r-none">
            <FiMicOff />
          </BaseButton>
          <BaseButton className="rounded-l-none border-l-0">
            <FiChevronDown />
          </BaseButton>
        </div>
        <div className="flex flex-nowrap">
          <BaseButton className="rounded-r-none">
            <FiVideoOff />
          </BaseButton>
          <BaseButton className="rounded-l-none border-l-0">
            <FiChevronDown />
          </BaseButton>
        </div>
        <BaseButton>
          <FiMonitor />
        </BaseButton>
        <BaseButton className="border-red-600 bg-red-600 hover:border-red-700 hover:bg-red-700">
          <FiPhoneOff />
        </BaseButton>
      </div>
      <div className="flex gap-2 md:justify-self-end ">
        <BaseButton onClick={toggleUserList}>
          <FiUsers />
        </BaseButton>
        <BaseButton onClick={toggleChat}>
          <FiMessageSquare />
        </BaseButton>
        <BaseButton
          onClick={toggleDebugMode}
          className="tet flex gap-2 border-yellow-600 bg-yellow-600 text-sm hover:border-yellow-700 hover:bg-yellow-700"
        >
          <FiSliders />
          Hitboxes
        </BaseButton>
      </div>
    </nav>
  );
};

const BaseButton = ({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "relative inline-flex items-center rounded-md border border-gray-700 bg-gray-800 px-3 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-700 hover:text-gray-100",
        className
      )}
    >
      {children}
    </button>
  );
};

export default Home;
