import { RefObject } from "react";

import { saveAs } from "file-saver";
import { domToBlob } from "modern-screenshot";
import { motion } from "motion/react";

import SaveIcon from "@/assets/profile-card/download.svg";
import ShareIcon from "@/assets/profile-card/share.svg";
import { errorToast } from "@/utils/custom-toast";

interface ProfileCardActionsProps {
  cardRef: RefObject<HTMLDivElement | null>;
  userName: string | undefined;
}

export default function ProfileCardActions({
  cardRef,
  userName,
}: ProfileCardActionsProps) {
  const handleSave = () => {
    if (cardRef.current) {
      domToBlob(cardRef.current, { scale: 2 }).then((blob) => {
        saveAs(blob, `${userName}'s profile-card.png`);
      });
    }
  };

  const handleShare = () => {
    errorToast("in-progress-guide", "🚧 준비 중인 기능입니다.");
  };

  return (
    <motion.div
      className="pt-17 md:pt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex gap-x-10 md:gap-x-12">
        <button
          type="button"
          className="flex size-52 items-center justify-center rounded-8 bg-white shadow-xl transition-transform hover:-translate-y-3 md:size-72"
          onClick={handleSave}
        >
          <SaveIcon className="flex size-30 items-center justify-center md:size-40" />
        </button>
        <button
          type="button"
          className="flex size-52 items-center justify-center rounded-8 bg-white shadow-xl transition-transform hover:-translate-y-3 md:size-72"
          title="🚧 준비 중인 기능입니다."
          onClick={handleShare}
        >
          <ShareIcon className="flex size-30 items-center justify-center md:size-40" />
        </button>
      </div>
    </motion.div>
  );
}
