type FormField = {
  id: string;
  label: string;
  type: "email" | "text" | "password";
};

type FormAction = {
  label: string;
  type: "submit" | "button";
  onClick?: () => void;
};

export type FormProps = {
  title: string;
  fields: FormField[];
  actions: FormAction[];
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onFormChange: (id: string, value: string) => void;
  isLoading: boolean;
};