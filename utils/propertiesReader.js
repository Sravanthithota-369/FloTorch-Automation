const fs = require('fs');
const path = require('path');

/**
 * Properties file reader utility
 */
class PropertiesReader {
  constructor(filePath) {
    this.filePath = filePath;
    this.properties = {};
    this.loadProperties();
  }

  /**
   * Load properties from file
   */
  loadProperties() {
    try {
      if (fs.existsSync(this.filePath)) {
        const content = fs.readFileSync(this.filePath, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach(line => {
          line = line.trim();
          
          // Skip empty lines and comments
          if (line && !line.startsWith('#')) {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
              this.properties[key.trim()] = valueParts.join('=').trim();
            }
          }
        });
        
        console.log(`Loaded ${Object.keys(this.properties).length} properties from ${this.filePath}`);
      } else {
        console.warn(`Properties file not found: ${this.filePath}`);
      }
    } catch (error) {
      console.error(`Error loading properties file: ${error.message}`);
    }
  }

  /**
   * Get property value
   * @param {string} key - Property key
   * @param {string} defaultValue - Default value if key not found
   * @returns {string} Property value
   */
  getProperty(key, defaultValue = '') {
    return this.properties[key] || defaultValue;
  }

  /**
   * Get all properties
   * @returns {Object} All properties
   */
  getAllProperties() {
    return { ...this.properties };
  }

  /**
   * Check if property exists
   * @param {string} key - Property key
   * @returns {boolean} True if property exists
   */
  hasProperty(key) {
    return key in this.properties;
  }
}

// Create a global instance for the test properties
const testPropertiesPath = path.join(__dirname, '../config/test.properties');
const testProperties = new PropertiesReader(testPropertiesPath);

module.exports = {
  PropertiesReader,
  testProperties
};
