import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { mutate } from "swr";

import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
  ErrorMessage,
  Field,
  Fieldset,
  Input,
  Label,
} from "@/components/base";
import { app } from "@/firebase";
import { CURRENT_USER_KEY } from "@/hooks";

import type { FirebaseError } from "firebase/app";
import type { SubmitHandler } from "react-hook-form";

export function LoginDialog({
  open,
  onClose,
  showSignup,
}: {
  open: boolean;
  onClose: (value: boolean) => void;
  showSignup: () => void;
}) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormInputs>();

  const onSubmit = useCallback<SubmitHandler<FormInputs>>(async (data) => {
    try {
      await signInWithEmailAndPassword(getAuth(app), data.email, data.password);
      mutate(CURRENT_USER_KEY);
    } catch (error) {
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === "auth/user-not-found") {
        toast.error("No account with this email exists");
      } else if (firebaseError.code === "auth/wrong-password") {
        toast.error("Incorrect password");
      } else {
        toast.error("An error occurred. Please try again later");
      }
    }
  }, []);

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Login</DialogTitle>
        <DialogDescription>
          Log in to your account to access full features.
        </DialogDescription>
        <DialogBody>
          <Fieldset>
            <Field>
              <Label>Email</Label>
              <Input
                type="email"
                autoComplete="email"
                invalid={"email" in errors}
                {...register("email")}
              />
              {errors.email && (
                <ErrorMessage>{errors.email.message}</ErrorMessage>
              )}
            </Field>
            <Field>
              <Label>Password</Label>
              <Input
                type="password"
                autoComplete="current-password"
                invalid={"password" in errors}
                {...register("password")}
              />
              {errors.password && (
                <ErrorMessage>{errors.password.message}</ErrorMessage>
              )}
            </Field>
          </Fieldset>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={showSignup}>
            Sign up for an account
          </Button>
          <Button type="submit">Log in</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

type FormInputs = {
  email: string;
  password: string;
};
