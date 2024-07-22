import ChatHeader from "@/components/ChatHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
        <div className="h-full border rounded-md flex flex-col">
          <ChatHeader user={user} />
          {/* 이제 zustand를 통해 user의 state management를 하기 때문에 ChatHeader에 user props를 안넘겨줘도 되지만, 굳이 지울 필요도 없으므로 남겨준다. */}
          <div className="flex-1  flex flex-col p-5 h-full overflow-y-auto">
            <div className="flex-1"></div>
            <div className="space-y-7">
              {Array.from({ length: 15 }, (v, i) => i).map((value) => {
                return (
                  <div className="flex gap-2" key={value}>
                    <div className="h-10 w-10 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <h1 className="font-bold">Jaehyeon</h1>
                        <h1 className="text-sm text-gray-400">
                          {new Date().toDateString()}
                        </h1>
                      </div>
                      <p className="text-gray-300">
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                        elit. Quisquam minus dolorum voluptatibus perferendis
                        nesciunt ex odit rem est a maiores!
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="p-5">
            <Input placeholder="send message" />
          </div>
        </div>
      </div>
      <InitUser user={user} />
      {/* user state 관리를 시작할 수 있도록. */}
    </>
  );
};

export default page;
