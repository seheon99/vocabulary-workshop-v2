"use client";

import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";

import { createCategory } from "@/actions";
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
import { CATEGORIES_KEY, useCurrentUser } from "@/hooks";

export function NewCategoryDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: user } = useCurrentUser();

  const { register, control, handleSubmit } = useForm<FormInputs>({
    defaultValues: { creatorId: user?.uid },
  });
  const { trigger: create, isMutating: isCreating } = useSWRMutation(
    "createCategory",
    (_, { arg }: { arg: Parameters<typeof createCategory>[0] }) =>
      createCategory(arg),
  );

  const onSubmit = useCallback(
    async (data: FormInputs) => {
      console.dir(data);
      await create(data);
      mutate(CATEGORIES_KEY);
      onClose();
    },
    [create, onClose],
  );

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Create new category</DialogTitle>
        <DialogDescription>
          Fill in the form below to create a new category
        </DialogDescription>
        <DialogBody>
          <FieldGroup>
            <input type="hidden" {...register("creatorId")} />
            <Field>
              <Label>Name</Label>
              <Controller
                control={control}
                name="name"
                rules={{ required: "Name is required" }}
                render={({ field, fieldState: { invalid, error } }) => (
                  <>
                    <Input invalid={invalid} {...field} />
                    {error && <ErrorMessage>{error.message}</ErrorMessage>}
                  </>
                )}
              />
            </Field>
          </FieldGroup>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating}>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

type FormInputs = {
  creatorId: string;
  name: string;
};
