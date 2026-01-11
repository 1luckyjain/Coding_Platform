const axios = require('axios');

class Judge0Service {
  constructor() {
    // Using Judge0 CE (Community Edition) API
    this.baseURL = process.env.JUDGE0_API_URL || 'https://ce.judge0.com';
    this.apiKey = process.env.JUDGE0_API_KEY || ''; // Optional for CE
    this.rapidAPIKey = process.env.RAPID_API_KEY; // For RapidAPI hosting
  }

  getLanguageId(language) {
    const languageMap = {
      'javascript': 63, // JavaScript (Node.js)
      'python': 71,     // Python 3
      'java': 62,       // Java
      'cpp': 54,        // C++ (GCC 9.4.0)
      'c': 50,          // C (GCC 9.4.0)
      'csharp': 51,     // C# (.NET Core 3.1)
      'php': 68,        // PHP (8.0.11)
      'ruby': 72,       // Ruby (3.0.0)
      'go': 79,         // Go (1.16.6)
      'rust': 73,       // Rust (1.56.0)
      'typescript': 63, // TypeScript (compiled to JavaScript)
    };
    return languageMap[language] || 63; // Default to JavaScript
  }

  async submitCode(sourceCode, language, input = '', expectedOutput = '') {
    try {
      const languageId = this.getLanguageId(language);
      
      const submissionData = {
        source_code: sourceCode,
        language_id: languageId,
        stdin: input,
        expected_output: expectedOutput,
        additional_options: '--timeout=10 --cpu-time=5', // 5 seconds CPU time, 10 seconds wall time
        redirect_stderr_to_stdout: true
      };

      const headers = {
        'Content-Type': 'application/json'
      };

      // Add RapidAPI key if available (for production)
      if (this.rapidAPIKey) {
        headers['X-RapidAPI-Host'] = 'judge0-ce.p.rapidapi.com';
        headers['X-RapidAPI-Key'] = this.rapidAPIKey;
      }

      // Submit the code
      const submitResponse = await axios.post(
        `${this.baseURL}/submissions`,
        submissionData,
        { headers }
      );

      const token = submitResponse.data.token;

      // Poll for results
      let attempts = 0;
      const maxAttempts = 20; // Maximum 20 attempts (10 seconds total)

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms

        const resultResponse = await axios.get(
          `${this.baseURL}/submissions/${token}`,
          { headers }
        );

        const result = resultResponse.data;

        if (result.status.id >= 3) { // Status 3+ means processing is complete
          return this.formatResult(result);
        }

        attempts++;
      }

      // Timeout
      return {
        success: false,
        error: 'Execution timeout',
        time: '10.000s',
        memory: '0MB',
        output: '',
        exitCode: null
      };

    } catch (error) {
      console.error('Judge0 API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to execute code',
        time: '0.000s',
        memory: '0MB',
        output: '',
        exitCode: null
      };
    }
  }

  formatResult(result) {
    const statusMap = {
      1: 'In Queue',
      2: 'Processing',
      3: 'Accepted',
      4: 'Wrong Answer',
      5: 'Runtime Error',
      6: 'Time Limit Exceeded',
      7: 'Compilation Error',
      8: 'Internal Error',
      9: 'Executed',
      10: 'Output Limit Exceeded',
      11: 'Compilation Error (Optional)',
      12: 'Skipped',
      13: 'System Error',
      14: 'Security Violation'
    };

    const status = statusMap[result.status.id] || 'Unknown';
    const isSuccess = result.status.id === 3 || result.status.id === 9;

    return {
      success: isSuccess,
      status: status,
      statusId: result.status.id,
      time: result.time || '0.000s',
      memory: result.memory || '0MB',
      output: result.stdout || result.compile_output || '',
      stderr: result.stderr || '',
      exitCode: result.exit_code,
      description: result.status.description
    };
  }

  async getSupportedLanguages() {
    try {
      const response = await axios.get(`${this.baseURL}/languages`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch supported languages:', error);
      return [];
    }
  }

  // Method to prepare code for specific problems (add boilerplate)
  prepareCodeForExecution(sourceCode, language, problemId) {
    // Add necessary boilerplate for different languages
    switch (language) {
      case 'javascript':
        return this.prepareJavaScriptCode(sourceCode, problemId);
      case 'python':
        return this.preparePythonCode(sourceCode, problemId);
      case 'java':
        return this.prepareJavaCode(sourceCode, problemId);
      case 'cpp':
        return this.prepareCppCode(sourceCode, problemId);
      default:
        return sourceCode;
    }
  }

  prepareJavaScriptCode(sourceCode, problemId) {
    // For JavaScript, we need to handle I/O and call the function
    return `
// Read input
const input = require('fs').readFileSync(0, 'utf8').trim();
let inputLines = input.split('\\n');

// Parse input based on problem
function parseInput(input) {
  // Default parsing - can be customized per problem
  return input.split('\\n').map(line => line.trim());
}

${sourceCode}

// Execute and output result
try {
  const parsedInput = parseInput(input);
  
  // This is a generic execution - specific problems might need custom handling
  if (typeof twoSum === 'function') {
    // For Two Sum problem
    const [numsLine, targetLine] = inputLines;
    const nums = JSON.parse(numsLine.split('=')[1].trim());
    const target = parseInt(targetLine.split('=')[1].trim());
    const result = twoSum(nums, target);
    console.log(JSON.stringify(result));
  } else if (typeof lengthOfLongestSubstring === 'function') {
    // For Longest Substring problem
    const s = inputLines[0].split('=')[1].trim().replace(/"/g, '');
    const result = lengthOfLongestSubstring(s);
    console.log(result);
  } else {
    // Generic execution
    console.log('Code executed successfully');
  }
} catch (error) {
  console.error('Runtime Error:', error.message);
}
`;
  }

  preparePythonCode(sourceCode, problemId) {
    return `
import sys
import json

# Read input
input_data = sys.stdin.read().strip()
input_lines = input_data.split('\\n')

${sourceCode}

# Execute and output result
try:
    # This is a generic execution - specific problems might need custom handling
    if 'lengthOfLongestSubstring' in dir():
        # For Longest Substring problem
        s = input_lines[0].split('=')[1].strip().replace('"', '')
        result = lengthOfLongestSubstring(s)
        print(result)
    elif 'twoSum' in dir():
        # For Two Sum problem
        nums_line, target_line = input_lines
        nums = json.loads(nums_line.split('=')[1].strip())
        target = int(target_line.split('=')[1].strip())
        result = twoSum(nums, target)
        print(json.dumps(result))
    else:
        # Generic execution
        print('Code executed successfully')
except Exception as error:
    print(f'Runtime Error: {str(error)}')
`;
  }

  prepareJavaCode(sourceCode, problemId) {
    return `
import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder input = new StringBuilder();
        String line;
        
        while ((line = br.readLine()) != null) {
            input.append(line).append("\\n");
        }
        
        String[] inputLines = input.toString().trim().split("\\n");
        
        try {
            ${sourceCode}
            
            Solution solution = new Solution();
            
            // Generic execution - specific problems need custom handling
            if (inputLines.length >= 1) {
                System.out.println("Code executed successfully");
            }
        } catch (Exception error) {
            System.out.println("Runtime Error: " + error.getMessage());
        }
    }
}
`;
  }

  prepareCppCode(sourceCode, problemId) {
    return `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>

using namespace std;

${sourceCode}

int main() {
    try {
        string input;
        vector<string> inputLines;
        
        // Read all input
        while (getline(cin, input)) {
            if (!input.empty()) {
                inputLines.push_back(input);
            }
        }
        
        // Generic execution - specific problems need custom handling
        if (inputLines.size() > 0) {
            cout << "Code executed successfully" << endl;
        }
        
        return 0;
    } catch (const exception& error) {
        cout << "Runtime Error: " << error.what() << endl;
        return 1;
    }
}
`;
  }
}

module.exports = new Judge0Service();
