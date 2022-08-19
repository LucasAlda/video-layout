import { useEffect, useState } from "react";
import Users from "../public/Users.json";

let USERS_GENERATED = false;

type User = {
  name: string;
};

export const useRandomUsers = (initialAmount: number) => {
  const [users, setUsers] = useState<User[]>([]);

  const addUser = () => {
    setUsers((prev) => {
      let user = Users[Math.floor(Math.random() * Users.length)] || {
        name: "Unknown",
      };
      while (prev.some((u) => u.name === user.name)) {
        user = Users[Math.floor(Math.random() * Users.length)] || {
          name: "Unknown",
        };
      }
      return [...prev, user];
    });
  };

  const removeUser = (name: string) => {
    setUsers((users) => users.filter((u) => u.name !== name));
  };

  useEffect(() => {
    if (typeof window !== "undefined" && !USERS_GENERATED) {
      USERS_GENERATED = true;
      Array(initialAmount - users.length)
        .fill(null)
        .forEach(addUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { users, addUser, removeUser };
};
