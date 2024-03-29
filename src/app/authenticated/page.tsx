import React from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const Authenticated = (props: any) => {
  const { children } = props;
  const cookieStore = cookies();

  if (
    cookieStore.get("PROD-APP-AUTH") === undefined ||
    cookieStore.get("PROD-APP-AUTH")?.value === ""
  ) {
    redirect("/login");
  }
  return <>{children}</>;
};

export default Authenticated;
