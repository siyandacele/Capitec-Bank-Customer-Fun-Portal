import { z } from 'zod';

const requiredNumber = (message: string) =>
  z.preprocess(
    val => (val === '' || val === undefined || val === null ? undefined : Number(val)),
    z.number({ error: message }),
  );

const optionalNumber = () =>
  z.preprocess(
    val => (val === '' || val === undefined || val === null ? undefined : Number(val)),
    z.number({ error: 'Must be a number' }).optional(),
  );

export const personalInfoSchema = z.object({
  age: requiredNumber('Age is required').pipe(
    z
      .number()
      .int('Age must be a whole number')
      .min(18, 'Must be at least 18 years old')
      .max(65, 'Must be 65 or younger'),
  ),
  employmentStatus: z.enum(['employed', 'self_employed', 'unemployed', 'retired'], {
    error: 'Please select an employment status',
  }),
  employmentDuration: requiredNumber('Employment duration is required').pipe(
    z.number().int('Must be a whole number').min(3, 'Minimum 3 months required'),
  ),
});

export const financialInfoSchema = z.object({
  monthlyIncome: requiredNumber('Monthly income is required').pipe(
    z.number().min(5000, 'Minimum income is R5,000'),
  ),
  monthlyExpenses: requiredNumber('Monthly expenses is required').pipe(
    z.number().min(0, 'Cannot be negative'),
  ),
  existingDebt: optionalNumber().pipe(
    z.number().min(0, 'Cannot be negative').optional().default(0),
  ),
  creditScore: optionalNumber().pipe(
    z
      .number()
      .int('Must be a whole number')
      .min(300, 'Minimum score is 300')
      .max(850, 'Maximum score is 850')
      .optional(),
  ),
});

export const loanDetailsSchema = z.object({
  requestedAmount: requiredNumber('Requested amount is required').pipe(
    z
      .number()
      .min(5000, 'Minimum amount is R5,000')
      .max(300000, 'Maximum amount is R300,000'),
  ),
  loanTerm: requiredNumber('Loan term is required').pipe(
    z
      .number()
      .int('Must be a whole number')
      .min(6, 'Minimum 6 months')
      .max(60, 'Maximum 60 months'),
  ),
  loanPurpose: z.enum(
    ['home_improvement', 'debt_consolidation', 'education', 'medical', 'other'],
    { error: 'Please select a loan purpose' },
  ),
});

export const paymentCalculatorSchema = z.object({
  loanAmount: requiredNumber('Loan amount is required').pipe(
    z.number().min(5000, 'Minimum amount is R5,000'),
  ),
  loanTerm: requiredNumber('Loan term is required').pipe(
    z
      .number()
      .int('Must be a whole number')
      .min(6, 'Minimum 6 months')
      .max(72, 'Maximum 72 months'),
  ),
  creditScore: requiredNumber('Credit score is required').pipe(
    z
      .number()
      .int('Must be a whole number')
      .min(300, 'Minimum score is 300')
      .max(850, 'Maximum score is 850'),
  ),
  loanType: z.enum(['personal_loan', 'vehicle_loan'], {
    error: 'Please select a loan type',
  }),
});

export const eligibilityFormSchema = z.object({
  ...personalInfoSchema.shape,
  ...financialInfoSchema.shape,
  ...loanDetailsSchema.shape,
});

export type EligibilityFormValues = z.infer<typeof eligibilityFormSchema>;
export type PaymentCalculatorFormValues = z.infer<typeof paymentCalculatorSchema>;

export const stepSchemas = [
  personalInfoSchema,
  financialInfoSchema,
  loanDetailsSchema,
] as const;
