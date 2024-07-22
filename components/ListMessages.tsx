"use client";

import { useMessage } from "@/lib/store/messages";
import React from "react";
import Message from "./Message";

const ListMessages = () => {
  const messages = useMessage((state) => state.messages); // zustand에 전역으로 저장된 state를 불러옴.

  return (
    <div className="flex-1  flex flex-col p-5 h-full overflow-y-auto">
      <div className="flex-1"></div>
      <div className="space-y-7">
        {messages.map((value, idx) => {
          return <Message key={idx} message={value} />;
        })}
      </div>
    </div>
  );
};

export default ListMessages;
