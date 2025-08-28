"use client";

import { useState } from "react";

const ProjectNotice = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed right-16 top-20 z-[100] w-300 space-y-8 rounded-md border border-gray-200 bg-white p-16 shadow-md">
      {/* 헤더: 항상 보이는 부분 */}
      <button
        className="flex w-full cursor-pointer items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-md font-semibold">💡 데모 환경 안내</span>
        <button className="text-sm text-gray-400">{isOpen ? "▲" : "▼"}</button>
      </button>
      {/* 상세 내용: 토글 가능한 부분 */}
      {isOpen && (
        <p className="text-sm">
          현재 백엔드 서버를 일시적으로 내려둔 상태이며, Route Handler를 이용해
          API를 모킹해두었습니다.
          <br />
          이 때문에 페이지 이동 시 상태가 유지되지 않아 일부 기능이 정상적으로
          작동하지 않을 수 있습니다.
          <br /> 가능하면 기존 데이터를 사용해 UX/UI를 확인해 주시면
          감사하겠습니다.
        </p>
      )}
    </div>
  );
};

export default ProjectNotice;
