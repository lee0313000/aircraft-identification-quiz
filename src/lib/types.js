/**
 * @typedef {'easy' | 'medium' | 'hard'} Difficulty
 * @typedef {'user' | 'admin'} Role
 */

/**
 * @typedef {Object} Profile
 * @property {string} id
 * @property {string} email
 * @property {string} nickname
 * @property {Role} role
 * @property {string} created_at
 */

/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {string} image_url
 * @property {string} aircraft_type
 * @property {string} airline
 * @property {string} registration
 * @property {Difficulty} difficulty
 * @property {string} option_a
 * @property {string} option_b
 * @property {string} option_c
 * @property {string} option_d
 * @property {string} correct_answer
 * @property {string|null} hint
 * @property {string|null} explanation
 * @property {boolean} published
 * @property {string} created_at
 */

/**
 * @typedef {Object} QuizAttempt
 * @property {string} id
 * @property {string} user_id
 * @property {number} score
 * @property {number} correct_count
 * @property {number} total_questions
 * @property {number} accuracy
 * @property {number} time_taken
 * @property {string} created_at
 */

export {};
