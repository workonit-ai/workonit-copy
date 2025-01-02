import { isDataExists } from './generic';

export const isAdmin = (user) => user && isDataExists(user) && user.role === "admin";

export const isUser = (user) => user && isDataExists(user) && user.role === "user";

export const isLoggedIn = (user) => user && isDataExists(user);
