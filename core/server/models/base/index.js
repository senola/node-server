// # Base Model
// 可供其他model扩展

const _ = require('lodash'),
    _bookshelf = require('bookshelf'),
    moment = require('moment'),
    Promise = require('bluebird'),
    ObjectId = require('bson-objectid'),
    config = require('../../config'),
    db = require('../../data/db'),
    errors = require('../../errors'),
    filters = require('../../filters'),
    schema = require('../../data/schema'),
    utils = require('../../utils'),
    validation = require('../../data/validation'),
    plugins = require('../plugins');

let bookshelf,
    proto;


// 初始化一个Bookshelf实例 myBookshelf
bookshelf = _bookshelf(db.knex);

// 加载Bookshelf的注册插件，避免循环依赖
bookshelf.plugin('registry');

// 缓存一个base model prototype实例
proto = bookshelf.Model.prototype;

// 定义一个基类的Model供其他对象继承
// 包含了一些方便的函数及静态属性
bookshelf.Model = ghostBookshelf.Model.extend({
    // 时间戳
    hasTimestamps: true,
    permittedAttributes: function permittedAttributes() {
        return _.keys(schema.tables[this.tableName]);
    },
    // Bookshelf `defaults` - default values setup on every model creation
    defaults: function defaults() {
        return {};
    },
    // 当加载一个实例时候，子类可以指定默认获取值
    defaultColumnsToFetch: function defaultColumnsToFetch() {
        return [];
    },
    // 初始化
    initialize: function initialize() {
        const self = this;
        const options = arguments[1] || {};

        if (options.include) {
            this.include = _.clone(options.include);
        }

        [
            'fetching',
            'fetching:collection',
            'fetched',
            'creating',
            'created',
            'updating',
            'updated',
            'destroying',
            'destroyed',
            'saved'
        ].forEach(eventName=> {
            let functionName = 'on' + eventName[0].toUpperCase() + eventName.slice(1);

            if (functionName.indexOf(':') !== -1) {
                functionName = functionName.slice(0, functionName.indexOf(':'))
                    + functionName[functionName.indexOf(':') + 1].toUpperCase()
                    + functionName.slice(functionName.indexOf(':') + 2);
                functionName = functionName.replace(':', '');
            }

            if (!self[functionName]) {
                return;
            }

            self.on(eventName, function eventTriggered() {
                return this[functionName].apply(this, arguments);
            });
        });

        this.on('saving', function onSaving() {
            // const self = this,
            //     args = arguments;
            return Promise.resolve(self.onSaving.apply(...arguments))
                .then(()=> {
                    return Promise.resolve(self.onValidate.apply(...arguments));
                });
        });
    },
    onValidate: function onValidate() {
        // TODO validation
        // return validation.validateSchema(this.tableName, this.toJSON());
    },

    onSaving: function onSaving(newObj) {
        // Remove any properties which don't belong on the model
        this.attributes = this.pick(this.permittedAttributes());
        // Store the previous attributes so we can tell what was updated later
        this._updatedAttributes = newObj.previousAttributes();
    },

    /**
     * before we insert dates into the database, we have to normalize
     * date format is now in each db the same
     */
    fixDatesWhenSave: function fixDates(attrs) {
        let self = this;

        _.each(attrs, (value, key)=> {
            if (value !== null
                && schema.tables[self.tableName].hasOwnProperty(key)
                && schema.tables[self.tableName][key].type === 'dateTime') {
                attrs[key] = moment(value).format('YYYY-MM-DD HH:mm:ss');
            }
        });
        return attrs;
    },

    /**
     * all supported databases (sqlite, mysql) return different values
     *
     * sqlite:
     *   - knex returns a UTC String
     * mysql:
     *   - knex wraps the UTC value into a local JS Date
     */
    fixDatesWhenFetch: function fixDates(attrs) {
        let self = this, dateMoment;

        _.each(attrs, (value, key)=> {
            if (value !== null
                && schema.tables[self.tableName].hasOwnProperty(key)
                && schema.tables[self.tableName][key].type === 'dateTime') {
                dateMoment = moment(value);

                // CASE: You are somehow able to store e.g. 0000-00-00 00:00:00
                // Protect the code base and return the current date time.
                if (dateMoment.isValid()) {
                    attrs[key] = dateMoment.startOf('seconds').toDate();
                } else {
                    attrs[key] = moment().startOf('seconds').toDate();
                }
            }
        });

        return attrs;
    },
    // Convert integers to real booleans
    fixBools: function fixBools(attrs) {
        const self = this;
        _.each(attrs, (value, key)=> {
            if (schema.tables[self.tableName].hasOwnProperty(key)
                && schema.tables[self.tableName][key].type === 'bool') {
                attrs[key] = !!value;
            }
        });
        return attrs;
    },
    // format date before writing to DB, bools work
    format: function format(attrs) {
        return this.fixDatesWhenSave(attrs);
    },

    // format data and bool when fetching from DB
    parse: function parse(attrs) {
        return this.fixBools(this.fixDatesWhenFetch(attrs));
    },
    toJSON: function toJSON(options) {
        const attrs = _.extend({}, this.attributes);
        let self = this;

        options = options || {};
        options = _.pick(options, ['shallow', 'baseKey', 'include', 'context']);

        if (options && options.shallow) {
            return attrs;
        }

        if (options && options.include) {
            this.include = _.union(this.include, options.include);
        }

        _.each(this.relations, (relation, key)=> {
            if (key.substring(0, 7) !== '_pivot_') {
                // if include is set, expand to full object
                const fullKey = _.isEmpty(options.baseKey) ? key : options.baseKey + '.' + key;
                if (_.includes(self.include, fullKey)) {
                    attrs[key] = relation.toJSON(_.extend({}, options, {baseKey: fullKey, include: self.include}));
                }
            }
        });

        // @TODO upgrade bookshelf & knex and use serialize & toJSON to do this in a neater way (see #6103)
        return proto.finalize.call(this, attrs);
    },

    // Get attributes that have been updated (values before a .save() call)
    updatedAttributes: function updatedAttributes() {
        return this._updatedAttributes || {};
    },

    // Get a specific updated attribute value
    updated: function updated(attr) {
        return this.updatedAttributes()[attr];
    },

    /**
     * There is difference between `updated` and `previous`:
     * Depending on the hook (before or after writing into the db), both fields have a different meaning.
     * e.g. onSaving  -> before db write (has to use previous)
     *      onUpdated -> after db write  (has to use updated)
     *
     * hasDateChanged('attr', {beforeWrite: true})
     */
    hasDateChanged: function(attr, options) {
        options = options || {};
        return moment(this.get(attr)).diff(moment(options.beforeWrite ? this.previous(attr) : this.updated(attr))) !== 0;
    },

    /**
     * we auto generate a GUID for each resource
     * no auto increment
     */
    setId: function setId() {
        this.set('id', ObjectId.generate());
    }
}, {
    // ## Data Utility Functions

    /**
     * please use these static definitions when comparing id's
     * we keep type Number, because we have too many check's where we rely on Number
     * context.user ? true : false (if context.user is 0 as number, this condition is false)
     */
    internalUser: 1,
    externalUser: 0,

    isInternalUser: function isInternalUser(id) {
        return id === ghostBookshelf.Model.internalUser || id === ghostBookshelf.Model.internalUser.toString();
    },

    isExternalUser: function isExternalUser(id) {
        return id === ghostBookshelf.Model.externalUser || id === ghostBookshelf.Model.externalUser.toString();
    },

    /**
     * Returns an array of keys permitted in every method's `options` hash.
     * Can be overridden and added to by a model's `permittedOptions` method.
     *
     * importing: is used when import a JSON file or when migrating the database
     *
     * @return {Object} Keys allowed in the `options` hash of every model's method.
     */
    permittedOptions: function permittedOptions() {
        // terms to whitelist for all methods.
        return ['context', 'include', 'transacting', 'importing'];
    },

    /**
     * Filters potentially unsafe model attributes, so you can pass them to Bookshelf / Knex.
     * This filter should be called before each insert/update operation.
     *
     * @param {Object} data Has keys representing the model's attributes/fields in the database.
     * @return {Object} The filtered results of the passed in data, containing only what's allowed in the schema.
     */
    filterData: function filterData(data) {
        var permittedAttributes = this.prototype.permittedAttributes(),
            filteredData = _.pick(data, permittedAttributes),
            sanitizedData = this.sanitizeData(filteredData);

        return sanitizedData;
    },

    /**
     * `sanitizeData` ensures that client data is in the correct format for further operations.
     *
     * Dates:
     * - client dates are sent as ISO 8601 format (moment(..).format())
     * - server dates are in JS Date format
     *   >> when bookshelf fetches data from the database, all dates are in JS Dates
     *   >> see `parse`
     * - Bookshelf updates the model with the new client data via the `set` function
     * - Bookshelf uses a simple `isEqual` function from lodash to detect real changes
     * - .previous(attr) and .get(attr) returns false obviously
     * - internally we use our `hasDateChanged` if we have to compare previous/updated dates
     * - but Bookshelf is not in our control for this case
     *
     * @IMPORTANT
     * Before the new client data get's inserted again, the dates get's retransformed into
     * proper strings, see `format`.
     */
    sanitizeData: function sanitizeData(data) {
        var tableName = _.result(this.prototype, 'tableName'), dateMoment;

        _.each(data, function (value, key) {
            if (value !== null
                && schema.tables[tableName].hasOwnProperty(key)
                && schema.tables[tableName][key].type === 'dateTime'
                && typeof value === 'string'
            ) {
                dateMoment = moment(value);

                // CASE: client sends `0000-00-00 00:00:00`
                if (!dateMoment.isValid()) {
                    throw new errors.ValidationError({
                        message: i18n.t('errors.models.base.invalidDate', {key: key})
                    });
                }

                data[key] = dateMoment.toDate();
            }
        });

        return data;
    },

    /**
     * Filters potentially unsafe `options` in a model method's arguments, so you can pass them to Bookshelf / Knex.
     * @param {Object} options Represents options to filter in order to be passed to the Bookshelf query.
     * @param {String} methodName The name of the method to check valid options for.
     * @return {Object} The filtered results of `options`.
     */
    filterOptions: function filterOptions(options, methodName) {
        var permittedOptions = this.permittedOptions(methodName, options),
            filteredOptions = _.pick(options, permittedOptions);

        return filteredOptions;
    },

    // ## Model Data Functions

    /**
     * ### Find All
     * Fetches all the data for a particular model
     * @param {Object} options (optional)
     * @return {Promise(ghostBookshelf.Collection)} Collection of all Models
     */
    findAll: function findAll(options) {
        options = this.filterOptions(options, 'findAll');
        options.withRelated = _.union(options.withRelated, options.include);

        var itemCollection = this.forge(null, {context: options.context});

        // transforms fictive keywords like 'all' (status:all) into correct allowed values
        if (this.processOptions) {
            this.processOptions(options);
        }

        itemCollection.applyDefaultAndCustomFilters(options);

        return itemCollection.fetchAll(options).then(function then(result) {
            if (options.include) {
                _.each(result.models, function each(item) {
                    item.include = options.include;
                });
            }

            return result;
        });
    },

    /**
     * ### Find Page
     * Find results by page - returns an object containing the
     * information about the request (page, limit), along with the
     * info needed for pagination (pages, total).
     *
     * **response:**
     *
     *     {
     *         posts: [
     *         {...}, ...
     *     ],
     *     page: __,
     *     limit: __,
     *     pages: __,
     *     total: __
     *     }
     *
     * @param {Object} options
     */
    findPage: function findPage(options) {
        options = options || {};

        var self = this,
            itemCollection = this.forge(null, {context: options.context}),
            tableName = _.result(this.prototype, 'tableName'),
            requestedColumns = options.columns;

        // Set this to true or pass ?debug=true as an API option to get output
        itemCollection.debug = options.debug && config.get('env') !== 'production';

        // Filter options so that only permitted ones remain
        options = this.filterOptions(options, 'findPage');

        // This applies default properties like 'staticPages' and 'status'
        // And then converts them to 'where' options... this behaviour is effectively deprecated in favour
        // of using filter - it's only be being kept here so that we can transition cleanly.
        this.processOptions(options);

        // Add Filter behaviour
        itemCollection.applyDefaultAndCustomFilters(options);

        // Handle related objects
        // TODO: this should just be done for all methods @ the API level
        options.withRelated = _.union(options.withRelated, options.include);

        // Ensure only valid fields/columns are added to query
        // and append default columns to fetch
        if (options.columns) {
            options.columns = _.intersection(options.columns, this.prototype.permittedAttributes());
            options.columns = _.union(options.columns, this.prototype.defaultColumnsToFetch());
        }

        if (options.order) {
            options.order = self.parseOrderOption(options.order, options.include);
        } else if (self.orderDefaultRaw) {
            options.orderRaw = self.orderDefaultRaw();
        } else {
            options.order = self.orderDefaultOptions();
        }

        return itemCollection.fetchPage(options).then(function formatResponse(response) {
            var data = {},
                models = [];

            options.columns = requestedColumns;
            models = response.collection.toJSON(options);

            // re-add any computed properties that were stripped out before the call to fetchPage
            // pick only requested before returning JSON
            data[tableName] = _.map(models, function transform(model) {
                return options.columns ? _.pick(model, options.columns) : model;
            });
            data.meta = {pagination: response.pagination};
            return data;
        });
    },

    /**
     * ### Find One
     * Naive find one where data determines what to match on
     * @param {Object} data
     * @param {Object} options (optional)
     * @return {Promise(ghostBookshelf.Model)} Single Model
     */
    findOne: function findOne(data, options) {
        data = this.filterData(data);
        options = this.filterOptions(options, 'findOne');

        // We pass include to forge so that toJSON has access
        return this.forge(data, {include: options.include}).fetch(options);
    },

    /**
     * ### Edit
     * Naive edit
     *
     * We always forward the `method` option to Bookshelf, see http://bookshelfjs.org/#Model-instance-save.
     * Based on the `method` option Bookshelf and Ghost can determine if a query is an insert or an update.
     *
     * @param {Object} data
     * @param {Object} options (optional)
     * @return {Promise(ghostBookshelf.Model)} Edited Model
     */
    edit: function edit(data, options) {
        var id = options.id,
            model = this.forge({id: id});

        data = this.filterData(data);
        options = this.filterOptions(options, 'edit');

        // We allow you to disable timestamps when run migration, so that the posts `updated_at` value is the same
        if (options.importing) {
            model.hasTimestamps = false;
        }

        return model.fetch(options).then(function then(object) {
            if (object) {
                return object.save(data, _.merge({method: 'update'}, options));
            }
        });
    },

    /**
     * ### Add
     * Naive add
     * @param {Object} data
     * @param {Object} options (optional)
     * @return {Promise(ghostBookshelf.Model)} Newly Added Model
     */
    add: function add(data, options) {
        data = this.filterData(data);
        options = this.filterOptions(options, 'add');
        var model = this.forge(data);

        // We allow you to disable timestamps when importing posts so that the new posts `updated_at` value is the same
        // as the import json blob. More details refer to https://github.com/TryGhost/Ghost/issues/1696
        if (options.importing) {
            model.hasTimestamps = false;
        }

        // Bookshelf determines whether an operation is an update or an insert based on the id
        // Ghost auto-generates Object id's, so we need to tell Bookshelf here that we are inserting data
        options.method = 'insert';
        return model.save(null, options);
    },

    /**
     * ### Destroy
     * Naive destroy
     * @param {Object} options (optional)
     * @return {Promise(ghostBookshelf.Model)} Empty Model
     */
    destroy: function destroy(options) {
        var id = options.id;
        options = this.filterOptions(options, 'destroy');

        // Fetch the object before destroying it, so that the changed data is available to events
        return this.forge({id: id}).fetch(options).then(function then(obj) {
            return obj.destroy(options);
        });
    },

    /**
     * ### Generate Slug
     * Create a string to act as the permalink for an object.
     * @param {ghostBookshelf.Model} Model Model type to generate a slug for
     * @param {String} base The string for which to generate a slug, usually a title or name
     * @param {Object} options Options to pass to findOne
     * @return {Promise(String)} Resolves to a unique slug string
     */
    generateSlug: function generateSlug(Model, base, options) {
        var slug,
            slugTryCount = 1,
            baseName = Model.prototype.tableName.replace(/s$/, ''),
            // Look for a matching slug, append an incrementing number if so
            checkIfSlugExists, longSlug;

        checkIfSlugExists = function checkIfSlugExists(slugToFind) {
            var args = {slug: slugToFind};

            // status is needed for posts
            if (options && options.status) {
                args.status = options.status;
            }

            return Model.findOne(args, options).then(function then(found) {
                var trimSpace;

                if (!found) {
                    return slugToFind;
                }

                slugTryCount += 1;

                // If we shortened, go back to the full version and try again
                if (slugTryCount === 2 && longSlug) {
                    slugToFind = longSlug;
                    longSlug = null;
                    slugTryCount = 1;
                    return checkIfSlugExists(slugToFind);
                }

                // If this is the first time through, add the hyphen
                if (slugTryCount === 2) {
                    slugToFind += '-';
                } else {
                    // Otherwise, trim the number off the end
                    trimSpace = -(String(slugTryCount - 1).length);
                    slugToFind = slugToFind.slice(0, trimSpace);
                }

                slugToFind += slugTryCount;

                return checkIfSlugExists(slugToFind);
            });
        };

        slug = utils.safeString(base, options);

        // If it's a user, let's try to cut it down (unless this is a human request)
        if (baseName === 'user' && options && options.shortSlug && slugTryCount === 1 && slug !== 'ghost-owner') {
            longSlug = slug;
            slug = (slug.indexOf('-') > -1) ? slug.substr(0, slug.indexOf('-')) : slug;
        }

        if (!_.has(options, 'importing') || !options.importing) {
            // This checks if the first character of a tag name is a #. If it is, this
            // is an internal tag, and as such we should add 'hash' to the beginning of the slug
            if (baseName === 'tag' && /^#/.test(base)) {
                slug = 'hash-' + slug;
            }
        }

        // Check the filtered slug doesn't match any of the reserved keywords
        return filters.doFilter('slug.reservedSlugs', config.get('slugs').reserved).then(function then(slugList) {
            // Some keywords cannot be changed
            slugList = _.union(slugList, utils.url.getProtectedSlugs());

            return _.includes(slugList, slug) ? slug + '-' + baseName : slug;
        }).then(function then(slug) {
            // if slug is empty after trimming use the model name
            if (!slug) {
                slug = baseName;
            }
            // Test for duplicate slugs.
            return checkIfSlugExists(slug);
        });
    },

    parseOrderOption: function (order, include) {
        var permittedAttributes, result, rules;

        permittedAttributes = this.prototype.permittedAttributes();
        if (include && include.indexOf('count.posts') > -1) {
            permittedAttributes.push('count.posts');
        }
        result = {};
        rules = order.split(',');

        _.each(rules, function (rule) {
            var match, field, direction;

            match = /^([a-z0-9_\.]+)\s+(asc|desc)$/i.exec(rule.trim());

            // invalid order syntax
            if (!match) {
                return;
            }

            field = match[1].toLowerCase();
            direction = match[2].toUpperCase();

            if (permittedAttributes.indexOf(field) === -1) {
                return;
            }

            result[field] = direction;
        });

        return result;
    }
});
