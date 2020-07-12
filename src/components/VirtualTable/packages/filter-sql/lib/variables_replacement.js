/*
 * @Author: 焦质晔
 * @Date: 2020-07-11 10:52:38
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-12 17:27:54
 */
// SQL example
// 1 == 1 AND (2 == 3 OR 23 != 5) AND as == a
const operations = ['==', '<', '>', '<=', '>=', '!=', 'like', 'in', 'nin'];

export default {
  // Replace all variables with what the variable is supposed to look like
  replace_variables: function(string, variable) {
    let new_string = '';

    // Loop through the string, and if there is any brackets, put a space before and after
    for (let i = 0; i < string.length; i++) {
      if (string[i] == '(' || string[i] == ')') {
        new_string += ' ' + string[i] + ' ';
      } else {
        new_string += string[i];
      }
    }

    let splits = new_string.split(' ').filter(x => x !== '');

    // replace all variables with the variables
    // A variable is found if the next in the splits is an operation
    for (let i = 0; i < splits.length; i++) {
      if (operations.includes(splits[i])) {
        // If the variable is called this, we don't want to change it then
        if (splits[i - 1] != 'this') {
          splits[i - 1] = variable + '.' + splits[i - 1];
        } else {
          splits[i - 1] = variable;
        }
      }

      // to function
      if (['like', 'in', 'nin'].includes(splits[i])) {
        splits.splice(i - 1, 3, `_query(${splits[i - 1]}, '${splits[i]}', ${splits[i + 1]})`);
        i -= 2;
      }
    }

    string = splits.join(' ');

    return string;
  }
};
