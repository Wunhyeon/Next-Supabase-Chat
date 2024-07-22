"use client"; // react hook을 사용할 거기 때문에, 클라이언트 컴포넌트로
import React, { useEffect, useRef } from "react";
import { IMessage, useMessage } from "./messages";

const InitMessages = ({ messages }: { messages: IMessage[] }) => {
  // props로 유저 객체를 받아옴.
  const initState = useRef(false); // 초기값

  useEffect(() => {
    if (!initState.current) {
      // 초기값이 false라면, state management를 할 수 있도록 user객체를 넣어준다.
      useMessage.setState({ messages });
    }

    initState.current = true;
  }, []);

  return <></>;
};

export default InitMessages;
