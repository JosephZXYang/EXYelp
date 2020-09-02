var mongoose   = require("mongoose"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment");

var data = [
    {name: "Cloud's Rest", image: "https://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5284576.jpg", description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis quisquam eveniet reiciendis, maiores amet dicta modi labore aut aliquam quia sapiente? Ipsam impedit magnam quos quas, dignissimos placeat inventore optio.", comments: []},
    {name: "Desert", image: "https://hipcamp-res.cloudinary.com/images/c_limit,f_auto,h_1200,q_60,w_1920/v1521949949/campground-photos/mxiltfdfgemgvzumiccn/desert-views-mojave-stars-camp-southern-california-tent-mountain-desert.jpg", description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis quisquam eveniet reiciendis, maiores amet dicta modi labore aut aliquam quia sapiente? Ipsam impedit magnam quos quas, dignissimos placeat inventore optio.", comments: []},
    {name: "Sunset", image: "https://3.bp.blogspot.com/-afMAqFKN86I/WbqlAaoNYFI/AAAAAAAA3WI/phMoykdWjOsdnBh6rRHXUh7t4kiv1UjYgCLcBGAs/s1600/Show%2Band%2B12%2BMile%2B013.jpg", description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis quisquam eveniet reiciendis, maiores amet dicta modi labore aut aliquam quia sapiente? Ipsam impedit magnam quos quas, dignissimos placeat inventore optio.", comments: []}
]

function seedDB() {
    // Remove all campgrounds
    Campground.deleteMany({}, function(err){
        if (err) {
            console.log(err);
        }
        console.log("Removed all campgrounds!")

        // Remove all comments
        Comment.deleteMany({}, function(err) {
            if (err) {
                console.log(err);
            }
            console.log("Removed all comments!");
            // Add a few campgrounds
            data.forEach(function(demo) {
                Campground.create(demo, function(err, campground){
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("Added a demo campground");
                        // Create a comment
                        Comment.create(
                            {
                                text: "Love this place!",
                                author: "Tim"
                            }, function(err, comment) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            }
                        )
                    }
                })
            });
        });
    });

    
}

module.exports = seedDB;