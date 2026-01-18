import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditFoodBody from './EditFoodBody';
import { Food, FoodType } from '../../types/foods';

// Mock the supabase module
const mockUpdate = vi.fn();
const mockEq = vi.fn();
vi.mock('../../utils/supabase', () => ({
    useSupabase: vi.fn(() => ({
        from: vi.fn(() => ({
            update: mockUpdate,
        })),
    })),
}));

describe('EditFoodBody', () => {
    const mockOnClose = vi.fn();
    const mockOnFoodUpdated = vi.fn();

    const byWeightFood: Food = {
        id: 'food-123',
        name: 'Test Food By Weight',
        description: 'Test description',
        type: FoodType.BY_WEIGHT,
        calories_p100: 250,
        serving_grams: 100,
        calories_fixed: null,
    };

    const fixedServingFood: Food = {
        id: 'food-456',
        name: 'Test Food Fixed',
        description: 'Fixed serving food',
        type: FoodType.FIXED_SERVING,
        calories_p100: null,
        serving_grams: null,
        calories_fixed: 180,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockUpdate.mockReturnValue({
            eq: mockEq.mockResolvedValue({ error: null }),
        });
    });

    it('renders with initial values for by-weight food', () => {
        render(<EditFoodBody onClose={mockOnClose} onFoodUpdated={mockOnFoodUpdated} food={byWeightFood} />);

        expect(screen.getByText('Edit Food')).toBeInTheDocument();
        expect(screen.getByLabelText('Name')).toHaveValue('Test Food By Weight');
        expect(screen.getByLabelText('Description')).toHaveValue('Test description');
        expect(screen.getByLabelText(/Calories per 100g/)).toHaveValue(250);
        expect(screen.getByLabelText(/Serving size \(g\)/)).toHaveValue(100);
    });

    it('renders with initial values for fixed-serving food', () => {
        render(<EditFoodBody onClose={mockOnClose} onFoodUpdated={mockOnFoodUpdated} food={fixedServingFood} />);

        expect(screen.getByText('Edit Food')).toBeInTheDocument();
        expect(screen.getByLabelText('Name')).toHaveValue('Test Food Fixed');
        expect(screen.getByLabelText('Description')).toHaveValue('Fixed serving food');
        expect(screen.getByLabelText(/Calories per serving/)).toHaveValue(180);
    });

    it('enables Save button when calories are valid', () => {
        render(<EditFoodBody onClose={mockOnClose} onFoodUpdated={mockOnFoodUpdated} food={byWeightFood} />);

        const saveButton = screen.getByRole('button', { name: 'Save' });
        expect(saveButton).not.toBeDisabled();
    });

    it('disables Save button when calories are invalid', async () => {
        render(<EditFoodBody onClose={mockOnClose} onFoodUpdated={mockOnFoodUpdated} food={byWeightFood} />);

        const caloriesInput = screen.getByLabelText(/Calories per 100g/);
        await userEvent.clear(caloriesInput);
        await userEvent.type(caloriesInput, 'abc');

        const saveButton = screen.getByRole('button', { name: 'Save' });
        expect(saveButton).toBeDisabled();
    });

    it('updates name field', async () => {
        render(<EditFoodBody onClose={mockOnClose} onFoodUpdated={mockOnFoodUpdated} food={byWeightFood} />);

        const nameInput = screen.getByLabelText('Name');
        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, 'Updated Food Name');

        expect(nameInput).toHaveValue('Updated Food Name');
    });

    it('updates description field', async () => {
        render(<EditFoodBody onClose={mockOnClose} onFoodUpdated={mockOnFoodUpdated} food={byWeightFood} />);

        const descriptionInput = screen.getByLabelText('Description');
        await userEvent.clear(descriptionInput);
        await userEvent.type(descriptionInput, 'Updated description');

        expect(descriptionInput).toHaveValue('Updated description');
    });

    it('updates calories field for by-weight food', async () => {
        render(<EditFoodBody onClose={mockOnClose} onFoodUpdated={mockOnFoodUpdated} food={byWeightFood} />);

        const caloriesInput = screen.getByLabelText(/Calories per 100g/);
        await userEvent.clear(caloriesInput);
        await userEvent.type(caloriesInput, '300');

        expect(caloriesInput).toHaveValue(300);
    });

    it('calls update with correct values on Save click for by-weight food', async () => {
        render(<EditFoodBody onClose={mockOnClose} onFoodUpdated={mockOnFoodUpdated} food={byWeightFood} />);

        const nameInput = screen.getByLabelText('Name');
        const descriptionInput = screen.getByLabelText('Description');
        const caloriesInput = screen.getByLabelText(/Calories per 100g/);
        const servingSizeInput = screen.getByLabelText(/Serving size \(g\)/);

        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, 'Updated Food');
        await userEvent.clear(descriptionInput);
        await userEvent.type(descriptionInput, 'Updated desc');
        await userEvent.clear(caloriesInput);
        await userEvent.type(caloriesInput, '350');
        await userEvent.clear(servingSizeInput);
        await userEvent.type(servingSizeInput, '150');

        const saveButton = screen.getByRole('button', { name: 'Save' });
        await userEvent.click(saveButton);

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith({
                name: 'Updated Food',
                description: 'Updated desc',
                type: FoodType.BY_WEIGHT,
                calories_p100: '350',
                serving_grams: '150',
                calories_fixed: null,
            });
            expect(mockEq).toHaveBeenCalledWith('id', 'food-123');
            expect(mockOnClose).toHaveBeenCalled();
            expect(mockOnFoodUpdated).toHaveBeenCalled();
        });
    });

    it('calls update with correct values on Save click for fixed-serving food', async () => {
        render(<EditFoodBody onClose={mockOnClose} onFoodUpdated={mockOnFoodUpdated} food={fixedServingFood} />);

        const nameInput = screen.getByLabelText('Name');
        const caloriesInput = screen.getByLabelText(/Calories per serving/);

        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, 'Updated Fixed Food');
        await userEvent.clear(caloriesInput);
        await userEvent.type(caloriesInput, '200');

        const saveButton = screen.getByRole('button', { name: 'Save' });
        await userEvent.click(saveButton);

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith({
                name: 'Updated Fixed Food',
                description: 'Fixed serving food',
                type: FoodType.FIXED_SERVING,
                calories_p100: null,
                serving_grams: null,
                calories_fixed: '200',
            });
            expect(mockEq).toHaveBeenCalledWith('id', 'food-456');
            expect(mockOnClose).toHaveBeenCalled();
            expect(mockOnFoodUpdated).toHaveBeenCalled();
        });
    });

    it('closes dialog on Cancel click', async () => {
        render(<EditFoodBody onClose={mockOnClose} onFoodUpdated={mockOnFoodUpdated} food={byWeightFood} />);

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        await userEvent.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalled();
        expect(mockUpdate).not.toHaveBeenCalled();
        expect(mockOnFoodUpdated).not.toHaveBeenCalled();
    });

    it('submits on Enter key press when form is valid', async () => {
        render(<EditFoodBody onClose={mockOnClose} onFoodUpdated={mockOnFoodUpdated} food={byWeightFood} />);

        const nameInput = screen.getByLabelText('Name');
        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, 'Updated{Enter}');

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalled();
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('does not submit on Enter key press when form is invalid', async () => {
        render(<EditFoodBody onClose={mockOnClose} onFoodUpdated={mockOnFoodUpdated} food={byWeightFood} />);

        const caloriesInput = screen.getByLabelText(/Calories per 100g/);
        await userEvent.clear(caloriesInput);
        await userEvent.type(caloriesInput, 'abc{Enter}');

        expect(mockUpdate).not.toHaveBeenCalled();
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('switches between serving types correctly', async () => {
        render(<EditFoodBody onClose={mockOnClose} onFoodUpdated={mockOnFoodUpdated} food={byWeightFood} />);

        // Initially should show by-weight fields
        expect(screen.getByLabelText(/Calories per 100g/)).toBeInTheDocument();

        // Switch to fixed serving
        const servingTypeSelect = screen.getByLabelText('Serving Type');
        await userEvent.click(servingTypeSelect);
        const fixedOption = screen.getByRole('option', { name: 'Fixed' });
        await userEvent.click(fixedOption);

        // Should now show fixed serving field
        await waitFor(() => {
            expect(screen.queryByLabelText(/Calories per 100g/)).not.toBeInTheDocument();
            expect(screen.getByLabelText(/Calories per serving/)).toBeInTheDocument();
        });
    });
});
