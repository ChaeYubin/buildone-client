"use client";

import { useState } from "react";

import { Editor } from "@tiptap/react";

import BoldIcon from "@/assets/editor/bold.svg";
import H1Icon from "@/assets/editor/h1.svg";
import H2Icon from "@/assets/editor/h2.svg";
import H3Icon from "@/assets/editor/h3.svg";
import H4Icon from "@/assets/editor/h4.svg";
import H5Icon from "@/assets/editor/h5.svg";
import ItalicIcon from "@/assets/editor/italic.svg";
import LinkIcon from "@/assets/editor/link.svg";
import UnderlineIcon from "@/assets/editor/underline.svg";
import Popup from "@/components/@common/portal/popup";
import ToolbarButton from "@/components/note/toolbar-btn";
import "@/styles/note.css";
import { errorToast } from "@/utils/custom-toast";

import Button from "../@common/button";

interface ToolbarProps {
  editor: Editor | null;
  onLinkSubmit: (link: string) => void;
}

export default function Toolbar({ editor, onLinkSubmit }: ToolbarProps) {
  const [isLinkPopupOpen, setLinkPopupOpen] = useState(false);
  const [inputLink, setInputLink] = useState("");

  if (!editor) return null;

  const openLinkPopup = () => setLinkPopupOpen(true);
  const closeLinkPopup = () => {
    setLinkPopupOpen(false);
    const urlPattern =
      /^(https?:\/\/)?([\w.-]+\.[a-z]{2,10})(\/[\w\-./?=&%+#]*)?$/i;
    const trimmedInput = inputLink.trim();

    if (trimmedInput && urlPattern.test(trimmedInput)) {
      onLinkSubmit(trimmedInput);
    } else {
      errorToast("no-http", "올바른 url 형식으로 입력해 주세요.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputLink(e.target.value);
  };

  const buttonConfigs = [
    {
      onClick: () => editor.chain().focus().toggleBold().run(),
      IconComponent: BoldIcon,
      ariaLabel: "Bold",
      isActive: editor.isActive("bold"),
    },
    {
      onClick: () => editor.chain().focus().toggleItalic().run(),
      IconComponent: ItalicIcon,
      ariaLabel: "Italic",
      isActive: editor.isActive("italic"),
    },
    {
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      IconComponent: UnderlineIcon,
      ariaLabel: "Underline",
      isActive: editor.isActive("underline"),
    },
    {
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      IconComponent: H1Icon,
      ariaLabel: "H1",
      isActive: editor.isActive("heading", { level: 1 }),
    },
    {
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      IconComponent: H2Icon,
      ariaLabel: "H2",
      isActive: editor.isActive("heading", { level: 2 }),
    },
    {
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      IconComponent: H3Icon,
      ariaLabel: "H3",
      isActive: editor.isActive("heading", { level: 3 }),
    },
    {
      onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      IconComponent: H4Icon,
      ariaLabel: "H4",
      isActive: editor.isActive("heading", { level: 4 }),
    },
    {
      onClick: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
      IconComponent: H5Icon,
      ariaLabel: "H5",
      isActive: editor.isActive("heading", { level: 5 }),
    },
    // 링크 버튼
    {
      onClick: openLinkPopup,
      IconComponent: LinkIcon,
      ariaLabel: "Link",
      isActive: false,
    },
  ];

  const linkInput = (
    <input
      type="text"
      value={inputLink}
      onChange={handleInputChange}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          closeLinkPopup();
        }
      }}
      placeholder="https://"
      className="h-44 w-full truncate rounded-12 bg-slate-50 px-24 py-12 text-sm outline-none md:h-48 md:text-base"
    />
  );

  return (
    <div
      className="sticky bottom-24 flex h-44 items-center justify-center rounded-22 border-slate-200 bg-white p-2 pl-16 shadow"
      style={{ justifyContent: "space-between" }}
    >
      <div style={{ display: "flex" }}>
        {buttonConfigs.slice(0, -1).map((btn) => (
          <ToolbarButton
            key={btn.ariaLabel}
            onClick={btn.onClick}
            IconComponent={btn.IconComponent}
            ariaLabel={btn.ariaLabel}
            isActive={btn.isActive}
          />
        ))}
      </div>
      <div
        style={{ marginRight: "16px", display: "flex", alignItems: "center" }}
      >
        <ToolbarButton
          onClick={buttonConfigs[buttonConfigs.length - 1].onClick}
          IconComponent={buttonConfigs[buttonConfigs.length - 1].IconComponent}
          ariaLabel={buttonConfigs[buttonConfigs.length - 1].ariaLabel}
          isActive={buttonConfigs[buttonConfigs.length - 1].isActive}
        />
      </div>
      {isLinkPopupOpen && (
        <Popup.Root open={isLinkPopupOpen} onOpenChange={setLinkPopupOpen}>
          <Popup.Content className="w-311 gap-0 rounded-12 md:w-520">
            <div className="text-lg font-bold">링크 업로드</div>
            <div className="flex flex-col gap-12">
              <div className="mt-24 font-semibold">링크</div>
              {linkInput}
            </div>
            <Button
              variant="solid"
              shape="square"
              className="mt-40 w-full"
              onClick={closeLinkPopup}
            >
              확인
            </Button>
          </Popup.Content>
        </Popup.Root>
      )}
    </div>
  );
}
