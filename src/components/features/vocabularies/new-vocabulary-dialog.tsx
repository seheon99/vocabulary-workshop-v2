"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";

import {
  createKeyword as createKeywordAction,
  createVocabulary as createVocabularyAction,
} from "@/actions";
import {
  Badge,
  BadgeButton,
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
  Listbox,
  ListboxOption,
  Text,
  Textarea,
} from "@/components/base";
import { useCategories, useCurrentUser } from "@/hooks";
import { VOCABULARIES_KEY } from "@/hooks/use-vocabularies";

export function NewVocabularyDialog({
  open,
  onClose,
  showCategoryDialog,
}: {
  open: boolean;
  onClose: () => void;
  showCategoryDialog: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { data: user } = useCurrentUser();

  const { register, control, handleSubmit, watch, reset } = useForm<FormInputs>(
    {
      defaultValues: { creatorId: user?.uid },
    },
  );
  const [keywords, setKeywords] = useState<string[]>([]);

  const { trigger: createVocabulary, isMutating: isCreatingVocabulary } =
    useSWRMutation(
      "createVocabulary",
      (_, { arg }: { arg: Parameters<typeof createVocabularyAction>[0] }) =>
        createVocabularyAction(arg),
    );

  const { trigger: createKeyword, isMutating: isCreatingKeywords } =
    useSWRMutation(
      "createKeyword",
      (_, { arg }: { arg: Parameters<typeof createKeywordAction>[0] }) =>
        createKeywordAction(arg),
    );

  const onSubmit = useCallback(
    async (data: FormInputs) => {
      const vocabulary = await createVocabulary(data);
      await Promise.all(
        keywords.map((keyword) =>
          createKeyword({ vocabularyId: vocabulary.id, text: keyword }),
        ),
      );
      mutate(VOCABULARIES_KEY);
      onClose();
    },
    [createKeyword, createVocabulary, keywords, onClose],
  );

  const keywordRegExp = useMemo(
    () => new RegExp(`(${keywords.join("|") || "$a"})`, "gi"),
    [keywords],
  );

  useEffect(() => {
    const textarea = textareaRef.current;

    const commandHandler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "b" || e.key === "B")) {
        const selectionStart = textareaRef.current?.selectionStart ?? 0;
        const selectionEnd = textareaRef.current?.selectionEnd ?? 0;
        const text = textareaRef.current?.value ?? "";
        const keyword = text.slice(selectionStart, selectionEnd).trim();

        if (keyword.length === 0) {
          return;
        }

        setKeywords((prevKeywords) => {
          if (prevKeywords.includes(keyword)) {
            return prevKeywords.filter((k) => k !== keyword);
          }
          return [...prevKeywords, keyword];
        });
      }
    };

    textarea?.addEventListener("keydown", commandHandler);
    return () => {
      textarea?.removeEventListener("keydown", commandHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!watch("definition")?.length]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Create new vocabulary</DialogTitle>
        <DialogDescription>
          Fill in the form below to create a new vocabulary
        </DialogDescription>
        <DialogBody>
          <FieldGroup>
            <input type="hidden" {...register("creatorId")} />
            <Field>
              <Label>Category</Label>
              <Controller
                control={control}
                name="categoryId"
                rules={{ required: "Category is required" }}
                render={({
                  field: { onChange, value },
                  fieldState: { invalid, error },
                }) => (
                  <>
                    <div data-slot="control" className="flex gap-2">
                      <Listbox
                        value={value}
                        onChange={onChange}
                        invalid={invalid}
                        disabled={isLoadingCategories}
                      >
                        {categories?.map((c) => (
                          <ListboxOption key={c.id} value={c.id}>
                            {c.name}
                          </ListboxOption>
                        ))}
                      </Listbox>
                      <Button
                        className="shrink-0"
                        plain
                        onClick={showCategoryDialog}
                      >
                        Create a new category
                      </Button>
                    </div>
                    {error && <ErrorMessage>{error.message}</ErrorMessage>}
                  </>
                )}
              />
            </Field>
            <Field>
              <Label>Term</Label>
              <Controller
                control={control}
                name="term"
                rules={{ required: "Term is required" }}
                render={({ field, fieldState: { invalid, error } }) => (
                  <>
                    <Input invalid={invalid} {...field} />
                    {error && <ErrorMessage>{error.message}</ErrorMessage>}
                  </>
                )}
              />
            </Field>
            <Field>
              <Label>Definition</Label>
              <Controller
                control={control}
                name="definition"
                rules={{ required: "Definition is required" }}
                render={({ field, fieldState: { invalid, error } }) => (
                  <>
                    <Textarea {...field} invalid={invalid} ref={textareaRef} />
                    {error && <ErrorMessage>{error.message}</ErrorMessage>}
                  </>
                )}
              />
              <Text data-slot="error">
                {watch("definition")
                  ?.split(keywordRegExp)
                  .map((part, index) =>
                    keywordRegExp.test(part) ? (
                      <BadgeButton
                        key={index}
                        onClick={() =>
                          setKeywords((prevKeywords) =>
                            prevKeywords.filter((k) => k !== part),
                          )
                        }
                      >
                        {part}
                      </BadgeButton>
                    ) : (
                      part
                    ),
                  )}
              </Text>
            </Field>
            <Field>
              <Label>Keywords</Label>
              <div data-slot="control" className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <Badge key={keyword}>{keyword}</Badge>
                ))}
              </div>
            </Field>
          </FieldGroup>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isCreatingVocabulary || isCreatingKeywords}
          >
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

type FormInputs = {
  creatorId: string;
  categoryId: string;
  term: string;
  definition: string;
};
