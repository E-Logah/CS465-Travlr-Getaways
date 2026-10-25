const tripsEndpoint = `http://localhost:${process.env.PORT || 3000}/api/trips`;
const options = {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
};

// GET travel page - trips now come from the REST API instead of trips.json
const travel = async (req, res) => {
    try {
        const response = await fetch(tripsEndpoint, options);
        let trips = await response.json();
        let message = null;
        if (!(trips instanceof Array)) {
            message = 'API lookup error';
            trips = [];
        } else if (!trips.length) {
            message = 'No trips exist in our database!';
        }
        res.render('travel', {
            title: 'Travlr Getaways',
            heading: 'Travel',
            trips: trips,
            message: message
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = {
    travel
};
