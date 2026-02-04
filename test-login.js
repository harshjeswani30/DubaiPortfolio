const bcrypt = require('bcryptjs');

// Test password
const password = 'Harsh0000..';

// Hash from migration file
const existingHash = '$2a$10$8YQJ0M5RjW5xB.6YHy.rCeL7W8FN3dKLQK8gp0L4Yx5F7h8TzLH4W';

// Generate new hash
bcrypt.hash(password, 10).then(newHash => {
  console.log('Original hash from migration:', existingHash);
  console.log('Newly generated hash:', newHash);
  
  // Test comparison with existing hash
  bcrypt.compare(password, existingHash).then(match1 => {
    console.log('\nComparing password with existing hash:', match1);
    
    // Test comparison with new hash
    bcrypt.compare(password, newHash).then(match2 => {
      console.log('Comparing password with new hash:', match2);
    });
  });
});
