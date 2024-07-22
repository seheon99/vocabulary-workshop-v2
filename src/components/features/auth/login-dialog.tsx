import { signInWithEmailAndPassword } from "firebase/auth";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
  ErrorMessage,
  Field,
  FieldGroup,
  Input,
  Label,
} from "@/components/base";
import { auth } from "@/firebase";

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
  const [loading, setLoading] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormInputs>();

  const onSubmit = useCallback<SubmitHandler<FormInputs>>(
    async (data) => {
      try {
        if (!loading) {
          setLoading(true);
          await signInWithEmailAndPassword(auth, data.email, data.password);
        }
      } catch (error) {
        if ((error as FirebaseError)?.name === "FirebaseError") {
          const firebaseError = error as FirebaseError;
          console.dir(firebaseError);
          if (firebaseError.code === "auth/invalid-credential") {
            toast.error("Invalid credentials. Check your email and password");
          } else if (firebaseError.code === "auth/user-not-found") {
            toast.error("No account with this email exists");
          } else if (firebaseError.code === "auth/wrong-password") {
            toast.error("Incorrect password");
          } else {
            toast.error(`An error occurred: ${firebaseError.message}`);
          }
        } else {
          toast.error("An unexpected error occurred");
        }
        setLoading(false);
      }
    },
    [loading],
  );

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Login</DialogTitle>
        <DialogDescription>
          Login to your account to access full features.
        </DialogDescription>
        <DialogBody>
          <FieldGroup>
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
          </FieldGroup>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={showSignup}>
            Sign up for an account
          </Button>
          <Button type="submit" disabled={loading}>
            Login
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

type FormInputs = {
  email: string;
  password: string;
};
