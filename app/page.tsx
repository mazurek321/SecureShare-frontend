import Link from 'next/link'
import { Shield, Lock, ScanSearch } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen text-zinc-100 relative overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-700 via-zinc-800 to-zinc-900">
      
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none hidden xl:block">
        <div className="absolute -top-32 left-[calc(50%-45rem)] h-[35rem] w-[35rem] rounded-full bg-emerald-400/15 blur-[120px]" />
        <div className="absolute top-1/4 right-[calc(50%-48rem)] h-[40rem] w-[40rem] rounded-full bg-cyan-400/15 blur-[120px]" />
        <div className="absolute bottom-[-10rem] left-[calc(50%-40rem)] h-[35rem] w-[35rem] rounded-full bg-lime-400/10 blur-[120px]" />
      </div>

      <div className="absolute inset-0 -z-10 bg-zinc-955/40 backdrop-blur-[4px]" />

      <section className="relative mx-auto flex max-w-7xl flex-col items-center px-6 py-32 text-center">

        <div className="mb-6 rounded-full border border-emerald-500/30 bg-zinc-900/50 backdrop-blur-[80px] px-4 py-2 text-sm text-emerald-300 shadow-lg">
          Military Grade Secure File Sharing
        </div>

        <h1 className="max-w-4xl text-6xl font-black leading-tight drop-shadow-sm">
          Encrypted File Sharing
          <span className="text-emerald-400"> Built For Security</span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg text-zinc-200 font-medium">
          AES encrypted uploads, malware scanning, RBAC permissions,
          access requests and enterprise-grade protection.
        </p>

        <div className="mt-12 flex gap-4">
          <Link
            href="/dashboard"
            className="rounded-xl bg-emerald-500 px-8 py-4 font-bold text-black hover:bg-emerald-400 transition shadow-[0_10px_30px_rgba(16,185,129,0.3)]"
          >
            Launch Dashboard
          </Link>

          <Link
            href="/auth/login"
            className="rounded-xl border border-zinc-500/30 bg-zinc-900/50 backdrop-blur-[80px] px-8 py-4 font-semibold hover:bg-zinc-900/80 transition shadow-xl"
          >
            Login or Create Account
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 pb-24 md:grid-cols-3">

        <div className="rounded-2xl p-8 border border-zinc-500/30 bg-zinc-900/75 backdrop-blur-[80px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:border-zinc-400/40 transition">
          <Lock className="mb-4 h-9 w-9 text-emerald-400" />
          <h3 className="mb-3 text-xl font-bold text-zinc-100">AES Encryption</h3>
          <p className="text-zinc-300 text-sm leading-relaxed">
            All files encrypted before storage using secure AES pipeline.
          </p>
        </div>

        <div className="rounded-2xl p-8 border border-zinc-500/30 bg-zinc-900/75 backdrop-blur-[80px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:border-zinc-400/40 transition">
          <ScanSearch className="mb-4 h-9 w-9 text-emerald-400" />
          <h3 className="mb-3 text-xl font-bold text-zinc-100">Malware Scanning</h3>
          <p className="text-zinc-300 text-sm leading-relaxed">
            VirusTotal integration with SHA-256 verification.
          </p>
        </div>

        <div className="rounded-2xl p-8 border border-zinc-500/30 bg-zinc-900/75 backdrop-blur-[80px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:border-zinc-400/40 transition">
          <Shield className="mb-4 h-9 w-9 text-emerald-400" />
          <h3 className="mb-3 text-xl font-bold text-zinc-100">RBAC Security</h3>
          <p className="text-zinc-300 text-sm leading-relaxed">
            Fine-grained access control with permission management.
          </p>
        </div>

      </section>

      <footer className="border-t border-zinc-700/50 bg-zinc-950/20 backdrop-blur-sm py-10 text-center text-sm text-zinc-400 font-medium">
        <p>
          Authors: Paweł Łopocki · Bartłomiej Maurkiewicz · Krzysztof Makówka
        </p>
      </footer>

    </main>
  )
}