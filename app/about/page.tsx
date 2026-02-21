'use client'
import { useTheme } from '../context/ThemeContext'
import BackButton from './components/BackButton'
import ThemeToggleButton from './components/ThemeToggleButton'
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import BranchesSection from './components/BranchesSection'
import HowItWorksSection from './components/HowItWorksSection'
import CallToAction from './components/CallToAction'
import { BookOpen, CheckCircle, Layers, BarChart2, MessageCircle, TrendingUp, Award, BoxIcon } from 'lucide-react'
const features = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Comprehensive Syllabus Coverage',
    description: 'Track all subjects from 1st to 4th year across various engineering branches.',
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: 'Progress Tracking',
    description: 'Mark modules as completed and visualize your overall progress.',
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: 'Module Breakdown',
    description: 'View detailed module structures with topics for each subject.',
  },
  {
    icon: <BarChart2 className="w-6 h-6" />,
    title: 'Performance Analytics',
    description: 'See visual representations of your completion rates and study patterns.',
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: 'Group Chat Rooms',
    description: 'Create and join chat rooms to discuss syllabus topics and collaborate in real-time.',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'KPI/KPR Tracking',
    description: 'Monitor your Key Performance Indicators and Results to stay on track academically.',
  },
  {
    icon: <BoxIcon className="w-6 h-6" />,
    title: 'Performance Dashboard',
    description: 'A centralized dashboard providing insights into your study habits and progress.',
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: 'Makaut Exam Centric',
    description: 'Features tailored specifically to the Makaut university exam pattern and syllabus.',
  },
]

const branches = [
  'Computer Science (CSE)',
  'Electronics & Communication (ECE)',
  'Artificial Intelligence & Machine Learning (AIML)',
  'Data Science (DS)',
  'Electrical Engineering (EE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering',
  'Information Technology (IT)',
]

export default function AboutPage() {
  const { isDark, theme, toggleTheme } = useTheme()

  return (
    <main className="min-h-screen transition-colors duration-500"
      style={{
        background: isDark
          ? 'radial-gradient(ellipse at 30% 10%, #2a2a4a 0%, #1e1e2e 50%, #151520 100%)'
          : 'radial-gradient(ellipse at 30% 10%, #f0e9e2 0%, #e8e0d8 50%, #ddd5cc 100%)'
      }}
    >
      <BackButton isDark={isDark} />
      <ThemeToggleButton isDark={isDark} toggleTheme={toggleTheme} />

      <div className="max-w-7xl mx-auto px-6 py-20 sm:px-12 lg:px-16">
        <HeroSection isDark={isDark} />
        <FeaturesSection features={features} isDark={isDark} />
        <BranchesSection branches={branches} isDark={isDark} />
        <HowItWorksSection isDark={isDark} />
        <CallToAction isDark={isDark} />
      </div>
    </main>
  )
}