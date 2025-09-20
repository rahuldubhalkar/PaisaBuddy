import { LearningModulesProvider } from '@/components/learning-modules-provider';

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return <LearningModulesProvider>{children}</LearningModulesProvider>;
}
