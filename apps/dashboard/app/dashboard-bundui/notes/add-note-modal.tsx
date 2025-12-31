"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/shared/lib/utils";
import { ImageIcon, Tag, PenSquare, Check, Trash2Icon, ArchiveIcon } from "lucide-react";
import { MinimalTiptapEditor } from "@vibethink/ui";
import { Content } from "@tiptap/react";
import { useTranslation } from "@/lib/i18n";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@vibethink/ui";
import { Input } from "@vibethink/ui";
import { Button } from "@vibethink/ui";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@vibethink/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@vibethink/ui";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@vibethink/ui";
import { NoteLabel } from "./types";
import { Badge } from "@vibethink/ui";
import { noteLabels } from "./data";

export function AddNoteModal() {
  const { t } = useTranslation(['notes', 'richtext']);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [value, setValue] = React.useState<Content>("");
  const [selectedTags, setSelectedTags] = React.useState<NoteLabel[]>([]);

  const editorLabels = {
    bold: t('richtext:toolbar.bold'),
    italic: t('richtext:toolbar.italic'),
    underline: t('richtext:toolbar.underline'),
    strikethrough: t('richtext:toolbar.strikethrough'),
    code: t('richtext:toolbar.code'),
    clearFormatting: t('richtext:toolbar.clearFormatting'),
    moreFormatting: t('richtext:toolbar.moreFormatting'),
    orderedList: t('richtext:toolbar.orderedList'),
    bulletList: t('richtext:toolbar.bulletList'),
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <PenSquare />
          <span className="hidden md:block">{t('notes:addNote')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen max-w-(--breakpoint-sm) overflow-y-scroll p-0 lg:overflow-y-auto">
        {imagePreview && (
          <figure>
            <Image
              src={imagePreview}
              width={200}
              height={200}
              alt="shadcn/ui"
              className="aspect-video w-full rounded-tl-md rounded-tr-md object-cover"
              unoptimized
            />
          </figure>
        )}
        <VisuallyHidden>
          <DialogTitle>{t('notes:addNote')}</DialogTitle>
        </VisuallyHidden>

        <form className={cn({ "p-6": !imagePreview, "p-6 pt-0": imagePreview })}>
          <div className="space-y-6">
            <Input
              placeholder={t('notes:placeholders.title')}
              name="title"
              className="mb-4 rounded-none border-0 px-0 text-xl focus-visible:ring-0"
            />

            <MinimalTiptapEditor
              value={value}
              onChange={setValue}
              className="w-full"
              editorContentClassName="p-5"
              output="html"
              placeholder={t('notes:placeholders.description')}
              labels={editorLabels}
              autofocus={true}
              editable={true}
              editorClassName="focus:outline-hidden"
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Input
                        id="picture"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <Button type="button" variant="ghost" size="icon">
                        <label htmlFor="picture" className="cursor-pointer">
                          <ImageIcon className="size-4" />
                        </label>
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{t('notes:tooltips.addImage')}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Tag className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder={t('notes:placeholders.searchTags')} className="h-9" />
                            <CommandList>
                              <CommandEmpty>{t('notes:empty.noLabelsFound')}</CommandEmpty>
                              <CommandGroup className="p-2">
                                {noteLabels &&
                                  noteLabels.length &&
                                  noteLabels.map((label, key: number) => (
                                    <CommandItem
                                      key={key}
                                      className="flex items-center py-2"
                                      onSelect={() => {
                                        if (selectedTags.includes(label)) {
                                          return setSelectedTags(
                                            selectedTags.filter((item) => item.id !== label.id)
                                          );
                                        }

                                        return setSelectedTags(
                                          [...noteLabels].filter((u) =>
                                            [...selectedTags, label].includes(u)
                                          )
                                        );
                                      }}>
                                      <div className="flex grow items-center gap-2">
                                        <span
                                          className={cn(
                                            "block size-3 rounded-full",
                                            label.color
                                          )}></span>
                                        <span className="text-sm leading-none">{label.title}</span>
                                        {selectedTags.includes(label) ? (
                                          <Check className="text-primary ms-auto size-3" />
                                        ) : null}
                                      </div>
                                    </CommandItem>
                                  ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{t('notes:tooltips.addTag')}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <ArchiveIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('notes:tooltips.archive')}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('notes:delete')}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Button>{t('notes:addNote')}</Button>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {selectedTags.map((tag, key) => (
              <Badge key={key} variant="outline">
                {tag.title}
              </Badge>
            ))}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
