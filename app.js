const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const hbs = require("hbs");
const app = express();

mongoose.connect("mongodb://localhost:27017/work", {
  useNewUrlParser: true,
});

const WorkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "specify a title"],
  },
  description: { type: String },
  COMMENTS: { type: String },
  due_date: Date
});
const Work = mongoose.model("Work", WorkSchema);

app.use(express.json());
app.use(express.urlencoded());
app.use(methodOverride("_method"));
app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);

// app.get('/' , (req, res) => {res.render('index')});
// app.get('/test' , (req, res) => {
//     res.status(200).render('testdoc' , {arr : ['airbus' , 'boeing' , 'learjet' , 'bombardier' , 'mcdowell douglas' , 'piperCub']});

// });
//handlers

const GetAllWorks = async (req, res) => {
  try {
      // const element = await Work.find();
      let element =  Work.find();
      element = element.sort({due_date : -1});
      element = await element;
      
      res.status(200).render('index' , {Works : element});
  } catch (error) {
    //   alert('Error');
    //   next();
  }
};

const deleteWorkById = async (req, res) => {
  try {
      await Work.findByIdAndDelete(req.params.id);
      res.status(302).redirect('/');
  } catch (error) {}
};

const createWork = async (req, res) => {
  try {
      console.log(req.body)
      // const cratedDoc = await Work.create(req.body);
      const taskdocument = {
        title: req.body.title,
        description: req.body.description,
        COMMENTS : req.body.COMMENTS,
        due_date: new Date(req.body.due_date)
      }

      const cratedDoc = await Work.create(taskdocument);
      res.status(302).redirect('/');
  } catch (error) {}
};

const UpdateWorkById = async (req, res) => {
  try {

      // const newdocforupdation = {

      // }
      const UpdatedDoc = await Work.findByIdAndUpdate(req.params.id , req.body);
      res.status(302).redirect('/');

  } catch (error) {

  }
};

const ReadMore = async (req, res) => {

    try {
        const ReadTask = await Work.findById(req.params.id);
        // const ReadTask = await 
        res.status(200).render('ReadMore' , {Required_task : ReadTask});
    } catch (error) {
        console.log(error.message);
           
    }
}

const renderUpdatePage = async (req, res) => {

    const element = await Work.findById(req.params.id);
    res.status(200).render('edit' , {id :req.params.id , work : element  })

}
//

app.get("/", GetAllWorks);
// app.get("/edit/:id", (req, res) => {
//     res.status(200).render('edit' , {id: req.params.id});
// });
app.get("/edit/:id", renderUpdatePage);


app.delete("/delete/:id", deleteWorkById);
app.post("/create", createWork);
app.put("/edit/:id", UpdateWorkById);
app.get("/ReadMore/:id" , ReadMore);

app.listen(5555);
