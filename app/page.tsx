import Link from 'next/link'
import { Shield, Lock, ScanSearch } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen text-white bg-zinc-950">

      <div className="absolute inset-0 bg-gradient-to-b from-green-300/5 via-transparent to-transparent" />

      <section className="relative mx-auto flex max-w-7xl flex-col items-center px-6 py-32 text-center">

        <div className="mb-6 rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm text-green-300">
          Military Grade Secure File Sharing
        </div>

        <h1 className="max-w-4xl text-6xl font-black leading-tight">
          Encrypted File Sharing
          <span className="text-green-400"> Built For Security</span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg text-zinc-300">
          AES encrypted uploads, malware scanning, RBAC permissions,
          access requests and enterprise-grade protection.
        </p>

        <div className="mt-12 flex gap-4">
          <Link
            href="/dashboard"
            className="rounded-xl bg-green-500 px-8 py-4 font-semibold text-black hover:bg-green-400 transition"
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

        <div className="rounded-2xl p-8 border border-white/10 bg-white/5 hover:bg-white/10 transition">
          <Lock className="mb-4 h-9 w-9 text-green-400" />
          <h3 className="mb-3 text-xl font-bold">AES Encryption</h3>
          <p className="text-zinc-300">
            All files encrypted before storage using secure AES pipeline.
          </p>
        </div>

        <div className="rounded-2xl p-8 border border-white/10 bg-white/5 hover:bg-white/10 transition">
          <ScanSearch className="mb-4 h-9 w-9 text-green-400" />
          <h3 className="mb-3 text-xl font-bold">Malware Scanning</h3>
          <p className="text-zinc-300">
            VirusTotal integration with SHA-256 verification.
          </p>
        </div>

        <div className="rounded-2xl p-8 border border-white/10 bg-white/5 hover:bg-white/10 transition">
          <Shield className="mb-4 h-9 w-9 text-green-400" />
          <h3 className="mb-3 text-xl font-bold">RBAC Security</h3>
          <p className="text-zinc-300">
            Fine-grained access control with permission management.
          </p>
        </div>

      </section>

      <footer className="border-t border-white/10 py-10 text-center text-sm text-zinc-400">
        <p>
          Authors: Paweł Łopocki · Bartłomiej Maurkiewicz · Krzysztof Makówka
        </p>
      </footer>

    </main>
  )
}