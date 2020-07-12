/*
 * @Author: 焦质晔
 * @Date: 2020-07-11 10:24:35
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-12 17:27:26
 */
const conjuctions = ['&&', '||', 'AND', 'OR', 'and', 'or', 'like', 'in', 'nin', 'LIKE', 'IN', 'NIN'];

export default {
  // This method will return an array of separated operations depending of the conjuctions
  operations: function(string) {
    let str = string.split(' ');
    let ops = [];
    let count = 0;
    ops[count] = [];

    // loop through all the splits and check if the contain a conjuction
    for (let i = 0; i < str.length; i++) {
      if (conjuctions.includes(str[i])) {
        ops[count] = ops[count].join(' ');
        count++;
        ops[count] = [];
      } else {
        ops[count].push(str[i]);
      }
    }

    ops[count] = ops[count].join(' ');

    return ops;
  },

  // This method will return the number of operations on a string
  number_operations: function(string) {
    return this.operations(string).length;
  },

  // This method will format a string so is readable
  string_format: function(string) {
    if (typeof string != 'string') {
      return string;
    }

    return string.split(/[\s'\s"]/).join('');
  },

  // return string with quotes if it is a string
  stringify: function(string) {
    if (typeof string == 'string') {
      return "'" + string + "'";
    } else {
      return string;
    }
  },

  // return string with array
  array_format: function(array) {
    array = Array.isArray(array) ? array : [array];
    let string = `[`;
    for (let i = 0, len = array.length; i < len; i++) {
      string += typeof array[i] == 'number' ? array[i] : "'" + array[i] + "'";
      if (i < len - 1) {
        string += `,`;
      }
    }
    string += `]`;
    return string;
  },

  // This method will format an operation to make it readable
  operation_format: function(string) {
    let splits = string.split(' ');

    // remove empty splits
    for (let i = 0; i < splits.length; i++) {
      if (splits[i] == '') {
        splits.splice(i, 1);
        // Take one away, as we deleted an element
        i--;
      }
    }

    // If the first character is a '(', delete it
    if (splits[0] == '(') {
      splits.splice(0, 1);
    } else if (splits[0][0] == '(') {
      splits[0] = splits[0].split('');
      splits[0].splice(0, 1);
      splits[0] = splits[0].join('');
    }
    if (splits[splits.length - 1] == ')') {
      splits.splice(splits.length - 1, 1);
    } else if (splits[splits.length - 1][splits[splits.length - 1].length - 1] == ')') {
      let last = splits.length - 1;
      splits[last] = splits[last].split('');
      splits[last].splice(splits[last].length - 1, 1).join('');
      splits[last] = splits[last].join('');
    }

    return splits;
  },

  // function to find and replace
  find_replace: function(string, find, replace) {
    return string.split(find).join(replace);
  },

  // function to replace the the AND and OR symbols to && and ||
  replace_symbols: function(string) {
    string = this.find_replace(string, 'AND', '&&');
    string = this.find_replace(string, 'and', '&&');
    string = this.find_replace(string, 'OR', '||');
    string = this.find_replace(string, 'or', '||');
    string = this.find_replace(string, '<>', '!=');
    string = this.find_replace(string, 'LIKE', 'like');
    string = this.find_replace(string, 'IN', 'in');
    string = this.find_replace(string, 'NIN', 'nin');

    return string;
  }
};
