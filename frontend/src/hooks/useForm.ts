import { useState, useCallback } from 'react';

interface ValidationRule {
  field: string;
  validate: (value: any) => boolean;
  message: string;
}

interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: ValidationRule[];
  onSubmit: (values: T) => Promise<void>;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  validationRules = [],
  onSubmit,
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (field: string, value: any) => {
      const fieldRules = validationRules.filter((rule) => rule.field === field);
      const fieldError = fieldRules.find((rule) => !rule.validate(value));
      return fieldError ? fieldError.message : '';
    },
    [validationRules]
  );

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    Object.keys(values).forEach((field) => {
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validateField]);

  const handleChange = useCallback(
    (field: string, value: any) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      if (touched[field]) {
        const error = validateField(field, value);
        setErrors((prev) => ({
          ...prev,
          [field]: error,
        }));
      }
    },
    [touched, validateField]
  );

  const handleBlur = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, values[field]);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  }, [values, validateField]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setTouched(
        Object.keys(values).reduce(
          (acc, field) => ({ ...acc, [field]: true }),
          {} as Record<string, boolean>
        )
      );

      if (validateForm()) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [values, validateForm, onSubmit]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    validateField,
    validateForm,
  };
}; 