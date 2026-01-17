import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LogViewListItem from './LogViewListItem';
import * as queries from '../../utils/queries';

// Mock the queries module
vi.mock('../../utils/queries', () => ({
    useDeleteLogEntryMutation: vi.fn(),
}));

// Mock the EditQuickLogDialog component
vi.mock('../../components/edit-quick-log-dialog/EditQuickLogDialog', () => ({
    default: ({ open, onClose, id, initialLabel, initialCalories }: any) => (
        open
            ? (
                    <div data-testid="edit-dialog">
                        <div>Edit Dialog</div>
                        <div>
                            ID:
                            {id}
                        </div>
                        <div>
                            Label:
                            {initialLabel}
                        </div>
                        <div>
                            Calories:
                            {initialCalories}
                        </div>
                        <button onClick={onClose}>Close Edit</button>
                    </div>
                )
            : null
    ),
}));

describe('LogViewListItem', () => {
    const mockMutate = vi.fn();

    const defaultProps = {
        label: 'Test Food',
        calorie_count: 250,
        timestamp: '2024-01-15T10:30:00.000Z',
        id: '123',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(queries.useDeleteLogEntryMutation).mockReturnValue({
            mutate: mockMutate,
        } as any);
    });

    it('renders log entry details', () => {
        render(<LogViewListItem {...defaultProps} />);

        expect(screen.getByText('Test Food')).toBeInTheDocument();
        expect(screen.getByText(/250cal/)).toBeInTheDocument();
        expect(screen.getByText(/10:30 AM/)).toBeInTheDocument();
    });

    it('opens menu when more button is clicked', async () => {
        render(<LogViewListItem {...defaultProps} />);

        const moreButton = screen.getByRole('button');
        await userEvent.click(moreButton);

        expect(screen.getByText('Edit')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('opens edit dialog when Edit menu item is clicked', async () => {
        render(<LogViewListItem {...defaultProps} />);

        const moreButton = screen.getByRole('button');
        await userEvent.click(moreButton);

        const editMenuItem = screen.getByText('Edit');
        await userEvent.click(editMenuItem);

        expect(screen.getByTestId('edit-dialog')).toBeInTheDocument();
        expect(screen.getByText(/ID:\s*123/)).toBeInTheDocument();
        expect(screen.getByText(/Label:\s*Test Food/)).toBeInTheDocument();
        expect(screen.getByText(/Calories:\s*250/)).toBeInTheDocument();
    });

    it('closes edit dialog when close is called', async () => {
        render(<LogViewListItem {...defaultProps} />);

        const moreButton = screen.getByRole('button');
        await userEvent.click(moreButton);

        const editMenuItem = screen.getByText('Edit');
        await userEvent.click(editMenuItem);

        expect(screen.getByTestId('edit-dialog')).toBeInTheDocument();

        const closeButton = screen.getByRole('button', { name: 'Close Edit' });
        await userEvent.click(closeButton);

        expect(screen.queryByTestId('edit-dialog')).not.toBeInTheDocument();
    });

    it('opens delete confirmation when Delete menu item is clicked', async () => {
        render(<LogViewListItem {...defaultProps} />);

        const moreButton = screen.getByRole('button');
        await userEvent.click(moreButton);

        const deleteMenuItem = screen.getByText('Delete');
        await userEvent.click(deleteMenuItem);

        expect(screen.getByText('Permantly Delete Entry?')).toBeInTheDocument();
        expect(screen.getByText(/This is permanent, and cannot be undone/)).toBeInTheDocument();
    });

    it('cancels delete operation', async () => {
        render(<LogViewListItem {...defaultProps} />);

        const moreButton = screen.getByRole('button');
        await userEvent.click(moreButton);

        const deleteMenuItem = screen.getByText('Delete');
        await userEvent.click(deleteMenuItem);

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        await userEvent.click(cancelButton);

        await waitFor(() => {
            expect(screen.queryByText('Permantly Delete Entry?')).not.toBeInTheDocument();
        });
        expect(mockMutate).not.toHaveBeenCalled();
    });

    it('calls delete mutation when delete is confirmed', async () => {
        render(<LogViewListItem {...defaultProps} />);

        const moreButton = screen.getByRole('button');
        await userEvent.click(moreButton);

        const deleteMenuItem = screen.getByText('Delete');
        await userEvent.click(deleteMenuItem);

        const deleteButton = screen.getByRole('button', { name: 'Delete' });
        await userEvent.click(deleteButton);

        expect(mockMutate).toHaveBeenCalledWith({
            id: 123,
            timestamp: '2024-01-15T10:30:00.000Z',
        });
    });

    it('formats time correctly', () => {
        const propsWithDifferentTime = {
            ...defaultProps,
            timestamp: '2024-01-15T14:45:00.000Z',
        };

        render(<LogViewListItem {...propsWithDifferentTime} />);

        expect(screen.getByText(/2:45 PM/)).toBeInTheDocument();
    });

    it('displays manual entry label when no description', () => {
        const propsWithoutLabel = {
            ...defaultProps,
            label: 'Manual Entry',
        };

        render(<LogViewListItem {...propsWithoutLabel} />);

        expect(screen.getByText('Manual Entry')).toBeInTheDocument();
    });
});
