"use client";

import CheckBoxOffIcon from "@/assets/icons-small/checkbox/checkbox_off.svg";
import { errorToast } from "@/utils/custom-toast";

export default function UnsupportedPushNotificationSettingButton() {
  const handleSettingCheckBox = async () => {
    errorToast("unsupported", "🚧 현재 지원하지 않는 기능입니다.");
  };

  return (
    <div className="flex h-48 w-232 items-center justify-center gap-x-7 rounded-12 border border-dark-blue-500">
      <label
        htmlFor="push-notification"
        className="relative flex cursor-pointer items-center hover:drop-shadow"
        aria-label="푸시 알림 Off"
      >
        <input
          id="push-notification"
          type="checkbox"
          checked={false}
          aria-checked={false}
          onChange={() => {
            handleSettingCheckBox();
          }}
          className="hidden"
        />
        <CheckBoxOffIcon />
      </label>
      <p className="text-base font-semibold text-dark-blue-500">
        거북목 주의보 알림
      </p>
    </div>
  );
}
