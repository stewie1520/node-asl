import { z } from "zod";

export const sendOTPToRegisterValidation = z.object({
  body: z.object({
    phone: z.string().min(1),
  }),
});

export const verifyOTPValidation = z.object({
  body: z.object({
    sessionId: z.string(),
    otp: z.string().min(6).max(255),
  }),
});

export const registerAccountValidation = z.object({
  body: z.object({
    name: z.string().min(1).max(255),
    sessionId: z.string(),
    password: z.string().min(8).max(255),
  }),
});

export const loginValidation = z.object({
  body: z.object({
    phone: z.string().min(1).max(255),
    password: z.string().min(8).max(255),
  }),
});
