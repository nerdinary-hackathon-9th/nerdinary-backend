import { userSignup, userLogin } from "../services/auth.service.js"
import { successHandler } from "../middleware/responseHandler.js";

export const handleLogin = async (req, res, next) => {
    try {
        console.log(req.body);

        const nickname = req.body.nickname;
        const password = req.body.password;

        const user = await userLogin(nickname, password);
        return successHandler(res, '로그인 완료', { id: user.id });
    
    } catch (err) {
        next(err);
    }
};

export const handleSignup = async (req, res, next) => {
    try {
        console.log(req.body);

        const nickname = req.body.nickname;
        const password = req.body.password;

        const user = await userSignup({nickname, password});
        return successHandler(res, '회원가입 완료', { id: user.id });
    } catch (err) {
        next(err);
    }
};