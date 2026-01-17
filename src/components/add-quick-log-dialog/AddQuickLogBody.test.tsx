import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddQuickLogBody from './AddQuickLogBody';
import * as queries from '../../utils/queries';
import { DateTime } from 'luxon';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';

// Mock the queries module
vi.mock('../../utils/queries', () => ({
    useInsertLogEntryMutation: vi.fn(),
}));

// Mock FoodSearchBox since it requires Supabase context
vi.mock('./FoodSearchBox', () => ({
    default: ({ onChange, disabled }: any) => (
        <div data-testid="food-search-box">
            <button
                onClick={() => onChange(null)}
                disabled={disabled}
            >
                Clear Food
            </button>
        </div>
    ),
}));

describe('AddQuickLogBody', () => {
    const mockOnClose = vi.fn();
    const mockMutate = vi.fn();

    const entryDate = DateTime.fromISO('2024-01-15');

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(queries.useInsertLogEntryMutation).mockReturnValue({
            mutate: mockMutate,
        } as any);
    });

    const renderWithProvider = (ui: React.ReactElement) => {
        return render(
            <LocalizationProvider dateAdapter={AdapterLuxon}>
                {ui}
            </LocalizationProvider>,
        );
    };

    it('renders with correct title', () => {
        renderWithProvider(<AddQuickLogBody onClose={mockOnClose} entryDate={entryDate} />);

        expect(screen.getByText('Add Log Entry')).toBeInTheDocument();
    });

    it('renders Quick Set Calories input by default', () => {
        renderWithProvider(<AddQuickLogBody onClose={mockOnClose} entryDate={entryDate} />);

        expect(screen.getByLabelText(/Quick Set Calories/)).toBeInTheDocument();
        expect(screen.getByLabelText('Description')).toBeInTheDocument();
    });

    it('disables Add button when no calories are entered', () => {
        renderWithProvider(<AddQuickLogBody onClose={mockOnClose} entryDate={entryDate} />);

        const addButton = screen.getByRole('button', { name: 'Add' });
        expect(addButton).toBeDisabled();
    });

    it('enables Add button when valid calories are entered', async () => {
        renderWithProvider(<AddQuickLogBody onClose={mockOnClose} entryDate={entryDate} />);

        const caloriesInput = screen.getByLabelText(/Quick Set Calories/);
        await userEvent.type(caloriesInput, '250');

        const addButton = screen.getByRole('button', { name: 'Add' });
        expect(addButton).not.toBeDisabled();
    });

    it('keeps Add button disabled when calories are zero', async () => {
        renderWithProvider(<AddQuickLogBody onClose={mockOnClose} entryDate={entryDate} />);

        const caloriesInput = screen.getByLabelText(/Quick Set Calories/);
        await userEvent.type(caloriesInput, '0');

        const addButton = screen.getByRole('button', { name: 'Add' });
        expect(addButton).toBeDisabled();
    });

    it('updates description field', async () => {
        renderWithProvider(<AddQuickLogBody onClose={mockOnClose} entryDate={entryDate} />);

        const descriptionInput = screen.getByLabelText('Description');
        await userEvent.type(descriptionInput, 'Test Food');

        expect(descriptionInput).toHaveValue('Test Food');
    });

    it('calls mutation with correct values on Add click', async () => {
        renderWithProvider(<AddQuickLogBody onClose={mockOnClose} entryDate={entryDate} />);

        const caloriesInput = screen.getByLabelText(/Quick Set Calories/);
        const descriptionInput = screen.getByLabelText('Description');

        await userEvent.type(caloriesInput, '250');
        await userEvent.type(descriptionInput, 'Test Food');

        const addButton = screen.getByRole('button', { name: 'Add' });
        await userEvent.click(addButton);

        expect(mockMutate).toHaveBeenCalledWith(
            expect.objectContaining({
                calories_override: 250,
                description: 'Test Food',
            }),
        );
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('closes dialog on Cancel click', async () => {
        renderWithProvider(<AddQuickLogBody onClose={mockOnClose} entryDate={entryDate} />);

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        await userEvent.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalled();
        expect(mockMutate).not.toHaveBeenCalled();
    });

    it('submits on Enter key press when form is valid', async () => {
        renderWithProvider(<AddQuickLogBody onClose={mockOnClose} entryDate={entryDate} />);

        const caloriesInput = screen.getByLabelText(/Quick Set Calories/);
        await userEvent.type(caloriesInput, '250{Enter}');

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledWith(
                expect.objectContaining({
                    calories_override: 250,
                }),
            );
        });
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('allows negative calories', async () => {
        renderWithProvider(<AddQuickLogBody onClose={mockOnClose} entryDate={entryDate} />);

        const caloriesInput = screen.getByLabelText(/Quick Set Calories/);
        await userEvent.type(caloriesInput, '-100');

        const addButton = screen.getByRole('button', { name: 'Add' });
        expect(addButton).not.toBeDisabled();
    });

    it('generates timestamp with correct date', async () => {
        renderWithProvider(<AddQuickLogBody onClose={mockOnClose} entryDate={entryDate} />);

        const caloriesInput = screen.getByLabelText(/Quick Set Calories/);
        await userEvent.type(caloriesInput, '250');

        const addButton = screen.getByRole('button', { name: 'Add' });
        await userEvent.click(addButton);

        const callArgs = mockMutate.mock.calls[0][0];
        const timestamp = DateTime.fromISO(callArgs.timestamp);

        expect(timestamp.year).toBe(2024);
        expect(timestamp.month).toBe(1);
        expect(timestamp.day).toBe(15);
    });
});
