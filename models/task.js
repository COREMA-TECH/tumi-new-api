const pg = require('pg');


let taskSchema = new  pg.Schema({
    title: {
       type: String,
       required: true
    },
    description: {
        type: String
    }
});


module.exports = pg.model('task', taskSchema);