"use client";

import { isNil } from "es-toolkit";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useSWRMutation from "swr/mutation";

import { createSubmission } from "@/actions/create-submission";
import { Button, Field, Fieldset, Input, Label, Text } from "@/components/base";
import { useCurrentUser } from "@/hooks";

export function QuizForm({ vocabularyId }: { vocabularyId: string }) {
  const { register, handleSubmit } = useForm<FormInputs>();

  const { data: user } = useCurrentUser();

  const {
    data,
    trigger: submitAnswer,
    isMutating,
  } = useSWRMutation(
    "submitAnswer",
    (
      _,
      {
        arg,
      }: { arg: { userId: string; vocabularyId: string; answer: string } },
    ) => createSubmission(arg),
  );

  const router = useRouter();

  useEffect(() => {
    if (data?.id) {
      router.push(`/submissions/${data.id}`);
    }
  }, [data, router]);

  if (isNil(user)) {
    return <Text>Loading ...</Text>;
  }

  return (
    <Fieldset>
      <form
        className="mt-10 flex w-full flex-col"
        onSubmit={handleSubmit(({ answer }) => {
          submitAnswer({ userId: user.uid, vocabularyId, answer });
        })}
      >
        <Field>
          <Label>Answer</Label>
          <Input
            {...register("answer")}
            placeholder="Type your answer here"
            autoFocus
            autoComplete="off"
          />
        </Field>
        <Button className="mt-4" type="submit" disabled={isMutating}>
          Submit
        </Button>
      </form>
    </Fieldset>
  );
}

type FormInputs = {
  answer: string;
};
