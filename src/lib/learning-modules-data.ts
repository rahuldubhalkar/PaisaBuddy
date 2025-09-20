import {
  PiggyBank,
  TrendingUp,
  Smartphone,
  Landmark,
  Gauge,
  HelpCircle,
} from 'lucide-react';

export const modules = [
  {
    id: 'budgeting-101',
    title: 'Budgeting 101',
    description: 'Master the art of creating and sticking to a budget. Take control of your money.',
    icon: 'PiggyBank' as const,
    progress: 75,
    status: 'In Progress',
    lessons: [
      { id: '1', title: 'Why Budget?', content: 'A budget helps you track your income and expenses, giving you control over your money.' },
      { id: '2', title: 'The 50/30/20 Rule', content: 'Allocate 50% of your income to needs, 30% to wants, and 20% to savings.' },
    ],
    quiz: {
      questions: [
        { id: 'q1', text: 'What is the main purpose of a budget?', options: ['To restrict spending', 'To track and control money', 'To increase income'], answer: 'To track and control money' },
        { id: 'q2', text: 'In the 50/30/20 rule, what does the 20% represent?', options: ['Needs', 'Wants', 'Savings'], answer: 'Savings' },
      ]
    }
  },
  {
    id: 'power-of-sips',
    title: 'Power of SIPs',
    description: 'Understand Systematic Investment Plans and how they help in wealth creation.',
    icon: 'TrendingUp' as const,
    progress: 40,
    status: 'In Progress',
    lessons: [
        { id: '1', title: 'What is a SIP?', content: 'A SIP allows you to invest a fixed amount in mutual funds at regular intervals.' },
        { id: '2', title: 'Benefits of SIPs', content: 'Rupee cost averaging and the power of compounding are key benefits.' },
    ],
    quiz: {
        questions: [
            { id: 'q1', text: 'What does SIP stand for?', options: ['Systematic Investment Plan', 'Simple Investment Product', 'Secure Investment Portfolio'], answer: 'Systematic Investment Plan' },
            { id: 'q2', text: 'What is a major benefit of SIPs?', options: ['Guaranteed returns', 'Rupee cost averaging', 'No market risk'], answer: 'Rupee cost averaging' },
        ]
    }
  },
  {
    id: 'upi-and-digital-payments',
    title: 'UPI & Digital Payments',
    description: 'Learn the ins and outs of UPI, wallets, and secure online transactions.',
    icon: 'Smartphone' as const,
    progress: 100,
    status: 'Completed',
    lessons: [
      { id: '1', title: 'Understanding UPI', content: 'UPI is an instant real-time payment system developed by NPCI.' },
      { id: '2', title: 'Staying Safe Online', content: 'Never share your UPI PIN with anyone. Beware of request money scams.' },
    ],
    quiz: {
      questions: [
        { id: 'q1', text: 'You should share your UPI PIN with customer support.', options: ['True', 'False'], answer: 'False' },
      ]
    }
  },
  {
    id: 'decoding-indian-taxes',
    title: 'Decoding Indian Taxes',
    description: 'A simple guide to understanding income tax, slabs, and deductions for salaried individuals.',
    icon: 'Landmark' as const,
    progress: 0,
    status: 'Start Learning',
    lessons: [
      { id: '1', title: 'What is Income Tax?', content: 'It is a tax levied by the government on the income of every person.' },
    ],
    quiz: {
      questions: [
        { id: 'q1', text: 'Who collects income tax?', options: ['State Government', 'Central Government', 'Local Municipality'], answer: 'Central Government' },
      ]
    }
  },
  {
    id: 'credit-score-explained',
    title: 'Credit Score Explained',
    description: 'Why your CIBIL score matters and how to build a strong credit history.',
    icon: 'Gauge' as const,
    progress: 0,
    status: 'Start Learning',
    lessons: [
      { id: '1', title: 'What is a Credit Score?', content: 'A 3-digit numeric summary of your credit history.' },
    ],
    quiz: {
      questions: [
        { id: 'q1', text: 'A higher credit score is better.', options: ['True', 'False'], answer: 'True' },
      ]
    }
  },
  {
    id: 'intro-to-mutual-funds',
    title: 'Intro to Mutual Funds',
    description: 'Demystify mutual funds, their types, and how to choose the right one for you.',
    icon: 'HelpCircle' as const,
    progress: 20,
    status: 'In Progress',
    lessons: [
      { id: '1', title: 'What are Mutual Funds?', content: 'A professionally managed investment fund that pools money from many investors to purchase securities.' },
    ],
    quiz: {
      questions: [
        { id: 'q1', text: 'Who manages a mutual fund?', options: ['The government', 'A professional fund manager', 'The investors themselves'], answer: 'A professional fund manager' },
      ]
    }
  },
];
