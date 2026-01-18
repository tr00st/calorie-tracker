import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditQuickLogBody from './EditQuickLogBody';
import * as queries from '../../utils/queries';

// Mock the queries module
vi.mock('../../utils/queries', () => ({
    useUpdateLogEntryMutation: vi.fn(),
}));

describe('EditQuickLogBody', () => {
    const mockOnClose = vi.fn();
    const mockMutate = vi.fn();

    const defaultProps = {
        onClose: mockOnClose,
        id: 123,
        timestamp: '2024-01-15T10:30:00.000Z',
        initialLabel: 'Test Food',
        initialCalories: 250,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(queries.useUpdateLogEntryMutation).mockReturnValue({
            mutate: mockMutate,
        } as any);
    });

    it('renders with initial values', () => {
        render(<EditQuickLogBody {...defaultProps} />);

        expect(screen.getByText('Edit Log Entry')).toBeInTheDocument();
        expect(screen.getByLabelText('Description')).toHaveValue('Test Food');
        expect(screen.getByLabelText(/Calories/)).toHaveValue(250);
    });

    it('enables Save button when calories are valid', () => {
        render(<EditQuickLogBody {...defaultProps} />);

        const saveButton = screen.getByRole('button', { name: 'Save' });
        expect(saveButton).not.toBeDisabled();
    });

    it('disables Save button when calories are zero', async () => {
        render(<EditQuickLogBody {...defaultProps} />);

        const caloriesInput = screen.getByLabelText(/Calories/);
        await userEvent.clear(caloriesInput);
        await userEvent.type(caloriesInput, '0');

        const saveButton = screen.getByRole('button', { name: 'Save' });
        expect(saveButton).toBeDisabled();
    });

    it('updates description field', async () => {
        render(<EditQuickLogBody {...defaultProps} />);

        const descriptionInput = screen.getByLabelText('Description');
        await userEvent.clear(descriptionInput);
        await userEvent.type(descriptionInput, 'Updated Food');

        expect(descriptionInput).toHaveValue('Updated Food');
    });

    it('updates calories field', async () => {
        render(<EditQuickLogBody {...defaultProps} />);

        const caloriesInput = screen.getByLabelText(/Calories/);
        await userEvent.clear(caloriesInput);
        await userEvent.type(caloriesInput, '350');

        expect(caloriesInput).toHaveValue(350);
    });

    it('calls mutation with updated values on Save click', async () => {
        render(<EditQuickLogBody {...defaultProps} />);

        const descriptionInput = screen.getByLabelText('Description');
        const caloriesInput = screen.getByLabelText(/Calories/);

        await userEvent.clear(descriptionInput);
        await userEvent.type(descriptionInput, 'Updated Food');

        await userEvent.clear(caloriesInput);
        await userEvent.type(caloriesInput, '350');

        const saveButton = screen.getByRole('button', { name: 'Save' });
        await userEvent.click(saveButton);

        expect(mockMutate).toHaveBeenCalledWith({
            id: 123,
            timestamp: '2024-01-15T10:30:00.000Z',
            description: 'Updated Food',
            calories_override: 350,
        });
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('closes dialog on Cancel click', async () => {
        render(<EditQuickLogBody {...defaultProps} />);

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        await userEvent.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalled();
        expect(mockMutate).not.toHaveBeenCalled();
    });

    it('submits on Enter key press when form is valid', async () => {
        render(<EditQuickLogBody {...defaultProps} />);

        const descriptionInput = screen.getByLabelText('Description');
        await userEvent.clear(descriptionInput);
        await userEvent.type(descriptionInput, 'Updated Food{Enter}');

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledWith({
                id: 123,
                timestamp: '2024-01-15T10:30:00.000Z',
                description: 'Updated Food',
                calories_override: 250,
            });
        });
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('does not submit on Enter key press when form is invalid', async () => {
        render(<EditQuickLogBody {...defaultProps} />);

        const caloriesInput = screen.getByLabelText(/Calories/);
        await userEvent.clear(caloriesInput);
        await userEvent.type(caloriesInput, '0{Enter}');

        expect(mockMutate).not.toHaveBeenCalled();
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('allows negative calories (consistent with AddQuickLogBody)', async () => {
        render(<EditQuickLogBody {...defaultProps} />);

        const caloriesInput = screen.getByLabelText(/Calories/);
        await userEvent.clear(caloriesInput);
        await userEvent.type(caloriesInput, '-100');

        const saveButton = screen.getByRole('button', { name: 'Save' });
        expect(saveButton).not.toBeDisabled();

        await userEvent.click(saveButton);

        expect(mockMutate).toHaveBeenCalledWith({
            id: 123,
            timestamp: '2024-01-15T10:30:00.000Z',
            description: 'Test Food',
            calories_override: -100,
        });
    });
});
