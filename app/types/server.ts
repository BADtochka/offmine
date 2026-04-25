export interface Server {
  ip: string;
  label: string;
  mirrors: Mirror[];
}

export interface Mirror {
  ip: string;
  label: string;
}
