import { useState } from 'react';
import { Formik, Form, Field, type FieldProps } from 'formik';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, Wallet, FileText, Check } from 'lucide-react';
import {
  stepSchemas,
  type EligibilityFormValues,
} from '../schemas';
import type { EligibilityRequest } from '@/types/loan';

interface EligibilityFormProps {
  onSubmit: (data: EligibilityRequest) => void;
  isPending: boolean;
}

const STEPS = [
  { label: 'Personal Info', icon: User },
  { label: 'Financial Info', icon: Wallet },
  { label: 'Loan Details', icon: FileText },
] as const;

const initialValues: EligibilityFormValues = {
  age: '' as unknown as number,
  employmentStatus: 'employed',
  employmentDuration: '' as unknown as number,
  monthlyIncome: '' as unknown as number,
  monthlyExpenses: '' as unknown as number,
  existingDebt: '' as unknown as number,
  creditScore: undefined,
  requestedAmount: '' as unknown as number,
  loanTerm: '' as unknown as number,
  loanPurpose: 'home_improvement',
};

function validateStep(step: number, values: EligibilityFormValues) {
  const schema = stepSchemas[step];
  const stepFields = Object.keys(schema.shape) as (keyof EligibilityFormValues)[];
  const stepValues = Object.fromEntries(
    stepFields.map((key) => [key, values[key]])
  );

  const result = schema.safeParse(stepValues);
  if (result.success) return {};

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as string;
    if (!errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
}

function FieldError({ name, errors, touched }: { name: string; errors: Record<string, string>; touched: Record<string, boolean> }) {
  if (!touched[name] || !errors[name]) return null;
  return <p className="loan-form__error">{errors[name]}</p>;
}

export default function EligibilityForm({ onSubmit, isPending }: EligibilityFormProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleFormSubmit = (values: EligibilityFormValues) => {
    const request: EligibilityRequest = {
      personalInfo: {
        age: Number(values.age),
        employmentStatus: values.employmentStatus,
        employmentDuration: Number(values.employmentDuration),
      },
      financialInfo: {
        monthlyIncome: Number(values.monthlyIncome),
        monthlyExpenses: Number(values.monthlyExpenses),
        existingDebt: Number(values.existingDebt || 0),
        creditScore: values.creditScore ? Number(values.creditScore) : undefined,
      },
      loanDetails: {
        requestedAmount: Number(values.requestedAmount),
        loanTerm: Number(values.loanTerm),
        loanPurpose: values.loanPurpose,
      },
    };
    onSubmit(request);
  };

  return (
    <Card className="loan-form">
      <CardHeader>
        <CardTitle>Check Your Eligibility</CardTitle>
        <CardDescription>Enter your details to see if you qualify for a loan</CardDescription>
      </CardHeader>
      <CardContent>
        <nav className="loan-stepper" aria-label="Form steps">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div key={step.label} className="loan-stepper__item-wrapper">
                <button
                  type="button"
                  className={`loan-stepper__item ${isActive ? 'loan-stepper__item--active' : ''} ${isCompleted ? 'loan-stepper__item--completed' : ''}`}
                  onClick={() => {
                    if (isCompleted) setCurrentStep(index);
                  }}
                  aria-current={isActive ? 'step' : undefined}
                  disabled={!isCompleted && !isActive}
                >
                  <span className="loan-stepper__icon">
                    {isCompleted ? <Check size={16} /> : <Icon size={16} />}
                  </span>
                  <span className="loan-stepper__label">{step.label}</span>
                </button>
                {index < STEPS.length - 1 && (
                  <div className={`loan-stepper__connector ${isCompleted ? 'loan-stepper__connector--completed' : ''}`} />
                )}
              </div>
            );
          })}
        </nav>

        <Formik
          initialValues={initialValues}
          validate={(values) => validateStep(currentStep, values)}
          onSubmit={handleFormSubmit}
          validateOnChange={false}
          validateOnBlur={true}
        >
          {({ values, errors, touched, setFieldValue, setTouched, validateForm }) => {
            const goToNext = async (e: React.MouseEvent) => {
              e.preventDefault();

              const schema = stepSchemas[currentStep];
              const stepFields = Object.keys(schema.shape);

              const newTouched = { ...touched };
              for (const field of stepFields) {
                newTouched[field as keyof typeof newTouched] = true;
              }
              await setTouched(newTouched);

              const stepErrors = validateStep(currentStep, values);

              if (Object.keys(stepErrors).length === 0) {
                const nextSchema = stepSchemas[currentStep + 1];
                if (nextSchema) {
                  const nextFields = Object.keys(nextSchema.shape);
                  const clearedTouched = { ...newTouched };
                  for (const field of nextFields) {
                    clearedTouched[field as keyof typeof clearedTouched] = false;
                  }
                  await setTouched(clearedTouched, false);
                }
                setCurrentStep((s) => s + 1);
              } else {
                await validateForm();
              }
            };

            const goToPrev = () => setCurrentStep((s) => s - 1);

            return (
              <Form className="loan-form__sections">
                {currentStep === 0 && (
                  <div className="loan-form__section">
                    <h3 className="loan-form__section-title">Personal Information</h3>
                    <div className="loan-form__fields">
                      <div className="loan-form__field">
                        <Label htmlFor="age">Age</Label>
                        <Field name="age">
                          {({ field }: FieldProps) => (
                            <Input
                              {...field}
                              id="age"
                              type="number"
                              placeholder="35"
                              min={18}
                              max={65}
                            />
                          )}
                        </Field>
                        <FieldError name="age" errors={errors as Record<string, string>} touched={touched as Record<string, boolean>} />
                      </div>

                      <div className="loan-form__field">
                        <Label htmlFor="employmentStatus">Employment Status</Label>
                        <Select
                          value={values.employmentStatus}
                          onValueChange={(val) => setFieldValue('employmentStatus', val)}
                        >
                          <SelectTrigger id="employmentStatus">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="employed">Employed</SelectItem>
                            <SelectItem value="self_employed">Self Employed</SelectItem>
                            <SelectItem value="unemployed">Unemployed</SelectItem>
                            <SelectItem value="retired">Retired</SelectItem>
                          </SelectContent>
                        </Select>
                        <FieldError name="employmentStatus" errors={errors as Record<string, string>} touched={touched as Record<string, boolean>} />
                      </div>

                      <div className="loan-form__field">
                        <Label htmlFor="employmentDuration">Employment Duration (months)</Label>
                        <Field name="employmentDuration">
                          {({ field }: FieldProps) => (
                            <Input
                              {...field}
                              id="employmentDuration"
                              type="number"
                              placeholder="24"
                              min={3}
                            />
                          )}
                        </Field>
                        <p className="loan-form__hint">Minimum 3 months required</p>
                        <FieldError name="employmentDuration" errors={errors as Record<string, string>} touched={touched as Record<string, boolean>} />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="loan-form__section">
                    <h3 className="loan-form__section-title">Financial Information</h3>
                    <div className="loan-form__fields">
                      <div className="loan-form__field">
                        <Label htmlFor="monthlyIncome">Monthly Income (R)</Label>
                        <Field name="monthlyIncome">
                          {({ field }: FieldProps) => (
                            <Input
                              {...field}
                              id="monthlyIncome"
                              type="number"
                              placeholder="25000"
                              min={5000}
                              step="100"
                            />
                          )}
                        </Field>
                        <FieldError name="monthlyIncome" errors={errors as Record<string, string>} touched={touched as Record<string, boolean>} />
                      </div>

                      <div className="loan-form__field">
                        <Label htmlFor="monthlyExpenses">Monthly Expenses (R)</Label>
                        <Field name="monthlyExpenses">
                          {({ field }: FieldProps) => (
                            <Input
                              {...field}
                              id="monthlyExpenses"
                              type="number"
                              placeholder="15000"
                              min={0}
                              step="100"
                            />
                          )}
                        </Field>
                        <FieldError name="monthlyExpenses" errors={errors as Record<string, string>} touched={touched as Record<string, boolean>} />
                      </div>

                      <div className="loan-form__field">
                        <Label htmlFor="existingDebt">Existing Monthly Debt (R)</Label>
                        <Field name="existingDebt">
                          {({ field }: FieldProps) => (
                            <Input
                              {...field}
                              id="existingDebt"
                              type="number"
                              placeholder="5000"
                              min={0}
                              step="100"
                            />
                          )}
                        </Field>
                        <FieldError name="existingDebt" errors={errors as Record<string, string>} touched={touched as Record<string, boolean>} />
                      </div>

                      <div className="loan-form__field">
                        <Label htmlFor="creditScore">Credit Score (optional)</Label>
                        <Field name="creditScore">
                          {({ field }: FieldProps) => (
                            <Input
                              {...field}
                              id="creditScore"
                              type="number"
                              placeholder="650"
                              min={300}
                              max={850}
                              value={field.value ?? ''}
                            />
                          )}
                        </Field>
                        <p className="loan-form__hint">Range: 300-850</p>
                        <FieldError name="creditScore" errors={errors as Record<string, string>} touched={touched as Record<string, boolean>} />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="loan-form__section">
                    <h3 className="loan-form__section-title">Loan Details</h3>
                    <div className="loan-form__fields">
                      <div className="loan-form__field">
                        <Label htmlFor="requestedAmount">Requested Amount (R)</Label>
                        <Field name="requestedAmount">
                          {({ field }: FieldProps) => (
                            <Input
                              {...field}
                              id="requestedAmount"
                              type="number"
                              placeholder="150000"
                              min={5000}
                              max={300000}
                              step="1000"
                            />
                          )}
                        </Field>
                        <p className="loan-form__hint">Between R5,000 and R300,000</p>
                        <FieldError name="requestedAmount" errors={errors as Record<string, string>} touched={touched as Record<string, boolean>} />
                      </div>

                      <div className="loan-form__field">
                        <Label htmlFor="loanTerm">Loan Term (months)</Label>
                        <Field name="loanTerm">
                          {({ field }: FieldProps) => (
                            <Input
                              {...field}
                              id="loanTerm"
                              type="number"
                              placeholder="24"
                              min={6}
                              max={60}
                            />
                          )}
                        </Field>
                        <p className="loan-form__hint">Between 6 and 60 months</p>
                        <FieldError name="loanTerm" errors={errors as Record<string, string>} touched={touched as Record<string, boolean>} />
                      </div>

                      <div className="loan-form__field">
                        <Label htmlFor="loanPurpose">Loan Purpose</Label>
                        <Select
                          value={values.loanPurpose}
                          onValueChange={(val) => setFieldValue('loanPurpose', val)}
                        >
                          <SelectTrigger id="loanPurpose">
                            <SelectValue placeholder="Select purpose" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="home_improvement">Home Improvement</SelectItem>
                            <SelectItem value="debt_consolidation">Debt Consolidation</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="medical">Medical</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FieldError name="loanPurpose" errors={errors as Record<string, string>} touched={touched as Record<string, boolean>} />
                      </div>
                    </div>
                  </div>
                )}

                <div className="button--v2-group loan-form__nav">
                  {currentStep > 0 && (
                    <button type="button" className="btn button--v2 button--v2--secondary" onClick={goToPrev}>
                      Previous
                    </button>
                  )}
                  {currentStep < STEPS.length - 1 ? (
                    <button type="button" className="btn button--v2 ml-auto" onClick={goToNext}>
                      Next
                    </button>
                  ) : (
                    <button type="submit" className="btn button--v2 ml-auto" disabled={isPending}>
                      {isPending ? 'Checking...' : 'Check Eligibility'}
                    </button>
                  )}
                </div>
              </Form>
            );
          }}
        </Formik>
      </CardContent>
    </Card>
  );
}
