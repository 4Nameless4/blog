import { checkUser, logout, signin, signup } from "@/common/api";
import { t_user } from "@/common/types";

export async function POST(request: Request) {
  const req: {
    type: "check" | "login" | "logout" | "signup";
    data: any;
  } = await request.json();
  const reqData = req.data;

  switch (req.type) {
    case "login": {
      const user = await signin(reqData.name, reqData.pwd);
      return Response.json({ data: user });
    }
    case "signup": {
      const msg = await signup(reqData.name, reqData.nickname, reqData.pwd);
      return Response.json({ data: msg });
    }
    case "logout": {
      logout(reqData);
      break;
    }
    case "check": {
      let data: t_user | false = false;
      const checkInfo = await checkUser(reqData || "");
      data = checkInfo;
      return Response.json({ data });
    }
  }
  return Response.json({ data: null });
}
