import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ThumbsDown, ThumbsUp, ShieldQuestion } from 'lucide-react';

const challenges = [
  {
    id: 'phishing-email',
    title: 'Phishing Email Challenge',
    scenario:
      'You receive an email from "YourBank Support" with the subject "Action Required: Your Account is Temporarily Locked". It states that suspicious activity was detected and you must click a link to verify your identity immediately. The link looks like "yourbank.security.login-portal.com".',
    question: 'What should you do?',
    options: [
      { text: 'Click the link and log in', correct: false, feedback: 'Incorrect. This is a classic phishing attempt. The URL is fake and designed to steal your credentials.' },
      { text: 'Delete the email and report as spam', correct: true, feedback: 'Correct! Never click links in unsolicited emails. Always go to your bank\'s official website directly.' },
      { text: 'Reply with your account details', correct: false, feedback: 'Incorrect. Never share personal or financial details over email. Your bank will never ask for this.' },
    ],
  },
  {
    id: 'upi-fraud',
    title: 'UPI "Request Money" Scam',
    scenario:
      'You listed an old phone for sale online. A buyer contacts you and agrees to pay via UPI. Instead of sending money, you receive a UPI "Request" for the same amount with a note saying "Approve this request to receive payment".',
    question: 'What does this mean?',
    options: [
      { text: 'Approving will credit money to my account', correct: false, feedback: 'Incorrect. Approving a "Request" will DEBIT money from your account. This is a common scam.' },
      { text: 'This is a standard way to receive money', correct: false, feedback: 'Incorrect. To receive money, you just need to share your UPI ID or QR code. You never need to approve a request or enter your PIN.' },
      { text: 'This is a scam to debit my account', correct: true, feedback: 'Correct! The fraudster is trying to trick you into sending them money instead of the other way around.' },
    ],
  },
    {
    id: 'fake-investment',
    title: 'Fake Investment Scheme',
    scenario:
      'You see a social media ad for an investment scheme that promises "guaranteed 30% monthly returns" on your investment with "zero risk". To join, you just need to transfer money to a personal UPI ID.',
    question: 'Is this a legitimate investment?',
    options: [
      { text: 'Yes, high returns are possible with new tech', correct: false, feedback: 'Incorrect. Unrealistic "guaranteed" returns are a major red flag for Ponzi schemes. Legitimate investments always carry risk.' },
      { text: 'No, this is likely a fraudulent scheme', correct:true, feedback: 'Correct! Guaranteed high returns, pressure to invest quickly, and payments to personal accounts are all signs of a scam.' },
    ],
  },
];

export default function FraudDetectionPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Fraud Detection Challenges
        </h1>
        <p className="text-muted-foreground">
          Learn to spot and avoid common financial scams. Test your knowledge!
        </p>
      </div>

      <Accordion type="single" collapsible defaultValue="phishing-email" className="w-full">
        {challenges.map((challenge) => (
          <AccordionItem value={challenge.id} key={challenge.id}>
            <AccordionTrigger className="text-lg">
                <div className="flex items-center gap-3">
                    <ShieldQuestion className="h-5 w-5 text-primary" />
                    {challenge.title}
                </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <Alert variant="default">
                <AlertTitle>The Scenario</AlertTitle>
                <AlertDescription>{challenge.scenario}</AlertDescription>
              </Alert>
              <p className="font-semibold">{challenge.question}</p>
              <div className="flex flex-col sm:flex-row gap-2">
                {challenge.options.map((option, index) => (
                  <div key={index} className="flex-1">
                    <Alert variant={option.correct ? "default" : "destructive"} className="flex items-center gap-3">
                      {option.correct ? <ThumbsUp className="h-5 w-5" /> : <ThumbsDown className="h-5 w-5" />}
                      <div>
                        <AlertTitle>{option.text}</AlertTitle>
                        <AlertDescription>{option.feedback}</AlertDescription>
                      </div>
                    </Alert>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
