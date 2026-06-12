// ---- Filter config types ------------------------------------------------

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterConfig =
  | {
      type: "select";
      key: string;
      label: string;
      options: FilterOption[];
    }
  | {
      type: "multi-select";
      key: string;
      label: string;
      options: FilterOption[];
    };
