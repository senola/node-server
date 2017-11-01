const unidecode = require('unidecode'),
    __ = require('lodash');

module.exports = function(string, options) {
    options = options || {};

    // 单独处理£符号,因为它需要被移除之前进行unicode转换。
    string = string.replace(/£/g, '-');

    // 删除非ascii字符
    string = unidecode(string);

    // 删除 URL 保留字符: `@:/?#[]!$&()*+,;=` as well as `\%<>|^~£"{}` and \`
    string = string.replace(/(\s|\.|@|:|\/|\?|#|\[|\]|!|\$|&|\(|\)|\*|\+|,|;|=|\\|%|<|>|\||\^|~|"|\{|\}|`|–|—)/g, '-')
        .replace(/'/g, '') // 删除 “'”
        .toLowerCase(); // 转换为小写字符
    // We do not need to make the following changes when importing data
    if (!__.has(options, 'importing') || !options.importing) {
        // Convert 2 or more dashes into a single dash
        string = string.replace(/-+/g, '-')
        // Remove trailing dash
            .replace(/-$/, '')
            // Remove any dashes at the beginning
            .replace(/^-/, '');
    }
    // 去掉空白字符
    string = string.trim();
    return string;
};

