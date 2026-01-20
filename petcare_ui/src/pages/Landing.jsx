import React from "react";
import Logo from "../components/Logo";
import Panel from "../components/Panel";
import Button from "../components/Button";

function Landing({ goLogin, goRegister }) {
  return (
    <div className="min-h-screen auth-bg flex items-center justify-center px-4">
      <div className="flex flex-col items-center">
        <Logo />
        <Panel>
          <div className="space-y-5">
            <Button onClick={goLogin}>Đăng nhập</Button>
            <Button onClick={goRegister}>Đăng ký</Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default Landing;
