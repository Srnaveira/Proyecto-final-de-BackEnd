const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
};

const isNotAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        res.redirect('/api/products');
    }
};

const isAdmin = (req, res, next) =>{
    if(req.isAuthenticated && req.user.rol === "admin"){
        return next()
    } else{
        return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
}


const isUser = (req, res, next) => {
    if(req.isAuthenticated && req.user.rol === "user"){
        return next()
    } else {
        res.status(403).json({ message: 'Forbiden: User only'})
    }
}

const isPremium = (req, res, next) => {
    if(req.isAuthenticated && req.user.rol === "premium"){
        return next()
    } else {
        res.status(403).json({ message: 'Forbiden: user Premium only'})
    }
}

const isUserOrPremium = (req, res, next) => {
    if(req.isAuthenticated && (req.user.rol === "premium" || req.user.rol === "user") ){
        return next()
    } else {
        res.status(403).json({ message: 'Forbiden: User only (Basic or Premium)'})
    }

}

module.exports = {
    isAuthenticated,
    isNotAuthenticated,
    isAdmin,
    isUser,
    isPremium,
    isUserOrPremium
}