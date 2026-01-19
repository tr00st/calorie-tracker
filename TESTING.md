# Testing Documentation

This document describes the testing infrastructure for the Calorie Tracker application.

## Overview

The application uses multiple testing strategies:

1. **Unit Tests** with Vitest and React Testing Library
2. **Component Testing** with Storybook
3. **Component Tests via Vitest** using Storybook's Vitest addon
4. **Mocked Supabase** for sandboxed testing

## Running Tests

### Unit Tests

Run all unit tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm test -- --watch
```

Run tests with UI:
```bash
npm run test:ui
```

Run tests with coverage:
```bash
npm run test:coverage
```

This will generate coverage reports in multiple formats:
- **HTML**: Open `coverage/index.html` in your browser for an interactive report
- **Terminal**: Shows summary in console
- **LCOV**: Used by CI tools and code coverage services

Coverage thresholds are set at 70% for lines, functions, branches, and statements.

### Storybook Component Testing

Start Storybook dev server:
```bash
npm run storybook
```

Build Storybook for production:
```bash
npm run build-storybook
```

Run Storybook tests with Vitest:
```bash
npx vitest --project=storybook
```

This will run all your stories as tests, checking for:
- Component rendering without errors
- Accessibility violations (via @storybook/addon-a11y)
- Visual consistency

### Viewing Storybook on GitHub Pages

Storybook is automatically deployed to GitHub Pages when changes are merged to the main branch.

Access the deployed Storybook at:
```
https://<your-github-username>.github.io/<repository-name>/storybook/
```

For this repository:
```
https://tr00st.github.io/calorie-tracker/storybook/
```

## Code Coverage

The project uses Vitest's built-in code coverage with the v8 provider.

### Viewing Coverage Reports

After running `npm run test:coverage`, open the HTML report:
```bash
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
start coverage/index.html  # Windows
```

The HTML report provides:
- Line-by-line coverage visualization
- File-by-file breakdown
- Branch coverage details
- Function coverage metrics

### Coverage Configuration

Coverage thresholds are set to 70% for:
- Lines
- Functions
- Branches
- Statements

Excluded from coverage:
- Test files (`*.test.tsx`, `*.stories.tsx`)
- Test utilities (`src/test/`)
- Type definitions (`*.d.ts`)
- Configuration files
- Storybook files

### CI/CD Coverage

Coverage reports are generated in CI and can be integrated with code coverage services like Codecov or Coveralls by using the LCOV report format (`coverage/lcov.info`).

## Mocking Supabase

The application provides several utilities for mocking Supabase in tests:

### For Unit Tests

Use the utilities in `src/test/mocks/supabase.tsx`:

```tsx
import { createMockSupabaseClient, createMockSupabaseResponse } from '../test/mocks/supabase';
import { vi } from 'vitest';

// Create a mock client
const mockClient = createMockSupabaseClient();

// Setup mock responses
mockClient.from.mockReturnValue({
  select: vi.fn().mockResolvedValue(
    createMockSupabaseResponse([{ id: 1, name: 'Test Food' }])
  ),
});

// Mock the useSupabase hook
vi.mock('../utils/supabase', () => ({
  useSupabase: () => mockClient,
}));
```

### For Storybook Stories

Use the decorators in `src/test/storybook-decorators.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { withFullAppContext } from '../../test/storybook-decorators';
import YourComponent from './YourComponent';

const meta = {
  title: 'Components/YourComponent',
  component: YourComponent,
  decorators: [withFullAppContext], // Provides Supabase, React Query, MUI, Luxon
} satisfies Meta<typeof YourComponent>;

export default meta;
```

Available decorators:
- `withSupabase` - Provides mock Supabase client only
- `withReactQuery` - Provides React Query client
- `withMuiTheme` - Provides Material UI theme
- `withLuxon` - Provides Luxon date adapter
- `withFullAppContext` - Combines all of the above

### For Development

You can use the mock Supabase dev server for local development without connecting to a real Supabase instance:

1. Create a `.env.local` file (copy from `.env.local.example`)
2. Set `VITE_USE_MOCK_SUPABASE=true`
3. Run the app with `npm run dev`

The mock server includes:
- Pre-populated food items
- Sample log entries
- In-memory data storage (persists during dev session)
- Support for basic CRUD operations

**Note:** The mock dev server is currently basic and may not support all Supabase features.

## Writing Tests

### Component Tests

When writing component tests:

1. Mock Supabase dependencies
2. Mock React Query mutations/queries
3. Use `@testing-library/react` for rendering
4. Use `@testing-library/user-event` for interactions

Example:
```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import YourComponent from './YourComponent';

vi.mock('../../utils/queries', () => ({
  useYourMutation: vi.fn(),
}));

describe('YourComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Storybook Stories

When writing stories:

1. Use appropriate decorators for context
2. Provide realistic mock data
3. Create multiple variants (states)
4. Add JSDoc comments for documentation

Example:
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { withFullAppContext } from '../../test/storybook-decorators';
import YourComponent from './YourComponent';

/**
 * YourComponent does something important.
 * It has these features...
 */
const meta = {
  title: 'Components/YourComponent',
  component: YourComponent,
  decorators: [withFullAppContext],
  tags: ['autodocs'],
} satisfies Meta<typeof YourComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default state of the component.
 */
export const Default: Story = {
  args: {
    prop1: 'value1',
  },
};

/**
 * An error state showing validation messages.
 */
export const WithError: Story = {
  args: {
    prop1: 'value1',
    hasError: true,
  },
};
```

## Mock Data

Mock data for development and testing is defined in:
- `src/test/mocks/supabaseDevServer.tsx` - Food and log entry samples

You can extend this data to add more realistic test scenarios.

## Continuous Integration

The Storybook tests can be run in CI pipelines:

```bash
# Run unit tests
npm test -- --run

# Run Storybook tests
npx vitest --project=storybook --run
```

## Troubleshooting

### Tests failing with "Cannot use useSupabase without context provider"

Make sure you're mocking the `useSupabase` hook or wrapping components with the appropriate provider:

```tsx
vi.mock('../../utils/supabase', () => ({
  useSupabase: () => mockClient,
}));
```

### Storybook not loading

1. Check that all decorators are applied
2. Verify mock Supabase client is created correctly
3. Check console for errors
4. Ensure all required context providers are included

### Mock data not appearing

1. Verify `createMockDevSupabaseClient()` is being used
2. Check that the table name matches the mock data keys
3. Ensure the query chain is supported by the mock

## Further Reading

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Storybook Documentation](https://storybook.js.org/docs)
- [Storybook Vitest Addon](https://storybook.js.org/docs/writing-tests/vitest-addon)
