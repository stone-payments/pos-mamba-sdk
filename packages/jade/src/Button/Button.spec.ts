import { fireEvent, render } from '@testing-library/svelte';
import Button from './Button.svelte';

const label = 'Click me';

interface IButtonProps {
  label?: string;
  size?: 'small' | 'normal' | 'fill' | 'full';
  disabled?: boolean;
  secondary?: boolean;
  bottom?: boolean;
  bgColor?: string;
  textColor?: string;
  width?: string;
}

const renderButton = (props: IButtonProps = {}) => render(Button, props).getByRole('button');

describe('Button', () => {
  it('renders a button element', () => {
    const buttonElement = renderButton();
    expect(buttonElement).toBeInTheDocument();
  });

  it('render the correct label', () => {
    const buttonElement = renderButton({ label });
    expect(buttonElement).toHaveTextContent(label);
  });

  it('triggers click event handler', async () => {
    const buttonElement = renderButton();
    let checked = false;
    buttonElement.onclick = () => {
      checked = true;
    };
    await fireEvent.click(buttonElement);
    expect(checked).toBe(true);
  });
});

describe('Button class names', () => {
  it('applies "at-bottom" class when "bottom" prop is true', () => {
    const buttonElement = renderButton({ bottom: true });
    expect(buttonElement).toHaveClass('at-bottom');
  });

  it('not applies "at-bottom" class when "bottom" prop is false', () => {
    const buttonElement = renderButton({ bottom: false });
    expect(buttonElement).not.toHaveClass('at-bottom');
  });

  it('applies "is-secondary" class when "secondary" prop is true', () => {
    const buttonElement = renderButton({ secondary: true });
    expect(buttonElement).toHaveClass('is-secondary');
  });

  it('applies "is-secondary" class when "secondary" prop is true', () => {
    const buttonElement = renderButton({ secondary: true });
    expect(buttonElement).toHaveClass('is-secondary');
  });

  it('applies "size-normal" class by default', () => {
    const buttonElement = renderButton({ size: 'normal' });
    expect(buttonElement).toHaveClass('size-normal');
  });

  it('applies "size-small" class when "size" prop is "small"', () => {
    const buttonElement = renderButton({ size: 'small' });
    expect(buttonElement).toHaveClass('size-small');
  });

  it('applies "size-fill" class when "size" prop is "fill"', () => {
    const buttonElement = renderButton({ size: 'fill' });
    expect(buttonElement).toHaveClass('size-fill');
  });

  it('applies "size-full" class when "size" prop is "full"', () => {
    const buttonElement = renderButton({ size: 'full' });
    expect(buttonElement).toHaveClass('size-full');
  });
});
