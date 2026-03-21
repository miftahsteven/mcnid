"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

type Step = "credentials" | "otp";

export default function AdminLoginPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("credentials");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [tempToken, setTempToken] = useState("");
  const [mfaSetupRequired, setMfaSetupRequired] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [setupSecret, setSetupSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [animating, setAnimating] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => otpRefs.current[0]?.focus(), 300);
    }
  }, [step]);

  const transitionToStep = (nextStep: Step) => {
    setAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setAnimating(false);
    }, 300);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Username atau password salah");
        return;
      }
      if (data.mfa_required) {
        setTempToken(data.temp_token);
        if (data.mfa_setup_required) {
          setMfaSetupRequired(true);
          setQrCodeUrl(data.otpauth_url);
          setSetupSecret(data.secret);
        } else {
          setMfaSetupRequired(false);
        }
        transitionToStep("otp");
      } else {
        router.replace("/admin-panel");
        router.refresh();
      }
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    if (next.every((d) => d !== "") && (value || next[index])) {
      handleVerifyOtp(next.join(""));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (code?: string) => {
    const otpCode = code ?? otp.join("");
    if (otpCode.length !== 6) {
      setError("Masukkan 6 digit kode OTP");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totp_code: otpCode, temp_token: tempToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Kode OTP tidak valid");
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
        return;
      }
      router.replace("/admin-panel");
      router.refresh();
    } catch {
      setError("Gagal memverifikasi OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #1a3c2e 0%, #0d2218 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "url(/admin-login-bg.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d2218]/80" />

        <div className="relative z-10 p-10">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
              }}
            >
              M
            </div>
            <span className="text-white font-bold text-xl tracking-wide">
              MCNID.NET
            </span>
          </div>
        </div>

        <div className="relative z-10 p-10">
          <div className="space-y-4">
            <div
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{ background: "rgba(34,197,94,0.2)", color: "#86efac" }}
            >
              Admin Panel
            </div>
            <h1 className="text-white text-4xl font-bold leading-tight">
              Kelola konten <br />
              <span style={{ color: "#86efac" }}>dengan mudah</span>
            </h1>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Panel manajemen terpadu untuk mengelola posts, video, kursus, ZIS,
              dan pengguna MCNID.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3">
            {[
              { icon: "🔒", label: "Login aman dengan 2FA" },
              { icon: "📊", label: "Dashboard real-time" },
              { icon: "⚡", label: "Manajemen konten cepat" },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span className="text-lg">{f.icon}</span>
                <span className="text-white/80 text-sm">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
              }}
            >
              M
            </div>
            <span className="font-bold text-[#1a3c2e] text-lg">MCNID.NET</span>
          </div>

          <div
            className="transition-all duration-300"
            style={{
              opacity: animating ? 0 : 1,
              transform: animating ? "translateX(12px)" : "translateX(0)",
            }}
          >
            {step === "credentials" ? (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Masuk ke Admin Panel
                  </h2>
                  <p className="text-gray-500 mt-1 text-sm">
                    Gunakan akun administrator untuk melanjutkan
                  </p>
                </div>
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <circle
                            cx="12"
                            cy="7"
                            r="4"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                      </span>
                      <input
                        id="admin-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoComplete="username"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
                        placeholder="Masukkan username"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M7 11V7a5 5 0 0 1 10 0v4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                      <input
                        id="admin-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
                        placeholder="Masukkan password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <svg
                            width="16"
                            height="16"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <line
                              x1="1"
                              y1="1"
                              x2="23"
                              y2="23"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="16"
                            height="16"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <circle
                              cx="12"
                              cy="12"
                              r="3"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100">
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="shrink-0 text-red-500"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <line
                          x1="12"
                          y1="8"
                          x2="12"
                          y2="12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <circle cx="12" cy="16" r="1" fill="currentColor" />
                      </svg>
                      <p className="text-red-600 text-xs">{error}</p>
                    </div>
                  )}
                  <button
                    id="admin-login-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #22c55e, #16a34a)",
                      boxShadow: "0 4px 14px rgba(34,197,94,0.3)",
                    }}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin"
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeOpacity="0.3"
                          />
                          <path
                            d="M12 2a10 10 0 0 1 10 10"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </svg>
                        Memproses...
                      </>
                    ) : (
                      "Masuk"
                    )}
                  </button>
                </form>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setError("");
                    transitionToStep("credentials");
                  }}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm mb-5 transition-colors"
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M19 12H5M12 19l-7-7 7-7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Kembali
                </button>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{
                    background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                  }}
                >
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <rect
                      x="5"
                      y="2"
                      width="14"
                      height="20"
                      rx="2"
                      stroke="#16a34a"
                      strokeWidth="2"
                    />
                    <circle cx="12" cy="17" r="1" fill="#16a34a" />
                    <path
                      d="M9 6h6M9 10h4"
                      stroke="#16a34a"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {mfaSetupRequired ? "Siapkan 2FA" : "Verifikasi 2FA"}
                </h2>

                {mfaSetupRequired ? (
                  <div className="mb-6 flex flex-col items-center text-center">
                    <p className="text-sm text-gray-600 mb-4 px-2">
                      Ini pertama kalinya Anda masuk. Gunakan aplikasi Google
                      Authenticator untuk memindai kode QR ini, lalu masukkan 6
                      digit kode yang muncul.
                    </p>
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 inline-block mb-3">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrCodeUrl)}`}
                        alt="QR Code 2FA"
                        width={160}
                        height={160}
                        className="rounded-lg"
                      />
                    </div>
                    <p className="text-xs text-gray-400">
                      Atau gunakan secret key:
                    </p>
                    <code className="text-xs font-mono font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded mt-1 select-all">
                      {setupSecret}
                    </code>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm mb-8">
                    Buka <strong>Google Authenticator</strong> dan masukkan kode
                    6 digit
                  </p>
                )}

                <div className="flex gap-3 justify-center mb-6">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all text-gray-900 bg-gray-50 focus:bg-white"
                      style={{ caretColor: "#16a34a" }}
                    />
                  ))}
                </div>
                {error && (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100 mb-4">
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="shrink-0 text-red-500"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <line
                        x1="12"
                        y1="8"
                        x2="12"
                        y2="12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <circle cx="12" cy="16" r="1" fill="currentColor" />
                    </svg>
                    <p className="text-red-600 text-xs">{error}</p>
                  </div>
                )}
                <button
                  id="admin-verify-otp-btn"
                  type="button"
                  onClick={() => handleVerifyOtp()}
                  disabled={loading || otp.some((d) => !d)}
                  className="w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #22c55e, #16a34a)",
                    boxShadow: "0 4px 14px rgba(34,197,94,0.3)",
                  }}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeOpacity="0.3"
                        />
                        <path
                          d="M12 2a10 10 0 0 1 10 10"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      Memverifikasi...
                    </>
                  ) : (
                    "Verifikasi"
                  )}
                </button>
                <p className="text-center text-xs text-gray-400 mt-4">
                  Kode auto-terkirim saat 6 digit terisi
                </p>
              </>
            )}
          </div>
          <p className="mt-10 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} MCNID.NET · Admin Panel
          </p>
        </div>
      </div>
    </div>
  );
}
