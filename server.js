const app = require('./app');
const PORT = process.env.PORT || 4000;


app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});










































// const uri = "mongodb+srv://admin:<password>@cluster0.clqvf.mongodb.net/<dbname>?retryWrites=true&w=majority";
// const uri = "mongodb+srv://admin:admin@cluster0.clqvf.mongodb.net/db_test?retryWrites=true&w=majority&ssl=true";

// try {
//     // Connect to the MongoDB cluster
//     mongoose.connect(
//         uri,
//         { useNewUrlParser: true, useUnifiedTopology: true },
//         () => console.log(" Mongoose is connected")
//     );
//
// } catch (e) {
//     console.log("could not connect");
// }

// const connection = mongoose.connection;
//
// connection.once('open', function() {
//     console.log("MongoDB database connection established successfully");
// })

// let Todo = require('./model/todo.model');
// let User = require('./model/user.model');


// todoRoutes.route('/').get(function(req, res) {
//     console.log("hi")
//     Todo.find(function(err, todos) {
//         if (err) {
//             console.log(err);
//         } else {
//             return res.json(todos);
//         }
//     });
// });

// todoRoutes.route('/:id').get(function(req, res) {
//     let id = req.params.id;
//     Todo.findById(id, function(err, todo) {
//         res.json(todo);
//     });
// });
// todoRoutes.route('/update/:id').post(function(req, res) {
//     Todo.findById(req.params.id, function(err, todo) {
//         if (!todo)
//             res.status(404).send("data is not found");
//         else
//             todo.todo_description = req.body.todo_description;
//         todo.todo_responsible = req.body.todo_responsible;
//         todo.todo_priority = req.body.todo_priority;
//         todo.todo_completed = req.body.todo_completed;
//         todo.save().then(todo => {
//             res.json('Todo updated!');
//         })
//             .catch(err => {
//                 res.status(400).send("Update not possible");
//             });
//     });
// });

// todoRoutes.route('/add').post(function(req, res) {
//     let todo = new Todo(req.body);
//     todo.save()
//         .then(todo => {
//             res.status(200).json({'todo': 'todo added successfully'});
//         })
//         .catch(err => {
//             console.log(err)
//             res.status(400).send('adding new todo failed');
//         });
// });




