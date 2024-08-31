// test-password-strength.js
import { calculatePasswordStrength } from './passwordStrength.js';

// Test function
function runTests() {
    const testCases = [
        { password: '', expected: { score: 0, strength: 'Very Weak' } },
        { password: 'password', expected: { score: 20, strength: 'Weak' } },
        { password: 'Password123', expected: { score: 40, strength: 'Moderate' } },
        { password: 'P@ssw0rd!', expected: { score: 60, strength: 'Strong' } },
        { password: 'Tr0ub4dor&3', expected: { score: 80, strength: 'Very Strong' } },
        { password: 'correcthorsebatterystaple', expected: { score: 100, strength: 'Very Strong' } },
    ];

    let passedTests = 0;
    let totalTests = testCases.length;

    testCases.forEach((testCase, index) => {
        const result = calculatePasswordStrength(testCase.password);
        const passed = result.score === testCase.expected.score && result.strength === testCase.expected.strength;

        console.log(`Test ${index + 1}: ${passed ? 'PASSED' : 'FAILED'}`);
        console.log(`Password: ${testCase.password}`);
        console.log(`Expected: Score ${testCase.expected.score}, Strength: ${testCase.expected.strength}`);
        console.log(`Actual: Score ${result.score}, Strength: ${result.strength}`);
        console.log(`Feedback: ${result.feedback.join(', ')}`);
        console.log('---');

        if (passed) passedTests++;
    });

    console.log(`${passedTests} out of ${totalTests} tests passed.`);
}

// Run the tests
runTests();
