import  { z } from "zod";

export const SignupSchema=z.object({
  username:z.string().max(15),
  password:z.string().max(8).min(8),
  email:z.email()
});

export const SigninSchema=z.object({
  email:z.email(),
  password:z.string().max(8)
});
