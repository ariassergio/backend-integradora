const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');
const GitHubStrategy = require('passport-github').Strategy; // Importar la estrategia de GitHub

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

passport.use(
    "github",
    new GitHubStrategy(
        {
            clientID: "Iv1.7ac41720c7cfad7c", // ID de la aplicación en GitHub
            clientSecret: "b253559b80d5f9a984d2c0276245cf7b314210be", // Clave secreta de la aplicación en GitHub
            callbackURL: "http://localhost:8080/api/sessions/githubcallback", // URL de callback de GitHub
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log(profile);
                const user = await User.findOne({
                    email: profile._json.email,
                });
                if (!user) {
                    const newUser = {
                        first_name: profile._json.name,
                        last_name: "",
                        age: 20,
                        email: profile._json.email,
                        password: "",
                    };
                    let createdUser = await userService.create(newUser);
                    done(null, createdUser);
                } else {
                    done(null, user);
                }
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;
