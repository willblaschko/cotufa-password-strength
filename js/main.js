// Import the password strength calculation function from passwordStrength.js
import { calculatePasswordStrength } from './passwordStrength.js';

// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    // Get references to the DOM elements we'll be interacting with
    const passwordInput = document.getElementById('password-input');
    const strengthMeter = document.getElementById('strength-meter');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-value');
    const feedbackList = document.getElementById('feedback-list');
    const passwordToggle = document.getElementById('password-toggle');

    // Add event listeners
    passwordInput.addEventListener('input', updatePasswordStrength);
    passwordToggle.addEventListener('click', togglePasswordVisibility);

    /**
     * Updates the password strength meter and feedback based on user input
     */
    function updatePasswordStrength() {
        const password = passwordInput.value;
        try {
            const result = calculatePasswordStrength(password);

            // Update the strength meter
            updateStrengthMeter(result.score, result.strength);

            // Update the feedback list
            updateFeedback(result.feedback);
        } catch (error) {
            console.error('Error calculating password strength:', error);
            // Handle the error gracefully, e.g., display a message to the user
            updateStrengthMeter(0, 'Error');
            updateFeedback(['An error occurred while calculating password strength.']);
        }
    }

    /**
     * Updates the visual representation of the password strength meter
     * @param {number} score - The password strength score (0-100)
     * @param {string} strengthLabel - The strength label (e.g., 'Weak', 'Strong')
     */
    function updateStrengthMeter(score, strengthLabel) {
        // Remove all existing strength classes
        strengthMeter.className = 'strength-meter';

        // Add the appropriate strength class based on the score
        if (score >= 80) {
            strengthMeter.classList.add('very-strong');
        } else if (score >= 60) {
            strengthMeter.classList.add('strong');
        } else if (score >= 40) {
            strengthMeter.classList.add('moderate');
        } else if (score >= 20) {
            strengthMeter.classList.add('weak');
        } else {
            strengthMeter.classList.add('very-weak');
        }

        // Update the width of the strength bar
        strengthBar.style.width = `${score}%`;
        strengthBar.setAttribute('aria-valuenow', score);

        // Update the strength text
        strengthText.textContent = strengthLabel;
    }

    /**
     * Updates the feedback list with suggestions for improving the password
     * @param {string[]} feedbackItems - Array of feedback messages
     */
    function updateFeedback(feedbackItems) {
        // Clear existing feedback
        feedbackList.innerHTML = '';

        // Add new feedback items
        feedbackItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            feedbackList.appendChild(li);
        });

        // If there are no feedback items, add a message
        if (feedbackItems.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'Your password is strong!';
            feedbackList.appendChild(li);
        }
    }

    /**
     * Toggles the visibility of the password input
     */
    function togglePasswordVisibility() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Update the toggle button's aria-label
        const ariaLabel = type === 'password' ? 'Show password' : 'Hide password';
        passwordToggle.setAttribute('aria-label', ariaLabel);

        // Update the toggle button's icon (assuming we're using an icon font or SVG)
        passwordToggle.querySelector('.icon-eye').classList.toggle('icon-eye-slash');
    }

    // Initialize the strength meter
    updatePasswordStrength();
});
