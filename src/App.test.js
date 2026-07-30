import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the operations dashboard shell', () => {
  render(<App />);
  expect(screen.getByText(/BARBAZA COOPERATIVE/i)).toBeInTheDocument();
  expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
});
