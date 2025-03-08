# ===== Playwright Tests =====
# For Playwright E2E testing, use these commands:
# - pw-test: Run all Playwright tests
# - pw-test-e2e: Run only E2E tests
# - pw-test-unit: Run only unit tests
# - pw-test-ui: Run tests with UI
# - pw-install: Install Playwright browsers

# Run all Playwright tests
pw-test:
    npx playwright test

# Run only E2E tests
pw-test-e2e:
    npx playwright test tests/e2e

# Run only unit tests
pw-test-unit:
    npx playwright test tests/unit

# Run tests with UI
pw-test-ui:
    npx playwright test --ui

# Install Playwright browsers
pw-install:
    npx playwright install 