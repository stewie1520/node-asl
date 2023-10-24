import { getCurrentUser } from "@/asl";
import { Handler } from "express";

export const me: Handler = async (req, res, next) => {
  try {
    res.json(getCurrentUser());
  } catch (error: any) {
    next(error);
  }
};
