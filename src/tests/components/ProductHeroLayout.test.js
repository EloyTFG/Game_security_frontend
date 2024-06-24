
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductHeroLayout from '../../components/ProductHeroLayout';

describe('ProductHeroLayout Component', () => {
  const sxBackground = {
    backgroundImage: 'url(/static/images/test.jpg)',
    backgroundPosition: 'center',
  };

  test('renders children elements', () => {
    render(
      <ProductHeroLayout sxBackground={sxBackground}>
        <div data-testid="child">Child Content</div>
      </ProductHeroLayout>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText(/child content/i)).toBeInTheDocument();
  });

  
  
});
