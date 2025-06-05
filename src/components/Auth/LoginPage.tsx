import React, { useState } from "react";
import { supabase } from "../../supabaseClient";

function LoginPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  // 로그인 상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // 회원가입 상태
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError("");
    setSignupSuccess(false);
    const { data, error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
    });
    if (error) setSignupError(error.message);
    else {
      // users 테이블에도 insert
      if (data.user) {
        const { error: userInsertError } = await supabase.from("users").insert({
          id: data.user.id,
          name: signupName,
          email: signupEmail,
          role: "worker",
        });
        if (userInsertError) {
          setSignupError(
            "회원 정보 저장 중 오류가 발생했습니다: " + userInsertError.message
          );
          setSignupLoading(false);
          return;
        }
      }
      setSignupSuccess(true);
    }
    setSignupLoading(false);
  };

  return (
    <div style={{ maxWidth: 340, margin: "40px auto" }}>
      <div style={{ display: "flex", marginBottom: 16 }}>
        <button
          style={{ flex: 1, fontWeight: tab === "login" ? "bold" : undefined }}
          onClick={() => setTab("login")}
        >
          로그인
        </button>
        <button
          style={{ flex: 1, fontWeight: tab === "signup" ? "bold" : undefined }}
          onClick={() => setTab("signup")}
        >
          회원가입
        </button>
      </div>
      {tab === "login" ? (
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
          <button type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
          {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        </form>
      ) : (
        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="이메일"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
          <input
            type="text"
            placeholder="이름"
            value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
          <button
            type="submit"
            disabled={signupLoading}
            style={{ width: "100%" }}
          >
            {signupLoading ? "가입 중..." : "회원가입"}
          </button>
          {signupError && (
            <div style={{ color: "red", marginTop: 8 }}>{signupError}</div>
          )}
          {signupSuccess && (
            <div style={{ color: "green", marginTop: 8 }}>
              회원가입 성공! 이메일로 인증 메일이 발송되었습니다.
            </div>
          )}
        </form>
      )}
    </div>
  );
}

export default LoginPage;
