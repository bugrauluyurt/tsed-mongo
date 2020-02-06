import { AfterRoutesInit, BeforeRoutesInit, Configuration, ExpressApplication, Inject, Service } from "@tsed/common";
import * as Passport from "passport/lib";
import { Strategy as LocalStrategy } from "passport-local";
import { BadRequest, NotFound } from "ts-httpexceptions";
import { UsersService } from "../users/UsersService";
import { User } from "../../models/users/User";
import { logWithColor } from "../../../utils/default";
import * as bcrypt from "bcrypt";
import * as _ from "lodash";

@Service()
export class PassportLocalService implements BeforeRoutesInit, AfterRoutesInit {

    constructor(private usersService: UsersService,
                @Configuration() private configuration: Configuration,
                @Inject(ExpressApplication) private  expressApplication: ExpressApplication) {
        // used to serialize the user for the session
        Passport.serializeUser(PassportLocalService.serialize);
        // used to deserialize the user
        Passport.deserializeUser(this.deserialize.bind(this));
    }

    static serialize(user: User, done) {
        done(null, user._id);
    }

    $beforeRoutesInit() {
        const options: any = this.configuration.get("passport") || {} as any;
        const {userProperty, pauseStream} = options;

        this.expressApplication.use(Passport.initialize({userProperty}));
        this.expressApplication.use(Passport.session({pauseStream}));
    }

    $afterRoutesInit() {
        logWithColor("PassportLocalService", "Initialized afterRoutesInit");
        this.initializeSignup();
        this.initializeLogin();
    }

    public deserialize(id, done) {
        done(null, this.usersService.findById(id));
    }

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    public initializeSignup() {
        Passport
            .use("signup", new LocalStrategy({
                // by default, local strategy uses username and password, we will override with email
                usernameField: "email",
                passwordField: "password",
                passReqToCallback: true // allows us to pass back the entire request to the callback
            }, this.verify.bind(this)));
    }

    verify(req, email, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        // process.nextTick(() => {
        this.signup({
            name: req.body.name,
            email,
            password
        })
            .then((user) => done(null, user))
            .catch((err) => done(err));
        // });
    }

    /**
     *
     * @param user
     * @returns {Promise<any>}
     */
    async signup(user: Partial<User>) {
        const exists = await this.usersService.findByEmail(user.email);

        if (exists) {
            throw new BadRequest("Email is already registered");
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);
        // Create new User
        const createdUser = await this.usersService.save(<User>{
            name: user.name,
            email: user.email,
            password: hashedPassword,
        });
        createdUser.password = undefined;
        return createdUser;
    }

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    public initializeLogin() {
        Passport.use("login", new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true // allows us to pass back the entire request to the callback
        }, (req, email, password, done) => {
            this.login(email, password)
                .then((user) => done(null, user))
                .catch((err) => done(err));
        }));
    }

    /**
     *
     * @param email
     * @param password
     * @returns {Promise<boolean>}
     */
    async login(email: string, password: string): Promise<Partial<User>> {
        const user = await this.usersService.findByEmail(email);
        const notFoundErr = new NotFound("User not found");
        if (!user) {
            throw notFoundErr;
        }
        const doPasswordsMatch = await bcrypt.compare(password, user.password);
        if (!doPasswordsMatch) {
            throw notFoundErr;
        }
        user.password = undefined;
        return user;
    }
}
