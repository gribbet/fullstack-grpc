import * as React from "react";
import { FC, useCallback, useEffect, useState } from "react";
import { userService } from ".";
import { User } from "./api";

const randomString = () => Math.random().toString(36).substr(2, 8);

export const App: FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const update = async () => {
    const { users } = await userService.List({});
    setUsers(users);
  };

  const onClickAdd = useCallback(async () => {
    await userService.Create({ name: randomString() });
    update();
  }, []);

  const onDelete = useCallback(async (id: number) => {
    await userService.Delete({ id });
    update();
  }, []);

  useEffect(() => {
    update();
  }, []);

  return (
    <>
      <button onClick={onClickAdd}>Add</button>
      <UsersList users={users} onDelete={onDelete} />
    </>
  );
};

interface UsersListProps {
  users: User[];
  onDelete: (id: number) => void;
}

const UsersList: FC<UsersListProps> = ({ users, onDelete }: UsersListProps) => (
  <ul>
    {users.map((user) => (
      <UserRow key={user.id} user={user} onDelete={onDelete} />
    ))}
  </ul>
);

interface UserRowProps {
  user: User;
  onDelete: (id: number) => void;
}

const UserRow: FC<UserRowProps> = ({ user, onDelete }: UserRowProps) => {
  const onClickDelete = useCallback(() => onDelete(user.id), []);
  return (
    <li>
      {user.name}
      <button onClick={onClickDelete}>Delete</button>
    </li>
  );
};
