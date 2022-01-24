const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(`${__dirname}/date.js`);

app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")
app.use(express.static("public"));
listItems = [];
let listItemsDB;
workItems = [];
let currentDay;
currentDay = date.getDate();

mongoose.connect("mongodb://localhost:27017/todoListDB");

const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "An items name is required"]
  }
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist"
});

const item2 = new Item({
  name: "Hit the + buttonn to add a new item"
});

const item3 = new Item({
  name: "<-- Hit tthis to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/:customList", (req, res)=>{
  customList = req.params.customList;


  List.findOne({name: customList}, (err, foundList)=>{
    if(!err){
      if (!foundList) {
        // Create new list
        const list = new List ({
              name: customList,
              items: defaultItems
            });

            list.save();

            res.redirect(`/${customList}`);

      } else {
        res.render("list", {listTitle: foundList.name, listItemx: foundList.items});
        console.log(foundList);
      }
    }
  });


});

app.get("/", (req, res)=>{

  weekDay = "";

  switch (currentDay) {
    case 0:
      weekDay = "Sunday";
      break;
    case 1:
      weekDay = "Monday";
      break;
    case 2:
      weekDay = "Tuesday";
      break;
    case 3:
      weekDay = "Wednesday";
      break;
    case 4:
      weekDay = "Thursday";
      break;
    case 5:
      weekDay = "Friday";
      break;
    case 6:
      weekDay = "Saturday";
      break;
    default:
      weekDay = "holla!";
      break;

  }

  Item.find({}, (err, items)=>{
    if (err) {
      console.log(err);
    } else {
      if (items.length === 0) {
        Item.insertMany(defaultItems, (err)=>{
          if (err) {
            console.log(err);
          } else {
            res.redirect("/");
          }
        })
      } else {

        res.render("list", {listTitle: "Today", listItemx: items});
      }

    }
  });

  // used to delete all items doc

  // Item.deleteMany({}, (err)=>{
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log("deleted all");
  //   }
  // });


})

app.post("/delete", (req, res)=>{
  const checkedItemID = req.body.checkbox;


  Item.deleteOne({_id: checkedItemID}, (err)=>{
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  })
})

app.post("/", (req, res)=>{

  listItem =  req.body.listItem;
  listType = req.body.list;

  const item = new Item({
    name: listItem
  });

  if (listType === "Today") {


    item.save();
    res.redirect("/");
  } else {

    List.findOne({name: listType}, (err, foundLists)=>{
      if (err) {
        console.log(err);
      } else {
        foundLists.items.push(item);
        foundLists.save();
        res.redirect(`/${listType}`);
      }
    });


  }

});

app.get("/work", (req, res)=>{
  listTitlex = "work";
  res.render("list", {listTitle: listTitlex, listItemx: workItems});
})


app.get("/about", (req, res)=>{
  res.render("about")
})




app.listen(3000, ()=>{
  console.log("Server started on port 3000");
})
