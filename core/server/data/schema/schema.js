/**
 * schema
 */
module.exports = {

    /**
     *  用戶表
     */
    users: {
        id: {type: 'increments',
            nullable: false,
            primary: true},
        uuid: {type: 'string',
            maxlength: 36,
            nullable: false,
            validations: {isUUID: true}},
        name: {type: 'string',
            maxlength: 150,
            nullable: false},
        password: {type: 'string',
            maxlength: 60,
            nullable: false},
        email: {type: 'string',
            maxlength: 254,
            nullable: false,
            unique: true,
            validations: {isEmail: true}},
        image: {type: 'text',
            maxlength: 2000,
            nullable: true},
        status: {type: 'string',
            maxlength: 150,
            nullable: false,
            defaultTo: 'active'},
        description: {type: 'string',
            maxlength: 200,
            nullable: true},
        lastLoginT: {type: 'dateTime',
            nullable: true},
        createTime: {type: 'dateTime',
            nullable: false},
        updateTime: {type: 'dateTime',
            nullable: true}
    }
};
