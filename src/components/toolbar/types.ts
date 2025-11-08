export interface ToolbarButton {
  icon?: string;
  label: string;
  tooltip?: string;
  action: () => void;
}

export interface TabConfig {
  id: string;
  label: string;
  buttons: ToolbarButton[];
}
