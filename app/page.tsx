import ChatHeader from "@/components/ChatHeader";
import { Button } from "@/components/ui/button";
import InitUser from "@/lib/store/InitUser";
import { createClient } from "@/utils/supabase/server"; // supabase 객체 불러오기. // 서버 컴포넌트니깐 서버에서 임포트해온다.
import React from "react";

const page = async () => {
  const supabase = createClient(); // supabase 객체 불러오기.

  // const session = await supabase.auth.getSession();
  // console.log(session.data.session?.user);

  const user = (await supabase.auth.getUser()).data.user;
  // console.log("user: ", user);

  return (
    <>
      <div className="max-w-3xl mx-auto md:py-10 h-screen">
        <div className="h-full border rounded-md">
          <ChatHeader user={user} />
          {/* 이제 zustand를 통해 user의 state management를 하기 때문에 ChatHeader에 user props를 안넘겨줘도 되지만, 굳이 지울 필요도 없으므로 남겨준다. */}
        </div>
      </div>
      <InitUser user={user} />
      {/* user state 관리를 시작할 수 있도록. */}
    </>
  );
};

export default page;
