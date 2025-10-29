module.exports = validate => (req, res, next) => {
    const {errors, isValid} = validate(req.body);
    if(!isValid) {
        items = Object.keys(errors);
        for (item of items) {
            req.flash(item, errors[item]);
        }
        return res.redirect('/login');
    }
    next();
}