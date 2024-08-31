/**
 * Password Strength Calculator Module
 * This module provides functions to evaluate password strength and generate improvement suggestions.
 */

// Polyfill for older browsers that don't support Math.trunc
if (!Math.trunc) {
    Math.trunc = function(v) {
        v = +v;
        return (v - v % 1) || (!isFinite(v) || v === 0 ? v : v < 0 ? -0 : 0);
    };
}

/**
 * Calculates the overall strength of a password
 * @param {string} password - The password to evaluate
 * @returns {Object} An object containing the strength score, label, and feedback
 */
export function calculatePasswordStrength(password) {
    const length = evaluateLength(password);
    const complexity = evaluateComplexity(password);
    const variety = evaluateCharacterVariety(password);
    const patterns = evaluatePatterns(password);

    const score = calculateScore(length, complexity, variety, patterns);
    const feedback = generateFeedback(password, length, complexity, variety, patterns);

    return {
        score: score,
        strength: getStrengthLabel(score),
        feedback: feedback
    };
}

/**
 * Evaluates the length of the password
 * @param {string} password - The password to evaluate
 * @returns {number} Score based on password length
 */
function evaluateLength(password) {
    const length = password.length;
    if (length >= 16) return 5;
    if (length >= 12) return 4;
    if (length >= 10) return 3;
    if (length >= 8) return 2;
    if (length >= 6) return 1;
    return 0;
}

/**
 * Evaluates the complexity of the password
 * @param {string} password - The password to evaluate
 * @returns {number} Score based on password complexity
 */
function evaluateComplexity(password) {
    let score = 0;
    if (/[a-z]/.test(password)) score++; // lowercase
    if (/[A-Z]/.test(password)) score++; // uppercase
    if (/d/.test(password)) score++;    // digits
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++; // special characters
    return score;
}

/**
 * Evaluates the variety of characters in the password
 * @param {string} password - The password to evaluate
 * @returns {number} Score based on character variety
 */
function evaluateCharacterVariety(password) {
    const uniqueChars = new Set(password.split('')).size;
    if (uniqueChars >= 12) return 5;
    if (uniqueChars >= 10) return 4;
    if (uniqueChars >= 8) return 3;
    if (uniqueChars >= 6) return 2;
    if (uniqueChars >= 4) return 1;
    return 0;
}

/**
 * Evaluates common patterns in the password
 * @param {string} password - The password to evaluate
 * @returns {number} Penalty score based on common patterns
 */
function evaluatePatterns(password) {
    let penalty = 0;
    const lowercasePassword = password.toLowerCase();

    // Check for sequential characters
    if (/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/.test(lowercasePassword)) {
        penalty += 2;
    }

    // Check for repeated characters
    if (/(.)\1{2,}/.test(password)) {
        penalty += 2;
    }

    // Check for common words or patterns
    const commonPatterns = ['password', '123456', 'qwerty', 'admin', 'letmein', 'welcome'];
    if (commonPatterns.some(pattern => lowercasePassword.includes(pattern))) {
        penalty += 3;
    }

    return penalty;
}

/**
 * Calculates the overall score based on length, complexity, variety, and patterns
 * @param {number} length - Score from length evaluation
 * @param {number} complexity - Score from complexity evaluation
 * @param {number} variety - Score from character variety evaluation
 * @param {number} patterns - Penalty score from pattern evaluation
 * @returns {number} Overall password strength score
 */
function calculateScore(length, complexity, variety, patterns) {
    const baseScore = Math.trunc(((length + complexity + variety) / 14) * 100);
    return Math.max(0, Math.min(100, baseScore - patterns * 10));
}

/**
 * Generates feedback based on the password evaluation
 * @param {string} password - The password being evaluated
 * @param {number} length - Score from length evaluation
 * @param {number} complexity - Score from complexity evaluation
 * @param {number} variety - Score from character variety evaluation
 * @param {number} patterns - Penalty score from pattern evaluation
 * @returns {string[]} Array of feedback messages
 */
function generateFeedback(password, length, complexity, variety, patterns) {
    const feedback = [];

    if (length < 3) {
        feedback.push('Use a longer password (at least 12 characters for better security).');
    }

    if (complexity < 4) {
        const missing = [];
        if (!/[a-z]/.test(password)) missing.push('lowercase letters');
        if (!/[A-Z]/.test(password)) missing.push('uppercase letters');
        if (!/\d/.test(password)) missing.push('numbers');
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) missing.push('special characters');
        feedback.push(`Include a mix of ${missing.join(', ')} to increase complexity.`);
    }

    if (variety < 3) {
        feedback.push('Use a wider variety of characters to make your password stronger.');
    }

    if (patterns > 0) {
        feedback.push('Avoid common words, sequences, or repeated characters in your password.');
    }

    if (feedback.length === 0) {
        feedback.push('Great job! Your password is strong.');
    }

    return feedback;
}

/**
 * Converts the numeric score to a strength label
 * @param {number} score - The password strength score
 * @returns {string} The strength label
 */
function getStrengthLabel(score) {
    if (score >= 80) return 'Very Strong';
    if (score >= 60) return 'Strong';
    if (score >= 40) return 'Moderate';
    if (score >= 20) return 'Weak';
    return 'Very Weak';
}
