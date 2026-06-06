import Link from 'next/link'
import { Shield, Lock, ScanSearch } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen text-zinc-100 bg-zinc-900 relative overflow-hidden">

      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-lime-500/10 blur-3xl" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-inc-800 to-taupe-950" />

      <section className="relative mx-auto flex max-w-7xl flex-col items-center px-6 py-32 text-center">

        <div className="mb-6 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-emerald-300">
          Military Grade Secure File Sharing
        </div>

        <h1 className="max-w-4xl text-6xl font-black leading-tight">
          Encrypted File Sharing
          <span className="text-emerald-400"> Built For Security</span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg text-zinc-400">
          AES encrypted uploads, malware scanning, RBAC permissions,
          access requests and enterprise-grade protection.
        </p>

        <div className="mt-12 flex gap-4">
          <Link
            href="/dashboard"
            className="rounded-xl bg-emerald-500 px-8 py-4 font-semibold text-black hover:bg-emerald-400 transition"
          >
            Launch Dashboard
          </Link>

          <Link
            href="/auth/login"
            className="rounded-xl border border-white/10 px-8 py-4 hover:bg-white/5 transition"
          >
            Login or Create Account
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 pb-24 md:grid-cols-3">

        <div className="rounded-2xl p-8 border border-white/10 bg-white/5 backdrop-blur hover:bg-white/10 transition">
          <Lock className="mb-4 h-9 w-9 text-emerald-400" />
          <h3 className="mb-3 text-xl font-bold">AES Encryption</h3>
          <p className="text-zinc-400">
            All files encrypted before storage using secure AES pipeline.
          </p>
        </div>

        <div className="rounded-2xl p-8 border border-white/10 bg-white/5 backdrop-blur hover:bg-white/10 transition">
          <ScanSearch className="mb-4 h-9 w-9 text-emerald-400" />
          <h3 className="mb-3 text-xl font-bold">Malware Scanning</h3>
          <p className="text-zinc-400">
            VirusTotal integration with SHA-256 verification.
          </p>
        </div>

        <div className="rounded-2xl p-8 border border-white/10 bg-white/5 backdrop-blur hover:bg-white/10 transition">
          <Shield className="mb-4 h-9 w-9 text-emerald-400" />
          <h3 className="mb-3 text-xl font-bold">RBAC Security</h3>
          <p className="text-zinc-400">
            Fine-grained access control with permission management.
          </p>
        </div>

      </section>

      <footer className="border-t border-white/10 py-10 text-center text-sm text-zinc-500">
        <p>
          Authors: Paweł Łopocki · Bartłomiej Maurkiewicz · Krzysztof Makówka
        </p>
      </footer>

    </main>
  )
}