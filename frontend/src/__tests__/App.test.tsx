import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('should render the Task Manager heading', () => {
    render(<App />);
    expect(screen.getByText(/Task Manager/i)).toBeInTheDocument();
  });
}); 