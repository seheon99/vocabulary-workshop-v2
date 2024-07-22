import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { createUser } from "@/actions";
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

export function SignupDialog({
  open,
  onClose,
  showLogin,
}: {
  open: boolean;
  onClose: (value: boolean) => void;
  showLogin: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<FormInputs>();

  const onSubmit = useCallback<SubmitHandler<FormInputs>>(
    async (data) => {
      try {
        if (!loading) {
          setLoading(true);
          const {
            user: { uid, email },
          } = await createUserWithEmailAndPassword(
            auth,
            data.email,
            data.password,
          );
          await createUser({ id: uid, email: email! });
        }
      } catch (error) {
        console.dir(error);
        const firebaseError = error as FirebaseError;
        if (firebaseError.code === "auth/email-already-in-use") {
          toast.error("An account with this email already exists");
        } else {
          toast.error("An error occurred. Please try again later");
        }
        setLoading(false);
      }
    },
    [loading],
  );

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Sign up</DialogTitle>
        <DialogDescription>Create a new account</DialogDescription>
        <DialogBody>
          <FieldGroup>
            <Field>
              <Label>Email</Label>
              <Input
                type="email"
                autoComplete="email"
                invalid={"email" in errors}
                {...register("email", { required: true })}
              />
              {errors.email && (
                <ErrorMessage>{errors.email.message}</ErrorMessage>
              )}
            </Field>
            <Field>
              <Label>Password</Label>
              <Input
                type="password"
                autoComplete="new-password"
                invalid={"password" in errors}
                {...register("password", {
                  required: true,
                  minLength: {
                    value: 8,
                    message: "Your password must be at least 8 characters long",
                  },
                })}
              />
              {errors.password && (
                <ErrorMessage>{errors.password.message}</ErrorMessage>
              )}
            </Field>
            <Field>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                autoComplete="new-password"
                invalid={"confirmPassword" in errors}
                {...register("confirmPassword", {
                  required: true,
                  validate: (confirmPassword) => {
                    if (watch("password") !== confirmPassword) {
                      return "Your passwords do not match";
                    }
                  },
                })}
              />
              {errors.confirmPassword && (
                <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
              )}
            </Field>
          </FieldGroup>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={showLogin}>
            Log in to your account
          </Button>
          <Button type="submit" disabled={loading}>
            Sign up
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

type FormInputs = {
  email: string;
  password: string;
  confirmPassword: string;
};
