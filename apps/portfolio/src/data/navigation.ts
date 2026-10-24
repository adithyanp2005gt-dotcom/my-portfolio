export interface NavItem {
  label: string;
  hash: string;
}

export const navigationItems: NavItem[] = [
  { label: 'Home', hash: '#home' },
  { label: 'Projects', hash: '#projects' },
  { label: 'Achievements', hash: '#achievements' },
  { label: 'Education', hash: '#education' },
  { label: 'Skills', hash: '#skills' },
  { label: 'About', hash: '#about' },
  { label: 'Contact', hash: '#contact' }
];
