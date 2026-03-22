"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain,
  Cpu,
  BarChart3,
  Layers,
  Terminal,
  Rocket,
  ArrowRight,
  BookOpen,
  Code2,
  Activity,
  Sparkles,
} from "lucide-react";
import { modules } from "@/data/curriculum";
import { useProgress } from "@/hooks/useProgress";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const moduleIcons = [Brain, Terminal, Layers, BarChart3, Activity, Rocket];

export default function Home() {
  const { completionPercent } = useProgress();

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[var(--bg-primary)]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-[var(--accent)]/5 blur-[120px]" />
          <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[100px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 mb-8">
              <Sparkles className="w-4 h-4 text-[var(--accent)]" />
              <span className="text-sm text-[var(--accent)] font-medium">
                Samsung HI/SDI 개발자 교육
              </span>
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            하네스 기반{" "}
            <span className="bg-gradient-to-r from-[var(--accent)] to-purple-500 bg-clip-text text-transparent">
              AI 애플리케이션
            </span>{" "}
            개발 교육
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Claude Code와 Gemini CLI를 활용하여 AI 기반 소프트웨어 개발의
            새로운 패러다임을 학습합니다.
          </motion.p>

          <motion.div
            className="flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            <Link
              href="/module/module-01"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              <BookOpen className="w-5 h-5" />
              학습 시작하기
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/demo/log-analyzer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--surface)] text-[var(--text-primary)] rounded-xl font-medium border border-[var(--border-color)] hover:bg-[var(--surface-elevated)] transition-colors"
            >
              <Code2 className="w-5 h-5" />
              PoC 데모 보기
            </Link>
          </motion.div>

          {completionPercent > 0 && (
            <motion.div
              className="mt-8 inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border-color)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="w-32 h-1.5 bg-[var(--surface-elevated)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--accent)] rounded-full transition-all"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <span className="text-sm text-[var(--text-secondary)]">
                {completionPercent}% 완료
              </span>
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "모듈", value: "6개", icon: Layers },
            { label: "챕터", value: "30개", icon: BookOpen },
            { label: "PoC 데모", value: "2개", icon: Cpu },
            { label: "실습 코드", value: "100+", icon: Code2 },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex items-center gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border-color)]"
            >
              <stat.icon className="w-8 h-8 text-[var(--accent)] shrink-0" />
              <div>
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--text-muted)]">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Module Grid */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <motion.h2
          className="text-2xl font-bold text-[var(--text-primary)] mb-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          커리큘럼
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod, i) => {
            const Icon = moduleIcons[i] || Brain;
            return (
              <motion.div
                key={mod.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Link
                  href={`/module/${mod.id}`}
                  className="block group p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border-color)] hover:border-[var(--accent)]/40 hover:shadow-lg hover:shadow-[var(--accent)]/5 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--accent)]/20 transition-colors">
                      <Icon className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-[var(--text-muted)] mb-1">
                        Module {i + 1}
                      </div>
                      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2 truncate">
                        {mod.title}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                        {mod.description}
                      </p>
                      <div className="text-xs text-[var(--text-muted)] mt-3">
                        {mod.chapters.length}개 챕터
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* PoC Demos */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <motion.h2
          className="text-2xl font-bold text-[var(--text-primary)] mb-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          인터랙티브 데모
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Link
              href="/demo/log-analyzer"
              className="block group p-6 rounded-2xl bg-gradient-to-br from-[var(--surface)] to-[var(--surface-elevated)]/50 border border-[var(--border-color)] hover:border-[var(--accent)]/40 transition-all duration-300"
            >
              <BarChart3 className="w-10 h-10 text-[var(--accent)] mb-4" />
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                서버 로그 분석기
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                3종 로그 포맷 파싱, 에러 빈도 타임라인, 이상 탐지 리포트를
                체험해보세요.
              </p>
              <span className="inline-flex items-center gap-1 text-sm text-[var(--accent)] group-hover:gap-2 transition-all">
                데모 시작 <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Link
              href="/demo/ops-dashboard"
              className="block group p-6 rounded-2xl bg-gradient-to-br from-[var(--surface)] to-[var(--surface-elevated)]/50 border border-[var(--border-color)] hover:border-[var(--accent)]/40 transition-all duration-300"
            >
              <Activity className="w-10 h-10 text-[var(--accent)] mb-4" />
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                운영 대시보드
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                실시간 메트릭 시뮬레이션, CPU/Memory/Disk/Network 모니터링,
                알림 시스템을 체험해보세요.
              </p>
              <span className="inline-flex items-center gap-1 text-sm text-[var(--accent)] group-hover:gap-2 transition-all">
                데모 시작 <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 text-center border-t border-[var(--border-color)]">
        <p className="text-sm text-[var(--text-muted)]">
          Samsung HI/SDI AI 교육 플랫폼 · Claude Code & Gemini CLI 하네스 기반 개발
        </p>
      </footer>
    </div>
  );
}
