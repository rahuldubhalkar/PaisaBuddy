import { LucideIcon } from 'lucide-react';

export interface Module {
    id: string;
    title: string;
    description: string;
    icon: keyof typeof import('lucide-react');
    progress: number;
    lessons: {
        id: string;
        title: string;
        content: string;
    }[];
    quiz: {
        questions: {
            id: string;
            text: string;
            options: string[];
            answer: string;
        }[];
    };
}


export const modules: Module[] = [
  {
    id: 'budgeting-basics',
    title: 'Budgeting Basics – Master Your Money',
    description: 'Understand the importance of budgeting, track income and expenses, and explore frameworks like the 50-30-20 rule.',
    icon: 'PiggyBank',
    progress: 0,
    lessons: [
      { id: '1', title: 'Why is Budgeting Important?', content: 'Budgeting is crucial for financial stability. It empowers you to track your income, manage your expenses, and consciously allocate funds towards your savings and financial goals, giving you full control over your money.' },
      { id: '2', title: 'The 50-30-20 Rule Explained', content: 'A simple yet effective budgeting framework. Allocate 50% of your income to "Needs" (rent, groceries, utilities), 30% to "Wants" (dining out, entertainment), and dedicate 20% to "Savings & Investments".' },
      { id: '3', title: 'Interactive Budget Builder', content: 'Use our interactive tool to drag-and-drop your monthly income into different categories. Handle unexpected expense scenarios and see the real-time impact on your savings goals.' },
    ],
    quiz: {
      questions: [
        { id: 'q1', text: 'According to the 50-30-20 rule, what percentage of income should be allocated to "Wants"?', options: ['50%', '30%', '20%'], answer: '30%' },
        { id: 'q2', text: 'What is the primary goal of creating a budget?', options: ['To stop spending on hobbies', 'To gain control over your financial situation', 'To find ways to earn more money'], answer: 'To gain control over your financial situation' },
      ]
    }
  },
  {
    id: 'sips-small-steps',
    title: 'SIPs – Small Steps, Big Future',
    description: 'Learn what Systematic Investment Plans (SIPs) are, the benefits of compounding, and how they compare to lump-sum investments.',
    icon: 'TrendingUp',
    progress: 0,
    lessons: [
        { id: '1', title: 'What is a Systematic Investment Plan (SIP)?', content: 'A SIP is an investment method where you invest a fixed amount of money in mutual funds at regular intervals (usually monthly). It promotes disciplined investing and makes it easier to start without a large initial sum.' },
        { id: '2', title: 'The Magic of Compounding & Rupee Cost Averaging', content: 'Compounding means earning returns on your returns. Over time, this can lead to exponential growth. Rupee Cost Averaging means you buy more units when the market is low and fewer when it is high, averaging out your purchase cost.' },
        { id: '3_sip_sim', title: 'SIP Growth Simulator', content: 'Try our SIP simulator! Adjust your monthly investment amount and see how your wealth could grow over 5, 10, or 20 years. Compare this with a one-time lump-sum investment to understand market volatility.'}
    ],
    quiz: {
        questions: [
            { id: 'q1', text: 'What financial concept is known as "earning returns on your returns"?', options: ['Rupee Cost Averaging', 'Compounding', 'Diversification'], answer: 'Compounding' },
            { id: 'q2', text: 'A SIP helps you benefit from market volatility through...?', options: ['Guaranteed profits', 'Rupee Cost Averaging', 'Fixed interest rates'], answer: 'Rupee Cost Averaging' },
        ]
    }
  },
  {
    id: 'upi-digital-revolution',
    title: 'UPI – India’s Digital Revolution',
    description: 'Understand how UPI works, its role in digital payments, and how to transact securely.',
    icon: 'Smartphone',
    progress: 0,
    lessons: [
      { id: '1', title: 'How Does UPI Work?', content: 'The Unified Payments Interface (UPI) is an instant payment system that allows you to transfer money between bank accounts using a mobile device. All you need is a Virtual Payment Address (VPA) or UPI ID.' },
      { id: '2', title: 'Spotting UPI Fraud', content: 'Beware of common scams! Never enter your PIN to *receive* money. Approving a payment request sends money *from* your account. Be cautious of unsolicited requests from unknown contacts.' },
    ],
    quiz: {
      questions: [
        { id: 'q1', text: 'What should you do if you receive a UPI payment request from an unknown person for "winning a lottery"?', options: ['Approve the request to get the money', 'Decline the request and block the sender', 'Enter your PIN to verify'], answer: 'Decline the request and block the sender' },
      ]
    }
  },
  {
    id: 'taxes-demystifying-deductions',
    title: 'Taxes – Demystifying Deductions',
    description: 'Grasp the basics of income tax in India, common deductions like 80C, and the importance of filing returns.',
    icon: 'Landmark',
    progress: 0,
    lessons: [
      { id: '1', title: 'Basics of Income Tax in India', content: 'Income tax is a tax paid by individuals on their earnings. The amount you pay depends on which tax slab your income falls into. Filing your tax return is a legal requirement.' },
      { id: '2', title: 'Common Tax Deductions (Section 80C)', content: 'Section 80C of the Income Tax Act allows you to reduce your taxable income by up to ₹1.5 lakh by investing in specific instruments like PPF, ELSS mutual funds, and life insurance premiums.' },
    ],
    quiz: {
      questions: [
        { id: 'q1', text: 'What is the maximum deduction allowed under Section 80C?', options: ['₹50,000', '₹1,00,000', '₹1,50,000'], answer: '₹1,50,000' },
      ]
    }
  },
  {
    id: 'credit-score-management',
    title: 'Credit Score Management',
    description: 'Learn what a credit score is, factors that impact it, and how to build a healthy score.',
    icon: 'Gauge',
    progress: 0,
    lessons: [
      { id: '1', title: 'What is a Credit Score and Why It Matters?', content: 'A credit score (like a CIBIL score) is a 3-digit number between 300-900 that represents your creditworthiness. Lenders use it to decide whether to approve loans or credit cards. A higher score means better financial health.' },
      { id: '2', title: 'How to Build a Good Credit Score', content: 'Always pay your credit card bills and loan EMIs on time. Keep your credit utilization ratio low (below 30%). Avoid applying for too much credit at once. A long history of responsible credit use helps build a strong score.' },
    ],
    quiz: {
      questions: [
        { id: 'q1', text: 'Which of the following actions is most likely to improve your credit score?', options: ['Missing an EMI payment', 'Paying your credit card bill in full and on time', 'Applying for five new credit cards in one week'], answer: 'Paying your credit card bill in full and on time' },
      ]
    }
  },
  {
    id: 'intro-to-mutual-funds',
    title: 'Intro to Mutual Funds',
    description: 'Demystify mutual funds, their types, and how to choose the right one for you.',
    icon: 'HelpCircle',
    progress: 0,
    lessons: [
      { id: '1', title: 'What are Mutual Funds?', content: 'A mutual fund is a company that pools money from many investors and invests the money in securities such as stocks, bonds, and short-term debt. The combined holdings of the mutual fund are known as its portfolio.' },
    ],
    quiz: {
      questions: [
        { id: 'q1', text: 'Who manages a mutual fund?', options: ['The government', 'A professional fund manager', 'The investors themselves'], answer: 'A professional fund manager' },
      ]
    }
  },
];
