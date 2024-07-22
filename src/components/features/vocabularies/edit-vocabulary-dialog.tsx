"use client";

import { Vocabulary } from "@prisma/client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";

import {
  createKeyword as createKeywordAction,
  editVocabulary as editVocabularyAction,
  findKeywords,
  removeKeyword as removeKeywordAction,
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
import { useCategories } from "@/hooks";
import { VOCABULARIES_KEY } from "@/hooks/use-vocabularies";

export function EditVocabularyDialog({
  vocabulary,
  open,
  onClose,
}: {
  vocabulary: Vocabulary;
  open: boolean;
  onClose: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isFocusedDefinition, setIsFocusedDefinition] = useState(false);

  const { register, control, handleSubmit, watch, reset } = useForm<FormInputs>(
    {
      defaultValues: {
        id: vocabulary.id,
        categoryId: vocabulary.categoryId,
        term: vocabulary.term,
        definition: vocabulary.definition,
      },
    },
  );

  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { data: keywords, mutate: mutateKeywords } = useSWR(
    ["keywords", vocabulary.id],
    () => findKeywords({ vocabularyId: vocabulary.id }),
  );

  const { trigger: createKeyword, isMutating: isCreatingKeywords } =
    useSWRMutation(
      "createKeyword",
      (_, { arg }: { arg: Parameters<typeof createKeywordAction>[0] }) =>
        createKeywordAction(arg),
    );

  const { trigger: removeKeyword, isMutating: isRemovingKeyword } =
    useSWRMutation(
      "removeKeyword",
      (_, { arg }: { arg: Parameters<typeof removeKeywordAction>[0] }) =>
        removeKeywordAction(arg),
    );

  const { trigger: editVocabulary, isMutating: isEditingVocabulary } =
    useSWRMutation(
      "edit",
      (_, { arg }: { arg: Parameters<typeof editVocabularyAction>[0] }) =>
        editVocabularyAction(arg),
    );

  const onSubmit = useCallback(
    async (data: FormInputs) => {
      await editVocabulary(data);
      mutate(VOCABULARIES_KEY);
      onClose();
    },
    [editVocabulary, onClose],
  );

  const keywordRegExp = useMemo(() => {
    const regexp = new RegExp(
      `(${keywords?.map((k) => k.text).join("|") || "$a"})`,
      "gi",
    );
    return regexp;
  }, [keywords]);

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

        const existingKeyword = keywords?.find((k) => k.text === keyword);
        if (existingKeyword) {
          removeKeyword(existingKeyword.id);
        } else {
          createKeyword({ vocabularyId: vocabulary.id, text: keyword });
        }

        mutateKeywords();
      }
    };

    textarea?.addEventListener("keydown", commandHandler);
    return () => {
      textarea?.removeEventListener("keydown", commandHandler);
    };
  }, [
    createKeyword,
    isFocusedDefinition,
    keywords,
    mutateKeywords,
    removeKeyword,
    vocabulary.id,
  ]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" {...register("id")} />
        <DialogTitle>Edit vocabulary</DialogTitle>
        <DialogDescription>
          Fill in the form below to edit a vocabulary
        </DialogDescription>
        <DialogBody>
          <FieldGroup>
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
                    <Textarea
                      {...field}
                      invalid={invalid}
                      ref={textareaRef}
                      onFocus={() => setIsFocusedDefinition(true)}
                      onBlur={() => setIsFocusedDefinition(false)}
                    />
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
                        onClick={async () => {
                          const id = keywords?.find((k) => k.text === part)?.id;
                          if (id) {
                            await removeKeyword(id);
                            mutateKeywords();
                          }
                        }}
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
                {keywords?.map((keyword) => (
                  <Badge key={keyword.id}>{keyword.text}</Badge>
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
            disabled={
              isEditingVocabulary || isCreatingKeywords || isRemovingKeyword
            }
          >
            Edit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

type FormInputs = {
  id: string;
  categoryId: string;
  term: string;
  definition: string;
};
