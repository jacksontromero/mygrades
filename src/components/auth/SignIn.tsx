"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";

export default function SignIn() {
  return (
    <Button onClick={() => signIn("google")}>Sign In To Sync Classes</Button>
  );
}
