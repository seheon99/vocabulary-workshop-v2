"use client";

import { useState } from "react";

import { Button } from "@/components/base";

import { LoginDialog } from "./login-dialog";
import { SignupDialog } from "./signup-dialog";

export function LoginButton() {
  const [openedDialog, setOpenedDialog] = useState<"login" | "signup" | null>(
    null,
  );

  return (
    <>
      <Button onClick={() => setOpenedDialog("login")}>Login</Button>
      <LoginDialog
        open={openedDialog === "login"}
        onClose={() => setOpenedDialog(null)}
        showSignup={() => setOpenedDialog("signup")}
      />
      <SignupDialog
        open={openedDialog === "signup"}
        onClose={() => setOpenedDialog(null)}
        showLogin={() => setOpenedDialog("login")}
      />
    </>
  );
}
