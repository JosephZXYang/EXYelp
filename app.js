/*==========================================================================*/
//Basic setup

var express    = require("express"),
	app 	   = express(),
	bodyParser = require("body-parser"),
	mongoose   = require("mongoose"),
	Campground = require("./models/campground"),
	Comment    = require("./models/comment"),
	seedDB	   = require("./seeds");

// For testing, reset db and create dummy data
//seedDB();

mongoose.connect("mongodb://localhost/yelp_camp", 
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	});


// Detect if connected to localhost db
var db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("Connected to database on local host.");
})


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));



/*==========================================================================*/
// Routes

app.get("/", function(req, res) {
	res.render("landing");
});

// INDEX - show all campgrounds
app.get("/campgrounds", function(req, res) {
	Campground.find({}, function(err, campgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: campgrounds});
		}
	})
});

// NEW - show up the form to create a new campground
app.get("/campgrounds/new", function(req, res) {
	res.render("campgrounds/new");
});

// CREATE - add new campground to db
app.post("/campgrounds", function(req, res) {
	var name = req.body.name;
	var url = req.body.url;
	var description = req.body.description;
	
	var newCampground = {
		name: name,
		image: url,
		description: description
	};
	
	// Create new entry in the db
	Campground.create(newCampground, function(error, campground) {
			if (error) {
				console.log(error);
			} else {
				console.log("NEWLY CREATED CAMPGROUND!");
				console.log(campground);
				// Render the page again
				Campground.find({}, function(err, newcampgrounds) {
					if (err) {
						console.log(err);
					} else {
						res.render("campgrounds/index", {campgrounds: newcampgrounds});
					}
				})
			}
		});
	
	
});

// SHOW - show more detail of one specific campground
app.get("/campgrounds/:id", function(req, res) {
	var id = req.params.id;
	Campground.findById(id).populate("comments").exec(function(err, foundCampground) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	})
});

// ========================
// COMMENTS ROUTES
// ========================

app.get("/campgrounds/:id/comments/new", function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if (err) {
			console.log(err);
		}
		else {
			res.render("comments/new", {campground: campground});
		}
	})
});

app.post("/campgrounds/:id/comments", function(req, res) {
	// lookup campground using ID
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		}
		else {
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					console.log(err);
				}
				else {
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			})
		}
	})
	// create new comment
	// connect new comment to campground
	// redirect campground show page
})

app.listen(process.env.PORT, process.env.IP, function () {
	console.log("The app is listening on PORT=" + process.env.PORT);
});


