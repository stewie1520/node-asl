import { AsyncLocalStorage } from "async_hooks";

export const asl = new AsyncLocalStorage();

export const getCurrentUser: () => Express.User | undefined = () => {
  const store = asl.getStore() as any;
  return store?.user;
};
