import { ValidationRuleObject } from 'fastest-validator';

export interface ValidationRules {
  [x: string]: ValidationRuleObject;
}

export interface CustomValidationSchema {
  body?: ValidationRules;
  params?: ValidationRules;
  query?: ValidationRules;
}
